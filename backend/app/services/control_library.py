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
PHYSICAL = "Physical & Environmental Security"
PEOPLE = "People Security"
SUPPLIER = "Supplier & Third-Party Security"
APPSEC = "Application & Development Security"

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
    },
    {
        "id": "C004",
        "name": "Data Classification",
        "category": PRIVACY,
        "weight": MEDIUM,
        "iso27001": ["A.5.12"],
        "risk_description": (
            "Failure to classify data appropriately may lead to inadequate "
            "security controls and increased exposure of sensitive information."
        ),
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
    },
    {
        "id": "C010",
        "name": "Sensitive Personal Data Protection",
        "category": PRIVACY,
        "weight": HIGH,
        "iso27001": ["A.5.34"],
        "risk_description": (
            "Failure to adequately protect sensitive personal data may result in "
            "serious privacy breaches, regulatory penalties, and significant "
            "harm to affected individuals."
        ),
    },

    # ==========================================================
    # Identity & Access Management
    # ==========================================================

    {
        "id": "C011",
        "name": "Access Control",
        "category": IAM,
        "weight": HIGH,
        "iso27001": ["A.5.15", "A.8.3"],
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
        "iso27001": ["A.8.5"],
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
        "iso27001": ["A.8.5"],
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
        "iso27001": ["A.8.2"],
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
        "iso27001": ["A.5.1"],
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
        "iso27001": ["A.5.9"],
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
        "iso27001": ["A.8.24"],
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
        "iso27001": ["A.8.24"],
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
        "iso27001": ["A.8.9"],
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
        "iso27001": ["A.8.8"],
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
        "iso27001": ["A.8.7"],
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
        "iso27001": ["A.8.1"],
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
        "iso27001": ["A.8.20"],
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
        "iso27001": ["A.8.22"],
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
        "iso27001": ["A.5.23", "A.5.19"],
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
        "iso27001": ["A.8.15"],
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
        "iso27001": ["A.8.16"],
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
        "iso27001": ["A.5.24"],
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
        "iso27001": ["A.5.26", "A.6.8"],
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
        "iso27001": ["A.8.13"],
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
        "iso27001": ["A.5.29"],
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
        "iso27001": ["A.6.3"],
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
        "iso27001": ["A.8.32"],
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

    # ==========================================================
    # ISO/IEC 27001:2022 Annex A Alignment — Additional Controls
    #
    # The controls below were added to bring CONTROL_LIBRARY into
    # comprehensive alignment with ISO/IEC 27001:2022 Annex A.
    # Existing controls (C001-C050) already substantially cover a
    # number of Annex A controls (C017 -> A.5.1, C011 -> A.5.15,
    # C004 -> A.5.12, C031 -> A.5.23/A.5.19, C035 -> A.5.24, C044 ->
    # A.6.3, C038 -> A.8.13, C033 -> A.8.15, C034 -> A.8.16, C045 ->
    # A.8.32, C019/C020 -> A.8.24). These mappings are now recorded
    # directly as "iso27001" metadata on those C001-C050 controls
    # above, and were intentionally NOT duplicated here.
    # ==========================================================

    # ---------- A.5 Organizational controls (remaining) ----------

    {
        "id": "C051",
        "name": "Information Security Roles and Responsibilities",
        "category": GOVERNANCE,
        "weight": HIGH,
        "iso27001": ["A.5.2"],
        "risk_description": (
            "Failure to clearly define and assign information security roles "
            "and responsibilities across university departments may result in "
            "unclear accountability, gaps in security governance, and delayed "
            "response to security issues."
        ),
    },
    {
        "id": "C052",
        "name": "Segregation of Duties",
        "category": GOVERNANCE,
        "weight": HIGH,
        "iso27001": ["A.5.3"],
        "risk_description": (
            "Failure to segregate conflicting duties, such as combining "
            "finance, admissions, or examination record creation with their "
            "approval, may enable fraud, unauthorized data manipulation, and "
            "undetected errors within university administrative systems."
        ),
    },
    {
        "id": "C053",
        "name": "Management Responsibilities for Information Security",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "iso27001": ["A.5.4"],
        "risk_description": (
            "Failure of university leadership and department heads to actively "
            "support and enforce information security requirements may result "
            "in inconsistent compliance and weakened security culture across "
            "faculties and administrative units."
        ),
    },
    {
        "id": "C054",
        "name": "Contact with Authorities",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "iso27001": ["A.5.5"],
        "risk_description": (
            "Failure to maintain appropriate contact with regulators, law "
            "enforcement, and data protection authorities may delay legally "
            "required reporting and reduce the institution's ability to "
            "respond effectively to security incidents or investigations."
        ),
    },
    {
        "id": "C055",
        "name": "Contact with Special Interest Groups",
        "category": GOVERNANCE,
        "weight": LOW,
        "iso27001": ["A.5.6"],
        "risk_description": (
            "Failure to maintain contact with security forums, higher-education "
            "information-sharing groups, and professional associations may "
            "leave the university unaware of emerging threats and industry "
            "best practices relevant to academic institutions."
        ),
    },
    {
        "id": "C056",
        "name": "Threat Intelligence",
        "category": MONITORING,
        "weight": MEDIUM,
        "iso27001": ["A.5.7"],
        "risk_description": (
            "Failure to collect and analyze threat intelligence relevant to "
            "higher education may leave the university unprepared for emerging "
            "attack techniques targeting student data, research systems, or "
            "campus infrastructure."
        ),
    },
    {
        "id": "C057",
        "name": "Information Security in Project Management",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "iso27001": ["A.5.8"],
        "risk_description": (
            "Failure to integrate information security requirements into "
            "university IT and infrastructure projects (e.g. new ERP rollouts, "
            "campus system migrations) may introduce vulnerabilities that are "
            "costly or impossible to remediate after deployment."
        ),
    },
    {
        "id": "C058",
        "name": "Acceptable Use of Information and Assets",
        "category": INFOSEC,
        "weight": MEDIUM,
        "iso27001": ["A.5.10"],
        "risk_description": (
            "Failure to define and enforce acceptable use rules for "
            "institutional information and IT assets may lead to misuse of "
            "systems by students, faculty, or staff, exposing the university "
            "to security, legal, and reputational risks."
        ),
    },
    {
        "id": "C059",
        "name": "Return of Assets",
        "category": INFOSEC,
        "weight": LOW,
        "iso27001": ["A.5.11"],
        "risk_description": (
            "Failure to ensure the return of institutional devices, access "
            "cards, and information assets when students graduate or staff "
            "leave may result in continued unauthorized access or loss of "
            "university property."
        ),
    },
    {
        "id": "C060",
        "name": "Labelling of Information",
        "category": PRIVACY,
        "weight": LOW,
        "iso27001": ["A.5.13"],
        "risk_description": (
            "Failure to consistently label information according to its "
            "classification level may cause staff to mishandle sensitive "
            "student, research, or financial data, increasing the risk of "
            "accidental exposure."
        ),
    },
    {
        "id": "C061",
        "name": "Information Transfer",
        "category": INFOSEC,
        "weight": HIGH,
        "iso27001": ["A.5.14"],
        "risk_description": (
            "Failure to secure the transfer of information between "
            "departments, campuses, or external parties may result in "
            "interception, loss, or unauthorized disclosure of sensitive "
            "academic, financial, or personal data during transmission."
        ),
    },
    {
        "id": "C062",
        "name": "Identity Management",
        "category": IAM,
        "weight": HIGH,
        "iso27001": ["A.5.16"],
        "risk_description": (
            "Failure to manage the full identity lifecycle of students, "
            "faculty, and staff across university systems may result in "
            "duplicate, orphaned, or inconsistent identities, increasing the "
            "risk of unauthorized access."
        ),
    },
    {
        "id": "C063",
        "name": "Authentication Information Management",
        "category": IAM,
        "weight": HIGH,
        "iso27001": ["A.5.17"],
        "risk_description": (
            "Failure to securely issue, store, and manage authentication "
            "credentials for university accounts may result in credential "
            "theft, unauthorized account takeover, and compromise of "
            "institutional systems."
        ),
    },
    {
        "id": "C064",
        "name": "Access Rights Provisioning and Review",
        "category": IAM,
        "weight": HIGH,
        "iso27001": ["A.5.18"],
        "risk_description": (
            "Failure to formally provision, periodically review, and revoke "
            "access rights as students and staff change roles or leave the "
            "university may result in excessive or stale access privileges "
            "across academic and administrative systems."
        ),
    },
    {
        "id": "C065",
        "name": "Information Security in Supplier Agreements",
        "category": SUPPLIER,
        "weight": MEDIUM,
        "iso27001": ["A.5.20"],
        "risk_description": (
            "Failure to include information security requirements in "
            "contracts with vendors serving the university (e.g. ERP, LMS, or "
            "cloud providers) may leave gaps in accountability and weaken "
            "contractual recourse following a supplier-related incident."
        ),
    },
    {
        "id": "C066",
        "name": "ICT Supply Chain Security",
        "category": SUPPLIER,
        "weight": HIGH,
        "iso27001": ["A.5.21"],
        "risk_description": (
            "Failure to assess security risks introduced through the ICT "
            "supply chain, including software vendors and hardware suppliers, "
            "may allow compromised components or services to be integrated "
            "into critical university infrastructure."
        ),
    },
    {
        "id": "C067",
        "name": "Monitoring and Review of Supplier Services",
        "category": SUPPLIER,
        "weight": MEDIUM,
        "iso27001": ["A.5.22"],
        "risk_description": (
            "Failure to regularly monitor and review supplier service "
            "delivery and security performance may allow degraded vendor "
            "security practices to go undetected, increasing the risk of "
            "service disruption or data compromise."
        ),
    },
    {
        "id": "C068",
        "name": "Assessment and Decision on Information Security Events",
        "category": MONITORING,
        "weight": HIGH,
        "iso27001": ["A.5.25"],
        "risk_description": (
            "Failure to consistently assess security events and decide "
            "whether they constitute an incident may result in genuine "
            "incidents being overlooked or escalated too late to limit "
            "damage."
        ),
    },
    {
        "id": "C069",
        "name": "Learning from Information Security Incidents",
        "category": MONITORING,
        "weight": MEDIUM,
        "iso27001": ["A.5.27"],
        "risk_description": (
            "Failure to analyze past security incidents and apply lessons "
            "learned may result in recurring incidents and missed "
            "opportunities to strengthen university security controls."
        ),
    },
    {
        "id": "C070",
        "name": "Collection of Evidence",
        "category": MONITORING,
        "weight": MEDIUM,
        "iso27001": ["A.5.28"],
        "risk_description": (
            "Failure to properly identify, collect, and preserve evidence "
            "during a security incident may compromise disciplinary, legal, "
            "or regulatory action against those responsible."
        ),
    },
    {
        "id": "C071",
        "name": "ICT Readiness for Business Continuity",
        "category": MONITORING,
        "weight": HIGH,
        "iso27001": ["A.5.30"],
        "risk_description": (
            "Failure to ensure that ICT systems and infrastructure are "
            "prepared to support business continuity objectives may prevent "
            "critical university services, such as examinations or ERP "
            "systems, from being restored within acceptable timeframes after "
            "a disruption."
        ),
    },
    {
        "id": "C072",
        "name": "Legal, Statutory, Regulatory and Contractual Requirements",
        "category": GOVERNANCE,
        "weight": HIGH,
        "iso27001": ["A.5.31"],
        "risk_description": (
            "Failure to identify and comply with applicable education, data "
            "protection, and other legal or regulatory requirements may "
            "expose the university to penalties, litigation, and loss of "
            "accreditation."
        ),
    },
    {
        "id": "C073",
        "name": "Intellectual Property Rights",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "iso27001": ["A.5.32"],
        "risk_description": (
            "Failure to protect intellectual property rights related to "
            "research output, course materials, and licensed software may "
            "result in legal disputes, loss of licensing compliance, or "
            "unauthorized use of institutional intellectual property."
        ),
    },
    {
        "id": "C074",
        "name": "Protection of Records",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "iso27001": ["A.5.33"],
        "risk_description": (
            "Failure to protect academic, financial, and administrative "
            "records from loss, falsification, or unauthorized alteration may "
            "compromise the integrity and legal validity of institutional "
            "records, including transcripts and examination results."
        ),
    },
    {
        "id": "C075",
        "name": "Independent Review of Information Security",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "iso27001": ["A.5.35"],
        "risk_description": (
            "Failure to conduct independent reviews of the university's "
            "information security posture may allow biased self-assessment "
            "and unidentified control gaps to persist over time."
        ),
    },
    {
        "id": "C076",
        "name": "Compliance with Information Security Policies and Standards",
        "category": GOVERNANCE,
        "weight": MEDIUM,
        "iso27001": ["A.5.36"],
        "risk_description": (
            "Failure to verify that departments and staff comply with "
            "established information security policies and standards may "
            "allow non-compliant practices to persist undetected across the "
            "university."
        ),
    },
    {
        "id": "C077",
        "name": "Documented Operating Procedures",
        "category": GOVERNANCE,
        "weight": LOW,
        "iso27001": ["A.5.37"],
        "risk_description": (
            "Failure to document operating procedures for critical IT and "
            "administrative processes may result in inconsistent execution, "
            "knowledge loss when staff leave, and increased risk of "
            "operational errors."
        ),
    },

    # ---------- A.6 People controls (remaining) ----------

    {
        "id": "C078",
        "name": "Personnel Screening",
        "category": PEOPLE,
        "weight": MEDIUM,
        "iso27001": ["A.6.1"],
        "risk_description": (
            "Failure to conduct appropriate background screening of faculty, "
            "staff, and contractors prior to granting access to institutional "
            "systems may increase the risk of insider threats and unsuitable "
            "individuals gaining access to sensitive university data."
        ),
    },
    {
        "id": "C079",
        "name": "Terms and Conditions of Employment",
        "category": PEOPLE,
        "weight": LOW,
        "iso27001": ["A.6.2"],
        "risk_description": (
            "Failure to clearly communicate information security "
            "responsibilities within employment terms may leave faculty and "
            "staff unaware of their security obligations, weakening "
            "enforceability of security expectations."
        ),
    },
    {
        "id": "C080",
        "name": "Disciplinary Process",
        "category": PEOPLE,
        "weight": LOW,
        "iso27001": ["A.6.4"],
        "risk_description": (
            "Failure to maintain a formal disciplinary process for "
            "information security violations may reduce deterrence against "
            "policy violations by staff, faculty, or students with system "
            "access."
        ),
    },
    {
        "id": "C081",
        "name": "Responsibilities After Termination or Change of Employment",
        "category": PEOPLE,
        "weight": MEDIUM,
        "iso27001": ["A.6.5"],
        "risk_description": (
            "Failure to enforce security responsibilities that continue after "
            "staff termination or role change, such as confidentiality "
            "obligations and access revocation, may result in continued "
            "unauthorized access or data misuse by former personnel."
        ),
    },
    {
        "id": "C082",
        "name": "Confidentiality and Non-Disclosure Agreements",
        "category": PEOPLE,
        "weight": MEDIUM,
        "iso27001": ["A.6.6"],
        "risk_description": (
            "Failure to establish confidentiality or non-disclosure agreements "
            "with staff, researchers, and third parties may weaken legal "
            "protection over sensitive student, research, and institutional "
            "information."
        ),
    },
    {
        "id": "C083",
        "name": "Remote Working Security",
        "category": PEOPLE,
        "weight": MEDIUM,
        "iso27001": ["A.6.7"],
        "risk_description": (
            "Failure to define and enforce security requirements for faculty "
            "and staff working remotely may expose institutional data to "
            "unsecured home networks, personal devices, and unauthorized "
            "physical access."
        ),
    },

    # ---------- A.7 Physical controls ----------

    {
        "id": "C084",
        "name": "Physical Security Perimeters",
        "category": PHYSICAL,
        "weight": HIGH,
        "iso27001": ["A.7.1"],
        "risk_description": (
            "Failure to establish defined physical security perimeters around "
            "data centers, server rooms, and administrative offices may allow "
            "unauthorized individuals to gain physical access to critical "
            "university infrastructure."
        ),
    },
    {
        "id": "C085",
        "name": "Physical Entry Controls",
        "category": PHYSICAL,
        "weight": HIGH,
        "iso27001": ["A.7.2"],
        "risk_description": (
            "Failure to enforce physical entry controls at server rooms, "
            "examination departments, and administrative areas may allow "
            "unauthorized entry, theft, or tampering with sensitive systems "
            "and records."
        ),
    },
    {
        "id": "C086",
        "name": "Securing Offices, Rooms and Facilities",
        "category": PHYSICAL,
        "weight": MEDIUM,
        "iso27001": ["A.7.3"],
        "risk_description": (
            "Failure to physically secure offices, records rooms, and "
            "facilities housing sensitive information may increase the risk "
            "of unauthorized access to student records, financial documents, "
            "or research materials."
        ),
    },
    {
        "id": "C087",
        "name": "Physical Security Monitoring",
        "category": PHYSICAL,
        "weight": MEDIUM,
        "iso27001": ["A.7.4"],
        "risk_description": (
            "Failure to monitor sensitive campus areas through surveillance "
            "or access logging may delay detection of unauthorized physical "
            "access or theft affecting IT and administrative facilities."
        ),
    },
    {
        "id": "C088",
        "name": "Protection Against Physical and Environmental Threats",
        "category": PHYSICAL,
        "weight": MEDIUM,
        "iso27001": ["A.7.5"],
        "risk_description": (
            "Failure to protect facilities against fire, flooding, power "
            "surges, and other environmental threats may result in damage to "
            "IT infrastructure and loss of critical university systems and "
            "data."
        ),
    },
    {
        "id": "C089",
        "name": "Working in Secure Areas",
        "category": PHYSICAL,
        "weight": LOW,
        "iso27001": ["A.7.6"],
        "risk_description": (
            "Failure to define rules for working within secure areas such as "
            "data centers or examination record rooms may increase the risk "
            "of accidental exposure or tampering with sensitive materials."
        ),
    },
    {
        "id": "C090",
        "name": "Clear Desk and Clear Screen",
        "category": PHYSICAL,
        "weight": LOW,
        "iso27001": ["A.7.7"],
        "risk_description": (
            "Failure to enforce clear desk and clear screen practices in "
            "administrative and faculty offices may expose sensitive student "
            "or institutional information to unauthorized viewing."
        ),
    },
    {
        "id": "C091",
        "name": "Equipment Siting and Protection",
        "category": PHYSICAL,
        "weight": MEDIUM,
        "iso27001": ["A.7.8"],
        "risk_description": (
            "Failure to appropriately site and protect IT equipment may "
            "increase exposure to environmental hazards, unauthorized "
            "viewing, or accidental damage affecting critical university "
            "systems."
        ),
    },
    {
        "id": "C092",
        "name": "Security of Assets Off-Premises",
        "category": PHYSICAL,
        "weight": MEDIUM,
        "iso27001": ["A.7.9"],
        "risk_description": (
            "Failure to secure university-owned laptops and devices used "
            "off-campus by faculty and staff may result in loss, theft, or "
            "compromise of institutional data outside the university's "
            "physical security controls."
        ),
    },
    {
        "id": "C093",
        "name": "Storage Media Security",
        "category": PHYSICAL,
        "weight": MEDIUM,
        "iso27001": ["A.7.10"],
        "risk_description": (
            "Failure to securely manage removable storage media containing "
            "institutional data may result in loss or unauthorized disclosure "
            "of sensitive student, research, or financial information."
        ),
    },
    {
        "id": "C094",
        "name": "Supporting Utilities",
        "category": PHYSICAL,
        "weight": MEDIUM,
        "iso27001": ["A.7.11"],
        "risk_description": (
            "Failure to ensure reliable power, cooling, and other supporting "
            "utilities for server rooms and data centers may result in "
            "unplanned outages and damage to critical university IT "
            "infrastructure."
        ),
    },
    {
        "id": "C095",
        "name": "Cabling Security",
        "category": PHYSICAL,
        "weight": LOW,
        "iso27001": ["A.7.12"],
        "risk_description": (
            "Failure to protect power and network cabling from damage or "
            "interception may result in service disruption or unauthorized "
            "access to network traffic within university facilities."
        ),
    },
    {
        "id": "C096",
        "name": "Equipment Maintenance",
        "category": PHYSICAL,
        "weight": LOW,
        "iso27001": ["A.7.13"],
        "risk_description": (
            "Failure to properly maintain IT and physical security equipment "
            "may lead to unexpected failures, reduced equipment lifespan, and "
            "gaps in physical protection of critical infrastructure."
        ),
    },
    {
        "id": "C097",
        "name": "Secure Disposal or Reuse of Equipment",
        "category": PHYSICAL,
        "weight": MEDIUM,
        "iso27001": ["A.7.14"],
        "risk_description": (
            "Failure to securely wipe or destroy data on equipment prior to "
            "disposal or reuse may expose sensitive student, staff, or "
            "research data to unauthorized recovery from decommissioned "
            "devices."
        ),
    },

    # ---------- A.8 Technological controls (remaining) ----------

    {
        "id": "C098",
        "name": "Access to Source Code",
        "category": IAM,
        "weight": HIGH,
        "iso27001": ["A.8.4"],
        "risk_description": (
            "Failure to restrict access to the source code of ERP, LMS, or "
            "other custom university systems may allow unauthorized "
            "modification, introduction of vulnerabilities, or theft of "
            "proprietary institutional software."
        ),
    },
    {
        "id": "C099",
        "name": "Capacity Management",
        "category": INFOSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.6"],
        "risk_description": (
            "Failure to monitor and plan system capacity may result in "
            "performance degradation or outages of critical university "
            "systems during peak periods such as admissions or examinations."
        ),
    },
    {
        "id": "C100",
        "name": "Information Deletion",
        "category": INFOSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.10"],
        "risk_description": (
            "Failure to securely delete information from systems and "
            "applications when it is no longer required may result in "
            "unnecessary retention of sensitive data and increased exposure "
            "in the event of a breach."
        ),
    },
    {
        "id": "C101",
        "name": "Data Masking",
        "category": INFOSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.11"],
        "risk_description": (
            "Failure to mask sensitive data such as student records when used "
            "in testing, training, or analytics environments may expose real "
            "personal information to individuals who do not need access to "
            "it."
        ),
    },
    {
        "id": "C102",
        "name": "Data Leakage Prevention",
        "category": INFOSEC,
        "weight": HIGH,
        "iso27001": ["A.8.12"],
        "risk_description": (
            "Failure to implement controls that detect and prevent "
            "unauthorized exfiltration of sensitive data may allow student, "
            "research, or financial data to leave university systems "
            "undetected."
        ),
    },
    {
        "id": "C103",
        "name": "Redundancy of Information Processing Facilities",
        "category": INFOSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.14"],
        "risk_description": (
            "Failure to implement redundancy for critical information "
            "processing facilities may result in extended downtime of "
            "essential university systems following a hardware or "
            "infrastructure failure."
        ),
    },
    {
        "id": "C104",
        "name": "Clock Synchronization",
        "category": MONITORING,
        "weight": LOW,
        "iso27001": ["A.8.17"],
        "risk_description": (
            "Failure to synchronize clocks across university systems may "
            "produce inconsistent timestamps in logs, hindering accurate "
            "incident investigation and correlation of security events."
        ),
    },
    {
        "id": "C105",
        "name": "Use of Privileged Utility Programs",
        "category": IAM,
        "weight": MEDIUM,
        "iso27001": ["A.8.18"],
        "risk_description": (
            "Failure to restrict and monitor the use of privileged utility "
            "programs may allow these tools to be used to bypass system and "
            "application security controls."
        ),
    },
    {
        "id": "C106",
        "name": "Installation of Software on Operational Systems",
        "category": INFOSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.19"],
        "risk_description": (
            "Failure to control software installation on operational "
            "university systems may introduce unapproved, vulnerable, or "
            "malicious software into critical environments."
        ),
    },
    {
        "id": "C107",
        "name": "Security of Network Services",
        "category": NETWORK,
        "weight": MEDIUM,
        "iso27001": ["A.8.21"],
        "risk_description": (
            "Failure to identify and secure the network services relied upon "
            "by university systems may leave insecure or unnecessary "
            "services exposed to exploitation."
        ),
    },
    {
        "id": "C108",
        "name": "Web Filtering",
        "category": NETWORK,
        "weight": LOW,
        "iso27001": ["A.8.23"],
        "risk_description": (
            "Failure to filter access to malicious or inappropriate websites "
            "from campus networks may increase exposure to malware, phishing "
            "sites, and other web-based threats."
        ),
    },
    {
        "id": "C109",
        "name": "Secure Development Life Cycle",
        "category": APPSEC,
        "weight": HIGH,
        "iso27001": ["A.8.25"],
        "risk_description": (
            "Failure to apply security practices throughout the software "
            "development life cycle of university systems may result in "
            "vulnerabilities being introduced early and persisting through "
            "to production."
        ),
    },
    {
        "id": "C110",
        "name": "Application Security Requirements",
        "category": APPSEC,
        "weight": HIGH,
        "iso27001": ["A.8.26"],
        "risk_description": (
            "Failure to define security requirements before developing or "
            "acquiring university applications may result in systems that do "
            "not adequately protect sensitive academic and personal data."
        ),
    },
    {
        "id": "C111",
        "name": "Secure System Architecture and Engineering Principles",
        "category": APPSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.27"],
        "risk_description": (
            "Failure to apply secure architecture and engineering principles "
            "when designing university systems may result in structurally "
            "weak systems that are difficult to secure after deployment."
        ),
    },
    {
        "id": "C112",
        "name": "Secure Coding",
        "category": APPSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.28"],
        "risk_description": (
            "Failure to follow secure coding practices when developing "
            "custom university applications may introduce exploitable "
            "vulnerabilities such as injection flaws or broken access "
            "control."
        ),
    },
    {
        "id": "C113",
        "name": "Security Testing in Development and Acceptance",
        "category": APPSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.29"],
        "risk_description": (
            "Failure to conduct security testing during development and prior "
            "to acceptance of university systems may allow vulnerabilities to "
            "reach production undetected."
        ),
    },
    {
        "id": "C114",
        "name": "Outsourced Development",
        "category": APPSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.30"],
        "risk_description": (
            "Failure to oversee the security practices of external "
            "developers building university systems may result in "
            "vulnerabilities, backdoors, or non-compliant code being "
            "delivered without institutional visibility."
        ),
    },
    {
        "id": "C115",
        "name": "Separation of Development, Test and Production Environments",
        "category": APPSEC,
        "weight": MEDIUM,
        "iso27001": ["A.8.31"],
        "risk_description": (
            "Failure to separate development, test, and production "
            "environments may allow untested changes or insecure "
            "configurations to affect live university systems and real "
            "student or staff data."
        ),
    },
    {
        "id": "C116",
        "name": "Test Information Management",
        "category": APPSEC,
        "weight": LOW,
        "iso27001": ["A.8.33"],
        "risk_description": (
            "Failure to carefully select and protect test data may result in "
            "real student, staff, or research information being exposed in "
            "less secure development or testing environments."
        ),
    },
    {
        "id": "C117",
        "name": "Protection of Information Systems During Audit Testing",
        "category": APPSEC,
        "weight": LOW,
        "iso27001": ["A.8.34"],
        "risk_description": (
            "Failure to plan and control audit testing activities on "
            "operational university systems may result in unintended service "
            "disruption or unauthorized access during the audit process."
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