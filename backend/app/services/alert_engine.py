from app import db
from app.models import Alert, ActivityLog


class AlertEngine:
    """
    Converts Detection Engine results into Alert records.
    """

    def __init__(self, detection_result):
        self.detection_result = detection_result

    def run(self):
        """
        Process Detection Engine output and create alerts.
        """

        # No suspicious activity
        if not self.detection_result.get("is_suspicious", False):
            return []

        # Fetch the corresponding activity log
        activity_log = self._load_activity_log()

        created_alerts = []

        # Create one alert per matched rule
        for rule in self.detection_result.get("matched_rules", []):
            alert = self._create_alert(activity_log, rule)
            db.session.add(alert)
            created_alerts.append(alert)

        db.session.commit()

        return created_alerts

    def _load_activity_log(self):
        """
        Load the Activity Log associated with the detection result.
        """

        event_id = self.detection_result.get("event_id")

        if not event_id:
            raise ValueError("Detection result is missing event_id.")

        activity_log = ActivityLog.query.filter_by(
            event_id=event_id
        ).first()

        if not activity_log:
            raise ValueError(f"Activity Log with event_id '{event_id}' not found.")

        return activity_log

    def _create_alert(self, activity_log, rule):
        """
        Create an Alert object from a matched detection rule.
        """

        return Alert(
            event_id=activity_log.event_id,
            rule_id=rule.get("rule_id"),
            title=rule.get("title"),
            description=rule.get("description"),
            severity=rule.get("severity")
        )
