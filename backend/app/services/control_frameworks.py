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

from app.services.control_library import CONTROL_BY_ID

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

    "C001": [
        DPDP,
        ISO27701,
        UGC,
    ],

    "C002": [
        DPDP,
        ISO27701,
    ],

    "C003": [
        DPDP,
        ISO27001,
        ISO27701,
        NIST,
        UGC,
    ],

    "C004": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
        UGC,
    ],

    "C005": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        UGC,
    ],

    "C006": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
    ],

    "C007": [
        DPDP,
        ISO27701,
    ],

    "C008": [
        DPDP,
        ISO27701,
    ],

    "C009": [
        DPDP,
        ISO27701,
    ],

    "C010": [
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

    "C011": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C012": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C013": [
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C014": [
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C015": [
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C016": [
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    # ==========================================================
    # INFORMATION SECURITY
    # ==========================================================

    "C017": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C018": [
        UGC,
        NAAC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C019": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C020": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C021": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C022": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C023": [
        IT_ACT,
        UGC,
        NAAC,
        ISO27001,
        NIST,
    ],

    "C024": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C025": [
        IT_ACT,
        UGC,
        NAAC,
        ISO27001,
        NIST,
    ],    
    
    "C026": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    # ==========================================================
    # NETWORK & INFRASTRUCTURE SECURITY
    # ==========================================================

    "C027": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C028": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "C029": [
        ISO27001,
        NIST,
    ],

    "C030": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "C031": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C032": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    # ==========================================================
    # MONITORING & INCIDENT MANAGEMENT
    # ==========================================================

    "C033": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C034": [
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C035": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C036": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C037": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C038": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C039": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C040": [
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

    "C041": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C042": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C043": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C044": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C045": [
        UGC,
        ISO27001,
        NIST,
    ],

    "C046": [
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

    "C047": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
    ],

    "C048": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
    ],

    "C049": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
    ],

    "C050": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    # ==========================================================
    # ISO/IEC 27001:2022 Annex A Alignment — Additional Controls
    # (C051-C117)
    # ==========================================================

    # ---------- A.5 Organizational controls (remaining) ----------

    "C051": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C052": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C053": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C054": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C055": [
        ISO27001,
    ],

    "C056": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C057": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C058": [
        IT_ACT,
        UGC,
        NAAC,
        ISO27001,
        NIST,
    ],

    "C059": [
        UGC,
        ISO27001,
        NIST,
    ],

    "C060": [
        DPDP,
        ISO27001,
        ISO27701,
    ],

    "C061": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C062": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C063": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C064": [
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C065": [
        DPDP,
        UGC,
        ISO27001,
        NIST,
    ],

    "C066": [
        IT_ACT,
        UGC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C067": [
        UGC,
        ISO27001,
        NIST,
    ],

    "C068": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C069": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C070": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "C071": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C072": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C073": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
    ],

    "C074": [
        DPDP,
        IT_ACT,
        UGC,
        NAAC,
        NBA,
        ISO27001,
        ISO27701,
    ],

    "C075": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C076": [
        UGC,
        NAAC,
        NBA,
        ISO27001,
        NIST,
    ],

    "C077": [
        UGC,
        ISO27001,
        NIST,
    ],

    # ---------- A.6 People controls (remaining) ----------

    "C078": [
        UGC,
        ISO27001,
        NIST,
    ],

    "C079": [
        ISO27001,
    ],

    "C080": [
        ISO27001,
    ],

    "C081": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C082": [
        DPDP,
        UGC,
        ISO27001,
        ISO27701,
    ],

    "C083": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    # ---------- A.7 Physical controls ----------

    "C084": [
        UGC,
        ISO27001,
        NIST,
    ],

    "C085": [
        UGC,
        ISO27001,
        NIST,
    ],

    "C086": [
        DPDP,
        UGC,
        ISO27001,
        NIST,
    ],

    "C087": [
        UGC,
        ISO27001,
        NIST,
    ],

    "C088": [
        UGC,
        ISO27001,
        NIST,
    ],

    "C089": [
        UGC,
        ISO27001,
    ],

    "C090": [
        DPDP,
        UGC,
        ISO27001,
    ],

    "C091": [
        UGC,
        ISO27001,
    ],

    "C092": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C093": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C094": [
        UGC,
        ISO27001,
    ],

    "C095": [
        UGC,
        ISO27001,
    ],

    "C096": [
        UGC,
        ISO27001,
    ],

    "C097": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    # ---------- A.8 Technological controls (remaining) ----------

    "C098": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C099": [
        ISO27001,
        NIST,
    ],

    "C100": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C101": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C102": [
        DPDP,
        IT_ACT,
        UGC,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C103": [
        ISO27001,
        NIST,
    ],

    "C104": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "C105": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "C106": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "C107": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "C108": [
        IT_ACT,
        UGC,
        ISO27001,
        NIST,
    ],

    "C109": [
        IT_ACT,
        NBA,
        ISO27001,
        NIST,
    ],

    "C110": [
        IT_ACT,
        NBA,
        ISO27001,
        NIST,
    ],

    "C111": [
        NBA,
        ISO27001,
        NIST,
    ],

    "C112": [
        IT_ACT,
        NBA,
        ISO27001,
        NIST,
    ],

    "C113": [
        IT_ACT,
        NBA,
        ISO27001,
        NIST,
    ],

    "C114": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "C115": [
        IT_ACT,
        ISO27001,
        NIST,
    ],

    "C116": [
        DPDP,
        IT_ACT,
        ISO27001,
        ISO27701,
        NIST,
    ],

    "C117": [
        IT_ACT,
        ISO27001,
        NIST,
    ],
}


# ==========================================================
# Helper Functions
# ==========================================================

def get_frameworks(control_id: str) -> list[str]:
    """
    Return all frameworks mapped to a control.

    Raises:
        KeyError:
            If the control ID does not exist.
    """
    return CONTROL_FRAMEWORKS[control_id]


def is_supported_framework(framework: str) -> bool:
    """
    Check whether a framework is supported by the platform.
    """
    return framework in SUPPORTED_FRAMEWORKS


# ==========================================================
# Validation
# ==========================================================

library_ids = set(CONTROL_BY_ID.keys())
mapping_ids = set(CONTROL_FRAMEWORKS.keys())

missing_controls = library_ids - mapping_ids

if missing_controls:
    raise RuntimeError(
        "Missing framework mappings for the following controls:\n"
        + "\n".join(sorted(missing_controls))
    )

extra_controls = mapping_ids - library_ids

if extra_controls:
    raise RuntimeError(
        "Framework mappings exist for unknown controls:\n"
        + "\n".join(sorted(extra_controls))
    )

unmapped_controls = {
    control_id
    for control_id, frameworks in CONTROL_FRAMEWORKS.items()
    if not frameworks
}

if unmapped_controls:
    raise RuntimeError(
        "The following controls have no framework mappings:\n"
        + "\n".join(sorted(unmapped_controls))
    )

iso_controls_missing_framework = {
    control_id
    for control_id, control in CONTROL_BY_ID.items()
    if control.get("iso27001") and ISO27001 not in CONTROL_FRAMEWORKS.get(control_id, [])
}

if iso_controls_missing_framework:
    raise RuntimeError(
        "The following controls have ISO/IEC 27001:2022 Annex A mappings in "
        "control_library.py but are missing the ISO27001 framework in "
        "CONTROL_FRAMEWORKS:\n"
        + "\n".join(sorted(iso_controls_missing_framework))
    )