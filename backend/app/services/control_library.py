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

LOW = 1
MEDIUM = 2
HIGH = 3

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
        "risk_description": (
            "Failure to provide a clear privacy notice may result in a lack of "
            "transparency regarding personal data processing, increasing the "
            "risk of regulatory non-compliance and loss of stakeholder trust."
        ),
        "frameworks": [
            "DPDP Act 2023",
            "ISO/IEC 27701",
            "ISO/IEC 27001"
        ],

        "missing_requirements": [
            "Privacy Notice",
            "Transparency",
            "Purpose Disclosure"
        ],

        "implementation_guidance": (
            "Publish a clear privacy notice describing data collection, processing "
            "purposes, retention period, user rights, grievance contact, and third-"
            "party disclosures. Ensure it is available on all university portals."
        )
    },
    {
        "id": "C002",
        "name": "Consent Management",
        "category": PRIVACY,
        "weight": HIGH,
        "risk_description": (
            "Failure to properly obtain and manage user consent may lead to "
            "unlawful processing of personal data, regulatory penalties, and "
            "privacy violations."
        ),
        "frameworks": [
            "DPDP Act 2023",
            "ISO/IEC 27701",
            "ISO/IEC 27001"
        ],

        "missing_requirements": [
            "Consent Collection",
            "Consent Withdrawal",
            "Consent Records",
            "Consent Audit Trail"
        ],

        "implementation_guidance": (
            "Deploy a centralized consent management process, maintain verifiable "
            "records of user consent, support consent withdrawal, and periodically "
            "review compliance with privacy regulations."
        )
    },
    {
        "id": "C003",
        "name": "Data Inventory",
        "category": PRIVACY,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to maintain a data inventory may result in unknown data "
            "assets, making it difficult to protect, monitor, and comply with "
            "data protection regulations."
        ),
        "frameworks": [
            "ISO/IEC 27001",
            "ISO/IEC 27701",
            "NIST CSF 2.0"
        ],

        "missing_requirements": [
            "Data Inventory",
            "Asset Register",
            "Data Mapping"
        ],

        "implementation_guidance": (
            "Maintain an inventory of all personal and institutional data assets, "
            "including owners, storage locations, processing activities, and retention "
            "requirements."
        )
    },
    {
        "id": "C004",
        "name": "Data Classification",
        "category": PRIVACY,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to classify data appropriately may lead to inadequate "
            "security controls and increased exposure of sensitive information."
        ),
        "frameworks": [
            "ISO/IEC 27001",
            "NIST CSF 2.0"
        ],

        "missing_requirements": [
            "Classification Policy",
            "Labeling",
            "Handling Rules"
        ],

        "implementation_guidance": (
            "Establish a classification scheme such as Public, Internal, Confidential, "
            "and Restricted. Apply security controls according to classification."
        )
    },
    {
        "id": "C005",
        "name": "Data Retention",
        "category": PRIVACY,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to enforce data retention policies may result in retaining "
            "personal information longer than necessary, increasing legal and "
            "security risks."
        ),
        "frameworks": [
            "DPDP Act 2023",
            "ISO/IEC 27701"
        ],

        "missing_requirements": [
            "Retention Policy",
            "Retention Schedule",
            "Legal Hold"
        ],

        "implementation_guidance": (
            "Define retention periods for every category of institutional data and "
            "automatically delete information once retention requirements expire."
        )
    },
    {
        "id": "C006",
        "name": "Data Disposal",
        "category": PRIVACY,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to securely dispose of data may expose sensitive "
            "information to unauthorized access and increase the likelihood of "
            "data breaches."
        ),
        "frameworks": [
            "ISO/IEC 27001",
            "ISO/IEC 27701"
        ],

        "missing_requirements": [
            "Secure Deletion",
            "Media Sanitization",
            "Disposal Procedure"
        ],

        "implementation_guidance": (
            "Implement secure deletion procedures using approved sanitization methods "
            "for digital storage and certified destruction for physical media."
        )
    },
    {
        "id": "C007",
        "name": "Data Minimization",
        "category": PRIVACY,
        "weight": HIGH,
        "risk_description": (
            "Failure to minimize the collection and processing of personal data "
            "increases privacy risks and expands the potential impact of data "
            "breaches."
        ),
        "frameworks": [
            "DPDP Act 2023",
            "ISO/IEC 27701"
        ],

        "missing_requirements": [
            "Minimal Collection",
            "Purpose Review",
            "Periodic Cleanup"
        ],

        "implementation_guidance": (
            "Collect only the minimum personal information required for academic and "
            "administrative purposes and regularly review unnecessary data collection."
        )
    },
    {
        "id": "C008",
        "name": "Purpose Limitation",
        "category": PRIVACY,
        "weight": HIGH,
        "risk_description": (
            "Failure to process personal data only for legitimate and specified "
            "purposes may lead to regulatory violations and misuse of personal "
            "information."
        ),
        "frameworks": [
            "DPDP Act 2023",
            "ISO/IEC 27701"
        ],

        "missing_requirements": [
            "Purpose Documentation",
            "Purpose Validation",
            "Processing Restrictions"
        ],

        "implementation_guidance": (
            "Document every processing purpose and prevent personal data from being "
            "used outside its originally approved purpose without additional consent."
        )
    },
    {
        "id": "C009",
        "name": "Data Subject Rights Management",
        "category": PRIVACY,
        "weight": HIGH,
        "risk_description": (
            "Failure to support data subject rights may prevent individuals from "
            "exercising legal rights over their personal information, leading "
            "to compliance and reputational risks."
        ),
        "frameworks": [
            "DPDP Act 2023",
            "ISO/IEC 27701"
        ],

        "missing_requirements": [
            "Access Requests",
            "Correction Requests",
            "Deletion Requests",
            "Grievance Handling"
        ],

        "implementation_guidance": (
            "Establish workflows allowing students, faculty, and staff to access, "
            "correct, or delete personal information within regulatory timelines."
        )
    },
    {
        "id": "C010",
        "name": "Sensitive Personal Data Protection",
        "category": PRIVACY,
        "weight": HIGH,
        "risk_description": (
            "Failure to adequately protect sensitive personal data may result in "
            "serious privacy breaches, regulatory penalties, and significant "
            "harm to affected individuals."
        ),
        "frameworks": [
            "DPDP Act 2023",
            "ISO/IEC 27001",
            "ISO/IEC 27701"
        ],

        "missing_requirements": [
            "Encryption",
            "Access Restrictions",
            "Monitoring",
            "Audit Logging"
        ],

        "implementation_guidance": (
            "Apply encryption, strict access control, continuous monitoring, and audit "
            "logging for all sensitive personal information handled by the university."
        )
    },

    # ==========================================================
    # Identity & Access Management
    # ==========================================================

    {
        "id": "C011",
        "name": "Access Control",
        "category": IAM,
        "weight": HIGH,
        "risk_description": (
            "Failure to implement effective access control may allow "
            "unauthorized users to access sensitive systems and information, "
            "leading to data breaches and security incidents."
        ),
    },
    {
        "id": "C012",
        "name": "Role-Based Access Control (RBAC)",
        "category": IAM,
        "weight": HIGH,
        "risk_description": (
            "Failure to implement role-based access control may result in "
            "users having excessive privileges, increasing the risk of "
            "unauthorized access, insider threats, and accidental misuse of "
            "sensitive information."
        ),
    },
    {
        "id": "C013",
        "name": "Multi-Factor Authentication (MFA)",
        "category": IAM,
        "weight": HIGH,
        "risk_description": (
            "Failure to implement multi-factor authentication increases the "
            "likelihood of unauthorized account access through compromised "
            "credentials, phishing attacks, or password theft."
        ),
    },
    {
        "id": "C014",
        "name": "Password Security",
        "category": IAM,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to enforce strong password security practices may result "
            "in weak or compromised credentials, increasing the risk of "
            "unauthorized access and account compromise."
        ),
    },
    {
        "id": "C015",
        "name": "Privileged Access Management",
        "category": IAM,
        "weight": HIGH,
        "risk_description": (
            "Failure to properly manage privileged accounts may allow "
            "administrative privileges to be misused, increasing the risk of "
            "critical system compromise and unauthorized changes."
        ),
    },
    {
        "id": "C016",
        "name": "User Account Lifecycle Management",
        "category": IAM,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to properly manage user account creation, modification, "
            "and removal may leave inactive or unauthorized accounts active, "
            "increasing the risk of unauthorized system access."
        ),
    },

    # ==========================================================
    # Information Security
    # ==========================================================

    {
        "id": "C017",
        "name": "Information Security Policy",
        "category": INFOSEC,
        "weight": HIGH,
        "risk_description": (
            "Failure to establish and maintain an information security policy "
            "may result in inconsistent security practices, weak governance, "
            "and increased exposure to cyber threats."
        ),
    },
    {
        "id": "C018",
        "name": "Asset Management",
        "category": INFOSEC,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to maintain an accurate inventory of information assets "
            "may result in unmanaged systems, security gaps, and inadequate "
            "protection of critical resources."
        ),
    },
    {
        "id": "C019",
        "name": "Encryption at Rest",
        "category": INFOSEC,
        "weight": HIGH,
        "risk_description": (
            "Failure to encrypt data at rest may expose sensitive information "
            "to unauthorized access if storage systems or devices are "
            "compromised."
        ),
    },
    {
        "id": "C020",
        "name": "Encryption in Transit",
        "category": INFOSEC,
        "weight": HIGH,
        "risk_description": (
            "Failure to encrypt data during transmission may allow attackers "
            "to intercept, modify, or steal sensitive information while it is "
            "being communicated across networks."
        ),
    },
    {
        "id": "C021",
        "name": "Secure Configuration Management",
        "category": INFOSEC,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to securely configure systems and applications may leave "
            "default settings, unnecessary services, or security "
            "misconfigurations that can be exploited by attackers."
        ),
    },
    {
        "id": "C022",
        "name": "Patch Management",
        "category": INFOSEC,
        "weight": HIGH,
        "risk_description": (
            "Failure to implement effective patch management may leave known "
            "software vulnerabilities unaddressed, increasing the risk of "
            "successful cyber attacks and system compromise."
        ),
    },
    {
        "id": "C023",
        "name": "Vulnerability Management",
        "category": INFOSEC,
        "weight": HIGH,
        "risk_description": (
            "Failure to identify, assess, and remediate security "
            "vulnerabilities may allow attackers to exploit weaknesses and "
            "compromise systems or sensitive information."
        ),
    },
    {
        "id": "C024",
        "name": "Malware Protection",
        "category": INFOSEC,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to implement effective malware protection may increase "
            "the risk of malicious software infections, resulting in data "
            "loss, service disruption, or unauthorized access."
        ),
    },
    {
        "id": "C025",
        "name": "Endpoint Security",
        "category": INFOSEC,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to secure endpoint devices may allow attackers to "
            "compromise user devices and gain unauthorized access to "
            "institutional systems and data."
        ),
    },
    {
        "id": "C026",
        "name": "Mobile Device Security",
        "category": INFOSEC,
        "weight": LOW,
        "risk_description": (
            "Failure to implement mobile device security controls may expose "
            "institutional data to unauthorized access through lost, stolen, "
            "or compromised mobile devices."
        ),
    },

    # ==========================================================
    # Network & Infrastructure Security
    # ==========================================================

    {
        "id": "C027",
        "name": "Network Security",
        "category": NETWORK,
        "weight": HIGH,
        "risk_description": (
            "Failure to implement network security controls may allow "
            "unauthorized access, network intrusions, and attacks that "
            "compromise institutional systems and sensitive information."
        ),
    },
    {
        "id": "C028",
        "name": "Firewall Management",
        "category": NETWORK,
        "weight": HIGH,
        "risk_description": (
            "Failure to properly configure and manage firewalls may expose "
            "internal systems to unauthorized network traffic, increasing the "
            "risk of cyber attacks and unauthorized access."
        ),
    },
    {
        "id": "C029",
        "name": "Network Segmentation",
        "category": NETWORK,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to segment networks appropriately may allow attackers to "
            "move laterally across systems, increasing the impact of a "
            "successful security breach."
        ),
    },
    {
        "id": "C030",
        "name": "Secure Remote Access",
        "category": NETWORK,
        "weight": HIGH,
        "risk_description": (
            "Failure to secure remote access mechanisms may allow "
            "unauthorized users to access institutional resources, increasing "
            "the risk of account compromise and data breaches."
        ),
    },
    {
        "id": "C031",
        "name": "Cloud Security",
        "category": NETWORK,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to implement appropriate cloud security controls may "
            "result in unauthorized access, data exposure, service "
            "misconfigurations, and loss of sensitive institutional data."
        ),
    },
    {
        "id": "C032",
        "name": "Server Security",
        "category": NETWORK,
        "weight": HIGH,
        "risk_description": (
            "Failure to secure servers may expose critical infrastructure to "
            "unauthorized access, malware infections, and exploitation of "
            "system vulnerabilities."
        ),
    },

    # ==========================================================
    # Monitoring & Incident Management
    # ==========================================================

    {
        "id": "C033",
        "name": "Audit Logging",
        "category": MONITORING,
        "weight": HIGH,
        "risk_description": (
            "Failure to maintain comprehensive audit logs may prevent the "
            "detection, investigation, and reconstruction of security "
            "incidents, reducing organizational visibility and accountability."
        ),
    },
    {
        "id": "C034",
        "name": "Security Monitoring",
        "category": MONITORING,
        "weight": HIGH,
        "risk_description": (
            "Failure to continuously monitor security events may delay the "
            "identification of malicious activities, increasing the impact of "
            "cyber attacks and operational disruptions."
        ),
    },
    {
        "id": "C035",
        "name": "Incident Response Plan",
        "category": MONITORING,
        "weight": HIGH,
        "risk_description": (
            "Failure to establish and maintain an incident response plan may "
            "lead to delayed or ineffective responses to security incidents, "
            "resulting in greater operational, financial, and reputational "
            "damage."
        ),
    },
    {
        "id": "C036",
        "name": "Security Incident Reporting",
        "category": MONITORING,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to implement effective security incident reporting "
            "procedures may delay incident escalation and response, increasing "
            "the likelihood of prolonged security breaches and operational "
            "disruption."
        ),
    },
    {
        "id": "C037",
        "name": "Breach Notification",
        "category": MONITORING,
        "weight": HIGH,
        "risk_description": (
            "Failure to notify affected stakeholders and regulatory "
            "authorities of security breaches in a timely manner may result in "
            "regulatory penalties, legal consequences, and loss of trust."
        ),
    },
    {
        "id": "C038",
        "name": "Backup and Recovery",
        "category": MONITORING,
        "weight": HIGH,
        "risk_description": (
            "Failure to implement reliable backup and recovery mechanisms may "
            "result in permanent data loss, prolonged service outages, and "
            "inability to recover from cyber incidents or system failures."
        ),
    },
    {
        "id": "C039",
        "name": "Disaster Recovery",
        "category": MONITORING,
        "weight": HIGH,
        "risk_description": (
            "Failure to establish disaster recovery capabilities may prevent "
            "the timely restoration of critical systems following major "
            "incidents, leading to extended operational disruption."
        ),
    },
    {
        "id": "C040",
        "name": "Business Continuity Planning",
        "category": MONITORING,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to implement business continuity planning may reduce the "
            "organization's ability to maintain essential operations during "
            "and after disruptive events, increasing operational and financial "
            "risk."
        ),
    },
    
    # ==========================================================
    # Governance & Compliance
    # ==========================================================

    {
        "id": "C041",
        "name": "Risk Assessment Process",
        "category": GOVERNANCE,
        "weight": HIGH,
        "risk_description": (
            "Failure to conduct regular risk assessments may prevent the "
            "identification and mitigation of emerging security and privacy "
            "risks, increasing the organization's overall exposure to threats."
        ),
    },
    {
        "id": "C042",
        "name": "Vendor Management",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to effectively manage third-party vendors may introduce "
            "security weaknesses through external service providers, "
            "increasing the risk of data breaches and operational disruption."
        ),
    },
    {
        "id": "C043",
        "name": "Third-Party Risk Assessment",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to assess third-party security risks may allow vendors "
            "with inadequate security practices to access institutional "
            "systems or data, increasing overall organizational risk."
        ),
    },
    {
        "id": "C044",
        "name": "Security Awareness Training",
        "category": GOVERNANCE,
        "weight": LOW,
        "risk_description": (
            "Failure to provide regular security awareness training may leave "
            "users vulnerable to phishing, social engineering, and other "
            "human-targeted cyber attacks, increasing the likelihood of "
            "security incidents."
        ),
    },
    {
        "id": "C045",
        "name": "Change Management",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to implement formal change management procedures may "
            "result in unauthorized or poorly managed system changes, "
            "introducing security vulnerabilities and service instability."
        ),
    },
    {
        "id": "C046",
        "name": "Internal Security Audits",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to conduct regular internal security audits may prevent "
            "the identification of security weaknesses and compliance gaps, "
            "allowing risks to remain undetected over time."
        ),
    },

    # ==========================================================
    # University-Specific Controls
    # ==========================================================

    {
        "id": "C047",
        "name": "Student Data Protection",
        "category": UNIVERSITY,
        "weight": HIGH,
        "risk_description": (
            "Failure to adequately protect student personal data may result "
            "in unauthorized disclosure, identity theft, privacy violations, "
            "regulatory penalties, and loss of trust among students and "
            "stakeholders."
        ),
    },
    {
        "id": "C048",
        "name": "Faculty & Staff Data Protection",
        "category": UNIVERSITY,
        "weight": HIGH,
        "risk_description": (
            "Failure to adequately protect faculty and staff personal data may "
            "lead to unauthorized access, privacy breaches, identity theft, "
            "regulatory non-compliance, and reputational damage."
        ),
    },
    {
        "id": "C049",
        "name": "Research Data Protection",
        "category": UNIVERSITY,
        "weight": MEDIUM,
        "risk_description": (
            "Failure to protect research data may result in unauthorized "
            "disclosure, intellectual property theft, loss of research "
            "integrity, and compromise of confidential academic information."
        ),
    },
    {
        "id": "C050",
        "name": "ERP/LMS Security",
        "category": UNIVERSITY,
        "weight": HIGH,
        "risk_description": (
            "Failure to secure ERP and Learning Management Systems may allow "
            "unauthorized access to academic records, personal information, "
            "and critical university services, leading to operational "
            "disruption and significant security incidents."
        ),
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