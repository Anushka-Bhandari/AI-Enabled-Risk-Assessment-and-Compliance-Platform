"""
Control → Framework Mapping

This file defines which compliance frameworks each control belongs to.

The Compliance Engine uses this mapping to calculate:
- Framework-wise compliance scores
- Control coverage
- Framework implementation status

Frameworks:
- DPDP      : Digital Personal Data Protection Act, 2023 (India)
- ISO27001  : Information Security Management
- ISO27701  : Privacy Information Management
- NIST      : NIST Cybersecurity Framework
"""

CONTROL_FRAMEWORKS = {
    "Privacy Notice": [
        "DPDP",
        "ISO27001",
    ],

    "Consent Management": [
        "DPDP",
        "ISO27001",
    ],

    "Data Retention": [
        "DPDP",
        "ISO27001",
    ],

    #Information Security Controls
    "Access Control": [
        "ISO27001",
        "NIST",
    ],

    "Password Security": [
        "ISO27001",
        "NIST",
    ],

    "Incident Response": [
        "ISO27001",
        "NIST",
        "DPDP",
    ],

    "Breach Notification": [
        "DPDP",
        "ISO27001",
        "NIST",
    ],

    "Backup and Recovery": [
        "DPDP",
        "ISO27001",
        "NIST",
    ],

    "Vendor Management": [
        "DPDP",
        "ISO27001",
        "NIST",
    ],
}