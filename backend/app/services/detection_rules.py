RULE_LIBRARY = {

    # ==========================================================
    # AUTHENTICATION RULES
    # ==========================================================

    "R001": {
        "rule_id": "R001",
        "category": "Authentication",
        "rule_name": "Multiple Failed Login Attempts",
        "severity": "HIGH",
        "title": "Multiple Failed Login Attempts",
        "description": "User exceeded the allowed failed login attempts within the configured time window.",
        "config": {
            "threshold": 5,
            "time_window_minutes": 5
        }
    },

    "R002": {
        "rule_id": "R002",
        "category": "Authentication",
        "rule_name": "Impossible Travel",
        "severity": "HIGH",
        "title": "Impossible Travel",
        "description": "User logged in from geographically distant locations within an impossible travel duration.",
        "config": {
            "max_travel_time_minutes": 60
        }
    },

    "R003": {
        "rule_id": "R003",
        "category": "Authentication",
        "rule_name": "Unknown Device Login",
        "severity": "MEDIUM",
        "title": "Unknown Device Login",
        "description": "Login detected from an unrecognized device.",
        "config": {}
    },

    "R004": {
        "rule_id": "R004",
        "category": "Authentication",
        "rule_name": "Unknown IP Login",
        "severity": "MEDIUM",
        "title": "Unknown IP Login",
        "description": "Login detected from an unknown IP address.",
        "config": {}
    },

    "R005": {
        "rule_id": "R005",
        "category": "Authentication",
        "rule_name": "Login Outside Business Hours",
        "severity": "LOW",
        "title": "Login Outside Business Hours",
        "description": "User logged in outside the configured business hours.",
        "config": {
            "business_start_hour": 9,
            "business_end_hour": 18
        }
    },

    "R006": {
        "rule_id": "R006",
        "category": "Authentication",
        "rule_name": "Concurrent Login Sessions",
        "severity": "MEDIUM",
        "title": "Concurrent Login Sessions",
        "description": "Same user logged in simultaneously from multiple devices or locations.",
        "config": {
            "max_active_sessions": 2,
            "time_window_minutes": 60
        }
    },

    "R007": {
        "rule_id": "R007",
        "category": "Authentication",
        "rule_name": "Dormant Account Login",
        "severity": "HIGH",
        "title": "Dormant Account Login",
        "description": "A dormant account became active after a long period of inactivity.",
        "config": {
            "inactive_days": 90
        }
    },

    # ==========================================================
    # EMAIL RULES
    # ==========================================================

    "R008": {
        "rule_id": "R008",
        "category": "Email",
        "rule_name": "Bulk Email Activity",
        "severity": "MEDIUM",
        "title": "Bulk Email Activity",
        "description": "Email sent to an unusually large number of recipients.",
        "config": {
            "recipient_threshold": 500
        }
    },

    "R009": {
        "rule_id": "R009",
        "category": "Email",
        "rule_name": "Suspicious Attachment Distribution",
        "severity": "HIGH",
        "title": "Suspicious Attachment Distribution",
        "description": "Multiple emails containing attachments were sent within a short period.",
        "config": {
            "attachment_count_threshold": 20,
            "time_window_minutes": 10
        }
    },

    "R010": {
        "rule_id": "R010",
        "category": "Email",
        "rule_name": "External Domain Mass Email",
        "severity": "HIGH",
        "title": "External Domain Mass Email",
        "description": "Large number of emails sent to external domains.",
        "config": {
            "external_recipient_threshold": 100
        }
    },

    # ==========================================================
    # FILE ACTIVITY RULES
    # ==========================================================

    "R011": {
        "rule_id": "R011",
        "category": "File Activity",
        "rule_name": "Large File Download",
        "severity": "MEDIUM",
        "title": "Large File Download",
        "description": "Downloaded file exceeded the configured size threshold.",
        "config": {
            "file_size_threshold_mb": 500
        }
    },

    "R012": {
        "rule_id": "R012",
        "category": "File Activity",
        "rule_name": "Sensitive File Download",
        "severity": "HIGH",
        "title": "Sensitive File Download",
        "description": "Sensitive or confidential file was downloaded.",
        "config": {}
    },

    "R013": {
        "rule_id": "R013",
        "category": "File Activity",
        "rule_name": "Excessive File Upload",
        "severity": "MEDIUM",
        "title": "Excessive File Upload",
        "description": "User uploaded an unusually high number of files within a short period.",
        "config": {
            "upload_threshold": 100,
            "time_window_minutes": 30
        }
    },    
    
    "R014": {
        "rule_id": "R014",
        "category": "File Activity",
        "rule_name": "File Deletion Spike",
        "severity": "HIGH",
        "title": "File Deletion Spike",
        "description": "User deleted an unusually high number of files within a short period.",
        "config": {
            "deletion_threshold": 100,
            "time_window_minutes": 30
        }
    },

    # ==========================================================
    # DATABASE RULES
    # ==========================================================

    "R015": {
        "rule_id": "R015",
        "category": "Database",
        "rule_name": "Database Mass Download",
        "severity": "CRITICAL",
        "title": "Database Mass Download",
        "description": "Large number of database records exported.",
        "config": {
            "record_threshold": 1000
        }
    },

    "R016": {
        "rule_id": "R016",
        "category": "Database",
        "rule_name": "Sensitive Database Access",
        "severity": "HIGH",
        "title": "Sensitive Database Access",
        "description": "Access to confidential or restricted database tables detected.",
        "config": {}
    },

    "R017": {
        "rule_id": "R017",
        "category": "Database",
        "rule_name": "Repeated Database Query Failures",
        "severity": "MEDIUM",
        "title": "Repeated Database Query Failures",
        "description": "Multiple failed database queries detected within a short duration.",
        "config": {
            "failure_threshold": 20,
            "time_window_minutes": 10
        }
    },

    # ==========================================================
    # ENDPOINT RULES
    # ==========================================================

    "R018": {
        "rule_id": "R018",
        "category": "Endpoint",
        "rule_name": "Malware Detected",
        "severity": "CRITICAL",
        "title": "Malware Detected",
        "description": "Malware detected on the endpoint.",
        "config": {}
    },

    "R019": {
        "rule_id": "R019",
        "category": "Endpoint",
        "rule_name": "Unauthorized Application Installation",
        "severity": "HIGH",
        "title": "Unauthorized Application Installation",
        "description": "Unauthorized software installation detected.",
        "config": {}
    },

    "R020": {
        "rule_id": "R020",
        "category": "Endpoint",
        "rule_name": "USB Device Connected",
        "severity": "LOW",
        "title": "USB Device Connected",
        "description": "External USB storage device connected.",
        "config": {}
    },

    "R021": {
        "rule_id": "R021",
        "category": "Endpoint",
        "rule_name": "Antivirus Disabled",
        "severity": "CRITICAL",
        "title": "Antivirus Disabled",
        "description": "Endpoint antivirus or security protection has been disabled.",
        "config": {}
    },

    # ==========================================================
    # NETWORK RULES
    # ==========================================================

    "R022": {
        "rule_id": "R022",
        "category": "Network",
        "rule_name": "Firewall Blocked Request",
        "severity": "LOW",
        "title": "Firewall Blocked Request",
        "description": "Firewall blocked an incoming or outgoing network request.",
        "config": {}
    },

    "R023": {
        "rule_id": "R023",
        "category": "Network",
        "rule_name": "VPN Login from Unknown Location",
        "severity": "HIGH",
        "title": "VPN Login from Unknown Location",
        "description": "VPN login detected from an unfamiliar location.",
        "config": {}
    },

    # ==========================================================
    # PRIVILEGE & POLICY RULES
    # ==========================================================

    "R024": {
        "rule_id": "R024",
        "category": "Privilege",
        "rule_name": "Privilege Escalation",
        "severity": "CRITICAL",
        "title": "Privilege Escalation",
        "description": "User privileges elevated unexpectedly.",
        "config": {}
    },

    "R025": {
        "rule_id": "R025",
        "category": "Policy",
        "rule_name": "Audit Log Tampering",
        "severity": "CRITICAL",
        "title": "Audit Log Tampering",
        "description": "Audit logs were modified, deleted, or tampered with.",
        "config": {}
    }

}