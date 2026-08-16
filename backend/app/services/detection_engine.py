"""
detection_engine.py

Detection Engine module for the University Security Monitoring & Threat
Detection Platform.

Responsibility (and ONLY responsibility):
    Given a single ActivityLog record, evaluate it against every rule in
    RULE_LIBRARY and return the list of Alert objects that were triggered.

Out of scope for this module: committing to the database, sending
notifications, AI analysis — anything downstream of "list of Alert
objects".

This platform is multi-university. Every ActivityLog and every Alert
belongs to exactly one university via `university_id`. All historical
comparisons performed by this engine are scoped to the university of the
ActivityLog currently being evaluated, and every Alert created carries
that same university_id forward.
"""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any, Dict, List, Optional, Tuple

from app.models import ActivityLog, Alert
from app.services.detection_rules import RULE_LIBRARY

logger = logging.getLogger(__name__)

# Internal (non-configurable-by-design) implementation constant: how far
# back to look when grouping LOGIN events into "concurrent sessions" for
# R006. RULE_LIBRARY["R006"]["config"] only defines max_active_sessions,
# not a window, so this stays a local constant rather than an invented
# RULE_LIBRARY key.


class DetectionEngine:
    """Evaluates a single ActivityLog against every rule in RULE_LIBRARY."""

    RULE_DISPATCH: List[Tuple[str, str]] = [
        ("R001", "_rule_multiple_failed_logins"),
        ("R002", "_rule_impossible_travel"),
        ("R003", "_rule_unknown_device_login"),
        ("R004", "_rule_unknown_ip_login"),
        ("R005", "_rule_login_outside_business_hours"),
        ("R006", "_rule_concurrent_login_sessions"),
        ("R007", "_rule_dormant_account_login"),
        ("R008", "_rule_bulk_email"),
        ("R009", "_rule_suspicious_attachment_distribution"),
        ("R010", "_rule_external_domain_mass_email"),
        ("R011", "_rule_large_file_download"),
        ("R012", "_rule_sensitive_file_download"),
        ("R013", "_rule_excessive_file_upload"),
        ("R014", "_rule_file_deletion_spike"),
        ("R015", "_rule_database_mass_download"),
        ("R016", "_rule_sensitive_database_access"),
        ("R017", "_rule_repeated_database_query_failures"),
        ("R018", "_rule_malware_detected"),
        ("R019", "_rule_unauthorized_application_installation"),
        ("R020", "_rule_usb_device_connected"),
        ("R021", "_rule_antivirus_disabled"),
        ("R022", "_rule_firewall_blocked_request"),
        ("R023", "_rule_vpn_login_unknown_location"),
        ("R024", "_rule_privilege_escalation"),
        ("R025", "_rule_audit_log_tampering"),
    ]

    # =========================================================================
    # Initialization
    # =========================================================================
    def __init__(self, db_session):
        self.db = db_session
        self._cache: Dict[Tuple, Any] = {}
        self._activity_log: Optional[ActivityLog] = None
        self._metadata: Dict[str, Any] = {}

    # =========================================================================
    # Main Detection Pipeline
    # =========================================================================
    def run_detection(self, activity_log: ActivityLog) -> List[Alert]:
        self._activity_log = activity_log
        self._metadata = self._get_metadata(activity_log)
        self._cache = {}

        alerts: List[Alert] = []

        for rule_id, method_name in self.RULE_DISPATCH:
            try:
                rule_method = getattr(self, method_name)
                result = rule_method(activity_log)
            except Exception:
                logger.exception(
                    "Rule %s (%s) raised an exception during evaluation; "
                    "skipping and continuing with remaining rules.",
                    rule_id,
                    RULE_LIBRARY.get(rule_id, {}).get("rule_name", "unknown"),
                )
                continue

            if not result:
                continue
            if isinstance(result, list):
                alerts.extend(a for a in result if a is not None)
            else:
                alerts.append(result)

        return alerts

    # =========================================================================
    # Alert Creation
    # =========================================================================
    def _create_alert(
        self,
        activity_log,
        rule_id,
        details,
        extra_metadata=None,
    ):

        rule = RULE_LIBRARY[rule_id]

        severity = rule["severity"]

        if severity == "LOW":
            status = "RESOLVED"
            resolved_at = activity_log.timestamp
        else:
            status = "OPEN"
            resolved_at = None

        metadata = {"rule_id": rule_id}

        if extra_metadata:
            metadata.update(extra_metadata)

        return Alert(
            university_id=activity_log.university_id,
            rule_id=rule["rule_id"],
            rule_name=rule["rule_name"],
            category=rule["category"],
            severity=severity,
            title=rule["title"],
            description=details,
            user_name=activity_log.user_name,
            user_email=activity_log.user_email,
            source_event_id=activity_log.event_id,
            triggered_at=activity_log.timestamp,
            activity_log_id=activity_log.id,
            alert_metadata=metadata,

            status=status,
            resolved_at=resolved_at,
            assigned_role=None
        )
    # =========================================================================
    # Query Helpers (cached per detection run)
    # =========================================================================
    def _cached(self, key: Tuple, loader):
        if key not in self._cache:
            self._cache[key] = loader()
        return self._cache[key]

    def _query_history_by_type(
        self,
        university_id: int,
        user_email: str,
        event_types: Tuple[str, ...],
        before,
        since=None,
    ) -> List[ActivityLog]:
        """All events of the given event_type(s) for a user before `before`
        (optionally since a lower bound), newest first, scoped to a single
        university. Shared by every history-comparison rule (R002-R004,
        R006, R007, R023)."""

        cache_key = (
            "history_by_type",
            university_id,
            user_email,
            event_types,
            since,
            before,
        )

        def loader():
            query = (
                self.db.query(ActivityLog)
                .filter(ActivityLog.university_id == university_id)
                .filter(ActivityLog.user_email == user_email)
                .filter(ActivityLog.event_type.in_(event_types))
                .filter(ActivityLog.timestamp < before)
            )
            if since is not None:
                query = query.filter(ActivityLog.timestamp >= since)
            return query.order_by(ActivityLog.timestamp.desc()).all()

        return self._cached(cache_key, loader)

    def _query_events_in_window(
        self,
        university_id: int,
        user_email: str,
        event_types: Tuple[str, ...],
        end,
        window_minutes: int,
    ) -> List[ActivityLog]:
        """All events of the given event_type(s) for a user within
        `window_minutes` before `end`, scoped to a single university.
        Shared by every threshold/spike rule (R001, R009, R013, R014, R017)."""

        cache_key = (
            "events_window",
            university_id,
            user_email,
            event_types,
            window_minutes,
            end,
        )

        def loader():
            start = end - timedelta(minutes=window_minutes)
            return (
                self.db.query(ActivityLog)
                .filter(ActivityLog.university_id == university_id)
                .filter(ActivityLog.user_email == user_email)
                .filter(ActivityLog.event_type.in_(event_types))
                .filter(ActivityLog.timestamp >= start)
                .filter(ActivityLog.timestamp <= end)
                .order_by(ActivityLog.timestamp.asc())
                .all()
            )

        return self._cached(cache_key, loader)

    # =========================================================================
    # Metadata Helpers
    # =========================================================================
    def _get_metadata(self, activity_log: ActivityLog) -> Dict[str, Any]:
        return getattr(activity_log, "event_metadata", None) or {}

    def _metadata_for(self, activity_log: ActivityLog) -> Dict[str, Any]:
        if activity_log is self._activity_log:
            return self._metadata
        return getattr(activity_log, "event_metadata", None) or {}

    # =========================================================================
    # Utility Helpers
    # =========================================================================
    @staticmethod
    def _minutes_between(t1, t2) -> float:
        return abs((t2 - t1).total_seconds()) / 60.0

    @staticmethod
    def _is_business_hours(timestamp, config: Dict[str, Any]) -> bool:
        return config["business_start_hour"] <= timestamp.hour < config["business_end_hour"]

    # =========================================================================
    # Authentication Rules
    # =========================================================================
    def _rule_multiple_failed_logins(self, log: ActivityLog) -> Optional[Alert]:
        # R001 — the generator emits FAILED_LOGIN as its own event_type.
        if log.event_type != "FAILED_LOGIN":
            return None
        config = RULE_LIBRARY["R001"]["config"]
        recent = self._query_events_in_window(
            log.university_id,
            log.user_email,
            ("FAILED_LOGIN",),
            log.timestamp,
            config["time_window_minutes"],
        )
        if len(recent) >= config["threshold"]:
            return self._create_alert(
                log,
                "R001",
                f"{len(recent)} failed login attempts for {log.user_email} in "
                f"{config['time_window_minutes']} minutes.",
                {"failure_count": len(recent), "time_window_minutes": config["time_window_minutes"]},
            )
        return None

    def _rule_impossible_travel(self, log: ActivityLog) -> Optional[Alert]:
        # R002
        if log.event_type not in ("LOGIN", "VPN_LOGIN"):
            return None
        config = RULE_LIBRARY["R002"]["config"]
        history = self._query_history_by_type(
            log.university_id, log.user_email, ("LOGIN", "VPN_LOGIN"), log.timestamp
        )
        previous = history[0] if history else None
        if previous is None or not previous.location or not log.location:
            return None
        if previous.location == log.location:
            return None

        minutes = self._minutes_between(previous.timestamp, log.timestamp)
        if minutes > config["max_travel_time_minutes"]:
            return None

        return self._create_alert(
            log,
            "R002",
            f"Login from {log.location} only {round(minutes, 1)} minutes after a login "
            f"from {previous.location} for {log.user_email} — exceeds the "
            f"{config['max_travel_time_minutes']}-minute plausible travel window.",
            {
                "previous_location": previous.location,
                "current_location": log.location,
                "minutes_between": round(minutes, 1),
            },
        )

    def _rule_unknown_device_login(self, log: ActivityLog) -> Optional[Alert]:
        # R003 — direct signal from the generator's UNKNOWN_DEVICE event,
        # plus the historical "never seen this device before" check on
        # ordinary LOGIN events. Config is empty, so history is all-time.
        if log.event_type == "UNKNOWN_DEVICE":
            return self._create_alert(
                log,
                "R003",
                f"Unknown device flagged for {log.user_email}: {log.device}.",
                {"device": log.device},
            )
        if log.event_type != "LOGIN" or not log.device:
            return None
        history = self._query_history_by_type(
            log.university_id, log.user_email, ("LOGIN",), log.timestamp
        )
        known_devices = {h.device for h in history if h.device}
        if log.device not in known_devices:
            return self._create_alert(
                log,
                "R003",
                f"Login for {log.user_email} from a device not seen before: {log.device}.",
                {"device": log.device},
            )
        return None

    def _rule_unknown_ip_login(self, log: ActivityLog) -> Optional[Alert]:
        # R004 — same pattern as R003, driven by the UNKNOWN_IP event plus
        # all-time IP history on LOGIN events.
        if log.event_type == "UNKNOWN_IP":
            return self._create_alert(
                log,
                "R004",
                f"Unknown IP flagged for {log.user_email}: {log.ip_address}.",
                {"ip_address": log.ip_address},
            )
        if log.event_type != "LOGIN" or not log.ip_address:
            return None
        history = self._query_history_by_type(
            log.university_id, log.user_email, ("LOGIN",), log.timestamp
        )
        known_ips = {h.ip_address for h in history if h.ip_address}
        if log.ip_address not in known_ips:
            return self._create_alert(
                log,
                "R004",
                f"Login for {log.user_email} from a new IP address: {log.ip_address}.",
                {"ip_address": log.ip_address},
            )
        return None

    def _rule_login_outside_business_hours(self, log: ActivityLog) -> Optional[Alert]:
        # R005
        if log.event_type != "LOGIN":
            return None
        config = RULE_LIBRARY["R005"]["config"]
        if not self._is_business_hours(log.timestamp, config):
            return self._create_alert(
                log,
                "R005",
                f"Login for {log.user_email} outside business hours "
                f"({config['business_start_hour']}:00-{config['business_end_hour']}:00) "
                f"at {log.timestamp.strftime('%Y-%m-%d %H:%M')}.",
                {"login_hour": log.timestamp.hour},
            )
        return None

    def _rule_concurrent_login_sessions(self, log: ActivityLog) -> Optional[Alert]:
        # R006
        if log.event_type != "LOGIN":
            return None
        config = RULE_LIBRARY["R006"]["config"]
        history = self._query_history_by_type(
            log.university_id,
            log.user_email,
            ("LOGIN",),
            log.timestamp,
            since=log.timestamp - timedelta(minutes=config["time_window_minutes"]),
        )
        recent_locations = {h.location for h in history if h.location}
        recent_locations.add(log.location)
        if len(recent_locations) > config["max_active_sessions"]:
            return self._create_alert(
                log,
                "R006",
                f"{len(recent_locations)} concurrent login locations for "
                f"{log.user_email} within {config['time_window_minutes']} minutes: "
                f"{sorted(recent_locations)}.",
                {"locations": sorted(recent_locations)},
            )
        return None

    def _rule_dormant_account_login(self, log: ActivityLog) -> Optional[Alert]:
        # R007
        if log.event_type != "LOGIN":
            return None
        config = RULE_LIBRARY["R007"]["config"]
        history = self._query_history_by_type(
            log.university_id, log.user_email, ("LOGIN",), log.timestamp
        )
        if not history:
            return None
        idle_days = (log.timestamp - history[0].timestamp).days
        if idle_days >= config["inactive_days"]:
            return self._create_alert(
                log,
                "R007",
                f"Login for {log.user_email} after {idle_days} days of inactivity "
                f"(threshold {config['inactive_days']} days).",
                {"idle_days": idle_days},
            )
        return None

    # =========================================================================
    # Email Rules
    # =========================================================================
    def _rule_bulk_email(self, log: ActivityLog) -> Optional[Alert]:
        # R008
        if log.event_type not in ("EMAIL_SENT", "BULK_EMAIL"):
            return None
        config = RULE_LIBRARY["R008"]["config"]
        metadata = self._metadata_for(log)
        recipient_count = metadata.get("recipient_count", 0)
        if recipient_count >= config["recipient_threshold"]:
            return self._create_alert(
                log,
                "R008",
                f"Email sent by {log.user_email} to {recipient_count} recipients "
                f"(threshold {config['recipient_threshold']}).",
                {"recipient_count": recipient_count},
            )
        return None

    def _rule_suspicious_attachment_distribution(self, log: ActivityLog) -> Optional[Alert]:
        # R009 — spike of attachment-bearing emails within a window.
        if log.event_type not in ("EMAIL_SENT", "BULK_EMAIL"):
            return None
        metadata = self._metadata_for(log)
        if not metadata.get("attachment"):
            return None
        config = RULE_LIBRARY["R009"]["config"]
        recent = self._query_events_in_window(
            log.university_id,
            log.user_email,
            ("EMAIL_SENT", "BULK_EMAIL"),
            log.timestamp,
            config["time_window_minutes"],
        )
        with_attachment = [e for e in recent if self._metadata_for(e).get("attachment")]
        if len(with_attachment) >= config["attachment_count_threshold"]:
            return self._create_alert(
                log,
                "R009",
                f"{log.user_email} sent {len(with_attachment)} attachment-bearing emails "
                f"in {config['time_window_minutes']} minutes.",
                {"attachment_email_count": len(with_attachment)},
            )
        return None

    def _rule_external_domain_mass_email(self, log: ActivityLog) -> Optional[Alert]:
        # R010
        if log.event_type not in ("EMAIL_SENT", "BULK_EMAIL"):
            return None
        config = RULE_LIBRARY["R010"]["config"]
        metadata = self._metadata_for(log)
        external_count = metadata.get("external_recipient_count", 0)
        if external_count >= config["external_recipient_threshold"]:
            return self._create_alert(
                log,
                "R010",
                f"Email from {log.user_email} sent to {external_count} external "
                f"recipients (threshold {config['external_recipient_threshold']}).",
                {"external_recipient_count": external_count},
            )
        return None

    # =========================================================================
    # File Activity Rules
    # =========================================================================
    def _rule_large_file_download(self, log: ActivityLog) -> Optional[Alert]:
        # R011
        if log.event_type != "FILE_DOWNLOAD":
            return None
        config = RULE_LIBRARY["R011"]["config"]
        metadata = self._metadata_for(log)
        size_mb = metadata.get("file_size_mb", 0)
        if size_mb >= config["file_size_threshold_mb"]:
            return self._create_alert(
                log,
                "R011",
                f"{log.user_email} downloaded {metadata.get('file_name', 'a file')} "
                f"({size_mb} MB, threshold {config['file_size_threshold_mb']} MB).",
                {"file_name": metadata.get("file_name"), "file_size_mb": size_mb},
            )
        return None

    def _rule_sensitive_file_download(self, log: ActivityLog) -> Optional[Alert]:
        # R012
        if log.event_type != "FILE_DOWNLOAD":
            return None
        metadata = self._metadata_for(log)
        if metadata.get("is_sensitive"):
            return self._create_alert(
                log,
                "R012",
                f"{log.user_email} downloaded a sensitive file: "
                f"{metadata.get('file_name', 'unknown')}.",
                {"file_name": metadata.get("file_name")},
            )
        return None

    def _rule_excessive_file_upload(self, log: ActivityLog) -> Optional[Alert]:
        # R013
        if log.event_type != "FILE_UPLOAD":
            return None
        config = RULE_LIBRARY["R013"]["config"]
        recent = self._query_events_in_window(
            log.university_id,
            log.user_email,
            ("FILE_UPLOAD",),
            log.timestamp,
            config["time_window_minutes"],
        )
        if len(recent) >= config["upload_threshold"]:
            return self._create_alert(
                log,
                "R013",
                f"{log.user_email} performed {len(recent)} file uploads in "
                f"{config['time_window_minutes']} minutes.",
                {"upload_count": len(recent)},
            )
        return None

    def _rule_file_deletion_spike(self, log: ActivityLog) -> Optional[Alert]:
        # R014
        if log.event_type != "FILE_DELETE":
            return None
        config = RULE_LIBRARY["R014"]["config"]
        recent = self._query_events_in_window(
            log.university_id,
            log.user_email,
            ("FILE_DELETE",),
            log.timestamp,
            config["time_window_minutes"],
        )
        if len(recent) >= config["deletion_threshold"]:
            return self._create_alert(
                log,
                "R014",
                f"{log.user_email} deleted {len(recent)} files in "
                f"{config['time_window_minutes']} minutes.",
                {"deletion_count": len(recent)},
            )
        return None

    # =========================================================================
    # Database Rules
    # =========================================================================
    def _rule_database_mass_download(self, log: ActivityLog) -> Optional[Alert]:
        # R015
        if log.event_type != "DATABASE_DOWNLOAD":
            return None
        config = RULE_LIBRARY["R015"]["config"]
        metadata = self._metadata_for(log)
        records = metadata.get("records_downloaded", 0)
        if records >= config["record_threshold"]:
            return self._create_alert(
                log,
                "R015",
                f"{log.user_email} downloaded {records} records from "
                f"{metadata.get('table', 'a table')} (threshold {config['record_threshold']}).",
                {"table": metadata.get("table"), "records_downloaded": records},
            )
        return None

    def _rule_sensitive_database_access(self, log: ActivityLog) -> Optional[Alert]:
        # R016
        if log.event_type not in ("DATABASE_ACCESS", "DATABASE_DOWNLOAD"):
            return None
        metadata = self._metadata_for(log)
        if metadata.get("is_sensitive_table"):
            return self._create_alert(
                log,
                "R016",
                f"{log.user_email} accessed sensitive table "
                f"{metadata.get('table', 'unknown')}.",
                {"table": metadata.get("table")},
            )
        return None

    def _rule_repeated_database_query_failures(self, log: ActivityLog) -> Optional[Alert]:
        # R017
        if log.event_type not in ("DATABASE_ACCESS", "DATABASE_DOWNLOAD"):
            return None
        metadata = self._metadata_for(log)
        if metadata.get("query_status") != "FAILED":
            return None
        config = RULE_LIBRARY["R017"]["config"]
        recent = self._query_events_in_window(
            log.university_id,
            log.user_email,
            ("DATABASE_ACCESS", "DATABASE_DOWNLOAD"),
            log.timestamp,
            config["time_window_minutes"],
        )
        failures = [e for e in recent if self._metadata_for(e).get("query_status") == "FAILED"]
        if len(failures) >= config["failure_threshold"]:
            return self._create_alert(
                log,
                "R017",
                f"{log.user_email} triggered {len(failures)} failed database queries "
                f"in {config['time_window_minutes']} minutes.",
                {"failure_count": len(failures)},
            )
        return None

    # =========================================================================
    # Endpoint Rules
    # =========================================================================
    def _rule_malware_detected(self, log: ActivityLog) -> Optional[Alert]:
        # R018
        if log.event_type != "MALWARE_DETECTED":
            return None
        metadata = self._metadata_for(log)
        return self._create_alert(
            log,
            "R018",
            f"Malware detected on {log.device or 'a device'} used by {log.user_email}: "
            f"{metadata.get('malware_name', 'unknown')}.",
            {"malware_name": metadata.get("malware_name")},
        )

    def _rule_unauthorized_application_installation(self, log: ActivityLog) -> Optional[Alert]:
        # R019
        if log.event_type != "APPLICATION_INSTALL":
            return None
        metadata = self._metadata_for(log)

        if metadata.get("authorized", True):
            return None
        return self._create_alert(
            log,
            "R019",
            f"Unauthorized application installed on {log.device or 'a device'} "
            f"used by {log.user_email}: {metadata.get('application', 'unknown')}.",
            {"application": metadata.get("application")},
        )

    def _rule_usb_device_connected(self, log: ActivityLog) -> Optional[Alert]:
        # R020
        if log.event_type != "USB_CONNECTED":
            return None
        metadata = self._metadata_for(log)
        return self._create_alert(
            log,
            "R020",
            f"USB device connected by {log.user_email}: "
            f"{metadata.get('device_name', 'unknown device')}.",
            {"device_name": metadata.get("device_name")},
        )

    def _rule_antivirus_disabled(self, log: ActivityLog) -> Optional[Alert]:
        # R021
        if log.event_type != "ANTIVIRUS_DISABLED":
            return None
        metadata = self._metadata_for(log)

        if metadata.get("action") != "DISABLED":
            return None
        return self._create_alert(
            log,
            "R021",
            f"Antivirus disabled on {log.device or 'a device'} used by {log.user_email}.",
            {},
        )

    # =========================================================================
    # Network Rules
    # =========================================================================
    def _rule_firewall_blocked_request(self, log: ActivityLog) -> Optional[Alert]:
        # R022 — no window/count config, so this is a direct per-event trigger.
        if log.event_type != "FIREWALL_BLOCK":
            return None
        return self._create_alert(
            log,
            "R022",
            f"Firewall blocked a request for {log.user_email}.",
            {},
        )

    def _rule_vpn_login_unknown_location(self, log: ActivityLog) -> Optional[Alert]:
        # R023 — no lookback config, so history is all-time.
        if log.event_type != "VPN_LOGIN":
            return None
        history = self._query_history_by_type(
            log.university_id, log.user_email, ("VPN_LOGIN",), log.timestamp
        )
        known_locations = {h.location for h in history if h.location}
        if log.location and log.location not in known_locations:
            return self._create_alert(
                log,
                "R023",
                f"VPN login for {log.user_email} from a new location: {log.location}.",
                {"location": log.location},
            )
        return None

    # =========================================================================
    # Privilege Rules
    # =========================================================================
    def _rule_privilege_escalation(self, log: ActivityLog) -> Optional[Alert]:
        # R024
        if log.event_type != "PRIVILEGE_ESCALATION":
            return None
        metadata = self._metadata_for(log)
        return self._create_alert(
            log,
            "R024",
            f"Privilege escalation detected for {log.user_email}: "
            f"{metadata.get('privilege_before', 'unknown')} -> "
            f"{metadata.get('privilege_after', 'unknown')}.",
            {
                "privilege_before": metadata.get("privilege_before"),
                "privilege_after": metadata.get("privilege_after"),
            },
        )

    # =========================================================================
    # Policy Rules
    # =========================================================================
    def _rule_audit_log_tampering(self, log: ActivityLog) -> Optional[Alert]:
        # R025
        if log.event_type != "AUDIT_LOG_TAMPERING":
            return None
        return self._create_alert(
            log,
            "R025",
            f"Audit log tampering detected, associated with {log.user_email}.",
            {},
        )