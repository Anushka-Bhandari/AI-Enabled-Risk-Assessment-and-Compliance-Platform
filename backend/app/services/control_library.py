# services/control_library.py

"""
Master Control Library

This file defines the master list of security, privacy, and governance
controls supported by the platform.

This is the single source of truth for all control metadata.

Used by:
- Questionnaire
- Compliance Engine
- Risk Engine
- Recommendation Engine
- Dashboard
- Report Generator
"""

# ==========================================================
# Category Constants
# ==========================================================

PRIVACY = "Privacy & Data Governance"
IAM = "Identity & Access Management"
INFOSEC = "Information Security"
NETWORK = "Network & Infrastructure Security"
MONITORING = "Monitoring & Incident Management"
GOVERNANCE = "Governance & Compliance"
UNIVERSITY = "University-Specific Controls"

# ==========================================================
# Weight Constants
# ==========================================================

LOW = 3
MEDIUM = 4
HIGH = 5

# ==========================================================
# Master Control Library
# ==========================================================

CONTROL_LIBRARY = [

    # ==========================================================
    # Privacy & Data Governance
    # ==========================================================

    {
        "id": "C001",
        "name": "Privacy Notice",
        "category": PRIVACY,
        "weight": LOW,
    },
    {
        "id": "C002",
        "name": "Consent Management",
        "category": PRIVACY,
        "weight": HIGH,
    },
    {
        "id": "C003",
        "name": "Data Inventory",
        "category": PRIVACY,
        "weight": MEDIUM,
    },
    {
        "id": "C004",
        "name": "Data Classification",
        "category": PRIVACY,
        "weight": MEDIUM,
    },
    {
        "id": "C005",
        "name": "Data Retention",
        "category": PRIVACY,
        "weight": MEDIUM,
    },
    {
        "id": "C006",
        "name": "Data Disposal",
        "category": PRIVACY,
        "weight": MEDIUM,
    },
    {
        "id": "C007",
        "name": "Data Minimization",
        "category": PRIVACY,
        "weight": HIGH,
    },
    {
        "id": "C008",
        "name": "Purpose Limitation",
        "category": PRIVACY,
        "weight": HIGH,
    },
    {
        "id": "C009",
        "name": "Data Subject Rights Management",
        "category": PRIVACY,
        "weight": HIGH,
    },
    {
        "id": "C010",
        "name": "Sensitive Personal Data Protection",
        "category": PRIVACY,
        "weight": HIGH,
    },

    # ==========================================================
    # Identity & Access Management
    # ==========================================================

    {
        "id": "C011",
        "name": "Access Control",
        "category": IAM,
        "weight": HIGH,
    },
    {
        "id": "C012",
        "name": "Role-Based Access Control (RBAC)",
        "category": IAM,
        "weight": HIGH,
    },
    {
        "id": "C013",
        "name": "Multi-Factor Authentication (MFA)",
        "category": IAM,
        "weight": HIGH,
    },
    {
        "id": "C014",
        "name": "Password Security",
        "category": IAM,
        "weight": MEDIUM,
    },
    {
        "id": "C015",
        "name": "Privileged Access Management",
        "category": IAM,
        "weight": HIGH,
    },
    {
        "id": "C016",
        "name": "User Account Lifecycle Management",
        "category": IAM,
        "weight": MEDIUM,
    },

    # ==========================================================
    # Information Security
    # ==========================================================

    {
        "id": "C017",
        "name": "Information Security Policy",
        "category": INFOSEC,
        "weight": HIGH,
    },
    {
        "id": "C018",
        "name": "Asset Management",
        "category": INFOSEC,
        "weight": MEDIUM,
    },
    {
        "id": "C019",
        "name": "Encryption at Rest",
        "category": INFOSEC,
        "weight": HIGH,
    },
    {
        "id": "C020",
        "name": "Encryption in Transit",
        "category": INFOSEC,
        "weight": HIGH,
    },
    {
        "id": "C021",
        "name": "Secure Configuration Management",
        "category": INFOSEC,
        "weight": MEDIUM,
    },
    {
        "id": "C022",
        "name": "Patch Management",
        "category": INFOSEC,
        "weight": HIGH,
    },
    {
        "id": "C023",
        "name": "Vulnerability Management",
        "category": INFOSEC,
        "weight": HIGH,
    },
    {
        "id": "C024",
        "name": "Malware Protection",
        "category": INFOSEC,
        "weight": MEDIUM,
    },
    {
        "id": "C025",
        "name": "Endpoint Security",
        "category": INFOSEC,
        "weight": MEDIUM,
    },
        {
        "id": "C026",
        "name": "Mobile Device Security",
        "category": INFOSEC,
        "weight": LOW,
    },

    # ==========================================================
    # Network & Infrastructure Security
    # ==========================================================

    {
        "id": "C027",
        "name": "Network Security",
        "category": NETWORK,
        "weight": HIGH,
    },
    {
        "id": "C028",
        "name": "Firewall Management",
        "category": NETWORK,
        "weight": HIGH,
    },
    {
        "id": "C029",
        "name": "Network Segmentation",
        "category": NETWORK,
        "weight": MEDIUM,
    },
    {
        "id": "C030",
        "name": "Secure Remote Access",
        "category": NETWORK,
        "weight": HIGH,
    },
    {
        "id": "C031",
        "name": "Cloud Security",
        "category": NETWORK,
        "weight": MEDIUM,
    },
    {
        "id": "C032",
        "name": "Server Security",
        "category": NETWORK,
        "weight": HIGH,
    },

    # ==========================================================
    # Monitoring & Incident Management
    # ==========================================================

    {
        "id": "C033",
        "name": "Audit Logging",
        "category": MONITORING,
        "weight": HIGH,
    },
    {
        "id": "C034",
        "name": "Security Monitoring",
        "category": MONITORING,
        "weight": HIGH,
    },
    {
        "id": "C035",
        "name": "Incident Response Plan",
        "category": MONITORING,
        "weight": HIGH,
    },
    {
        "id": "C036",
        "name": "Security Incident Reporting",
        "category": MONITORING,
        "weight": MEDIUM,
    },
    {
        "id": "C037",
        "name": "Breach Notification",
        "category": MONITORING,
        "weight": HIGH,
    },
    {
        "id": "C038",
        "name": "Backup and Recovery",
        "category": MONITORING,
        "weight": HIGH,
    },
    {
        "id": "C039",
        "name": "Disaster Recovery",
        "category": MONITORING,
        "weight": HIGH,
    },
    {
        "id": "C040",
        "name": "Business Continuity Planning",
        "category": MONITORING,
        "weight": MEDIUM,
    },

    # ==========================================================
    # Governance & Compliance
    # ==========================================================

    {
        "id": "C041",
        "name": "Risk Assessment Process",
        "category": GOVERNANCE,
        "weight": HIGH,
    },
    {
        "id": "C042",
        "name": "Vendor Management",
        "category": GOVERNANCE,
        "weight": MEDIUM,
    },
    {
        "id": "C043",
        "name": "Third-Party Risk Assessment",
        "category": GOVERNANCE,
        "weight": MEDIUM,
    },
    {
        "id": "C044",
        "name": "Security Awareness Training",
        "category": GOVERNANCE,
        "weight": LOW,
    },
    {
        "id": "C045",
        "name": "Change Management",
        "category": GOVERNANCE,
        "weight": MEDIUM,
    },
    {
        "id": "C046",
        "name": "Internal Security Audits",
        "category": GOVERNANCE,
        "weight": MEDIUM,
    },

    # ==========================================================
    # University-Specific Controls
    # ==========================================================

    {
        "id": "C047",
        "name": "Student Data Protection",
        "category": UNIVERSITY,
        "weight": HIGH,
    },
    {
        "id": "C048",
        "name": "Faculty & Staff Data Protection",
        "category": UNIVERSITY,
        "weight": HIGH,
    },
    {
        "id": "C049",
        "name": "Research Data Protection",
        "category": UNIVERSITY,
        "weight": MEDIUM,
    },
    {
        "id": "C050",
        "name": "ERP/LMS Security",
        "category": UNIVERSITY,
        "weight": HIGH,
    },
]

# ==========================================================
# Lookup Dictionaries
# ==========================================================

CONTROL_BY_ID = {
    control["id"]: control
    for control in CONTROL_LIBRARY
}

CONTROL_BY_NAME = {
    control["name"]: control
    for control in CONTROL_LIBRARY
}

# ==========================================================
# Helper Functions
# ==========================================================

def get_control(control_id: str) -> dict:
    """
    Return the complete control metadata by control ID.

    Raises:
        KeyError: If the control ID does not exist.
    """
    return CONTROL_BY_ID[control_id]


def get_control_by_name(name: str) -> dict:
    """
    Return the complete control metadata by control name.

    Raises:
        KeyError: If the control name does not exist.
    """
    return CONTROL_BY_NAME[name]


def get_control_name(control_id: str) -> str:
    """Return the control name for a given control ID."""
    return CONTROL_BY_ID[control_id]["name"]


def get_control_category(control_id: str) -> str:
    """Return the category for a given control ID."""
    return CONTROL_BY_ID[control_id]["category"]


def get_control_weight(control_id: str) -> int:
    """Return the weight for a given control ID."""
    return CONTROL_BY_ID[control_id]["weight"]


# ==========================================================
# Validation
# ==========================================================

control_ids = [control["id"] for control in CONTROL_LIBRARY]
control_names = [control["name"] for control in CONTROL_LIBRARY]

if len(control_ids) != len(set(control_ids)):
    raise RuntimeError("Duplicate control IDs found in CONTROL_LIBRARY.")

if len(control_names) != len(set(control_names)):
    raise RuntimeError("Duplicate control names found in CONTROL_LIBRARY.")