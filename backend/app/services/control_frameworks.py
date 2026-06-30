"""
Control → Framework Mapping

This module maps every security/privacy control to the compliance
frameworks that require or recommend that control.

This mapping acts as the single source of truth for framework alignment
throughout the platform.

Used by:
- Compliance Engine
- Risk Engine
- Recommendation Engine
- Dashboard
- Report Generator

Supported Frameworks
--------------------
DPDP       : Digital Personal Data Protection Act, 2023
IT_ACT     : Information Technology Act, 2000 + SPDI Rules
UGC         : UGC Digital Governance Guidelines
NAAC        : National Assessment and Accreditation Council
NBA         : National Board of Accreditation
ISO27001    : ISO/IEC 27001:2022
ISO27701    : ISO/IEC 27701
NIST        : NIST Cybersecurity Framework (CSF 2.0)
"""

from typing import Final

from app.services.control_library import CONTROL_LIBRARY

# ==========================================================
# Framework Constants
# ==========================================================

DPDP: Final = "DPDP"
IT_ACT: Final = "IT_ACT"
UGC: Final = "UGC"
NAAC: Final = "NAAC"
NBA: Final = "NBA"
ISO27001: Final = "ISO27001"
ISO27701: Final = "ISO27701"
NIST: Final = "NIST"

SUPPORTED_FRAMEWORKS: tuple[str, ...] = (
    DPDP,
    IT_ACT,
    UGC,
    NAAC,
    NBA,
    ISO27001,
    ISO27701,
    NIST,
)

# ==========================================================
# Control → Framework Mapping
# ==========================================================

CONTROL_FRAMEWORKS: dict[str, list[str]] = {

    # ==========================================================
    # PRIVACY & DATA GOVERNANCE
    # ==========================================================

    "Privacy Notice": [
        DPDP,
        ISO27701,
        UGC,
    ],

    "Consent Management": [
        DPDP,
        ISO27701,
    ],

    "Data Inventory": [
        DPDP,
        ISO27001,
        ISO27701,
        NIST,
        UGC,
    ],

    "Data Classification": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
        UGC,
    ],

    "Data Retention": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        UGC,
    ],

    "Data Disposal": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
    ],

    "Data Minimization": [
        DPDP,
        ISO27701,
    ],

    "Purpose Limitation": [
        DPDP,
        ISO27701,
    ],

    "Data Subject Rights Management": [
        DPDP,
        ISO27701,
    ],

    "Sensitive Personal Data Protection": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
        UGC,
        NAAC,
    ],

    # ==========================================================
    # IDENTITY & ACCESS MANAGEMENT
    # ==========================================================

    "Access Control": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Role-Based Access Control (RBAC)": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Multi-Factor Authentication (MFA)": [
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Password Security": [
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Privileged Access Management": [
        ISO27001,
        ISO27701,
        NIST,
    ],

    "User Account Lifecycle Management": [
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    # ==========================================================
    # INFORMATION SECURITY
    # ==========================================================

    "Information Security Policy": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Asset Management": [
        UGC,
        NAAC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Encryption at Rest": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Encryption in Transit": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Secure Configuration Management": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "Patch Management": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "Vulnerability Management": [
        IT_ACT,
        UGC,
        NAAC,
        ISO27001,
        NIST,
    ],

    "Malware Protection": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "Endpoint Security": [
        IT_ACT,
        UGC,
        NAAC,
        ISO27001,
        NIST,
    ],

    "Mobile Device Security": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    # ==========================================================
    # NETWORK & INFRASTRUCTURE SECURITY
    # ==========================================================

    "Network Security": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "Firewall Management": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "Network Segmentation": [
        ISO27001,
        NIST,
    ],

    "Secure Remote Access": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "Cloud Security": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Server Security": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    # ==========================================================
    # MONITORING & INCIDENT MANAGEMENT
    # ==========================================================

    "Audit Logging": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Security Monitoring": [
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Incident Response Plan": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Security Incident Reporting": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Breach Notification": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Backup and Recovery": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Disaster Recovery": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Business Continuity Planning": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    # ==========================================================
    # GOVERNANCE & COMPLIANCE
    # ==========================================================

    "Risk Assessment Process": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Vendor Management": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Third-Party Risk Assessment": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Security Awareness Training": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "Change Management": [
        UGC,
        ISO27001,
        NIST,
    ],

    "Internal Security Audits": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    # ==========================================================
    # UNIVERSITY-SPECIFIC CONTROLS
    # ==========================================================

    "Student Data Protection": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
    ],

    "Faculty & Staff Data Protection": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
    ],

    "Research Data Protection": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
    ],

    "ERP/LMS Security": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],
}


# ==========================================================
# Helper Functions
# ==========================================================

def get_frameworks(control: str) -> list[str]:
    """
    Return all frameworks mapped to a control.

    Raises:
        KeyError:
            If the control does not exist.
    """
    return CONTROL_FRAMEWORKS[control]


def is_supported_framework(framework: str) -> bool:
    """
    Check whether a framework is supported by the platform.
    """
    return framework in SUPPORTED_FRAMEWORKS

# ==========================================================
# Validation
# ==========================================================


missing_controls = set(CONTROL_LIBRARY) - set(CONTROL_FRAMEWORKS)

if missing_controls:
    raise RuntimeError(
        "Missing framework mappings for the following controls:\n"
        + "\n".join(sorted(missing_controls))
    )

extra_controls = set(CONTROL_FRAMEWORKS) - set(CONTROL_LIBRARY)

if extra_controls:
    raise RuntimeError(
        "Framework mappings exist for unknown controls:\n"
        + "\n".join(sorted(extra_controls))
    )