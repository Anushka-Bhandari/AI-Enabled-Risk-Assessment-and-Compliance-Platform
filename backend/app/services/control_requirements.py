"""
Control Requirements

Defines the detailed implementation requirements for every control.

The Compliance Engine uses this file to determine:

- Implemented requirements
- Missing requirements
- Detailed compliance reports
"""

CONTROL_REQUIREMENTS = {

    # ==========================================================
    # Privacy & Data Governance
    # ==========================================================

    "Privacy Notice": [
        "Privacy policy exists",
        "Purpose of data collection documented",
        "Data usage explained",
        "Third-party sharing disclosed",
        "User rights described"
    ],

    "Consent Management": [
        "Consent obtained before collection",
        "Consent withdrawal mechanism",
        "Consent records maintained",
        "Lawful basis documented"
    ],

    "Data Inventory": [
        "Data assets identified",
        "Data owners assigned",
        "Storage locations documented",
        "Processing activities recorded"
    ],

    "Data Classification": [
        "Classification policy exists",
        "Data labelled by sensitivity",
        "Handling procedures defined",
        "Access based on classification"
    ],

    "Data Retention": [
        "Retention policy exists",
        "Retention periods defined",
        "Automatic archival process",
        "Periodic review performed"
    ],

    "Data Disposal": [
        "Secure deletion policy",
        "Media sanitization",
        "Disposal records maintained",
        "Disposal approval process"
    ],

    "Data Minimization": [
        "Minimum necessary data collected",
        "Collection reviewed periodically",
        "Unnecessary fields removed"
    ],

    "Purpose Limitation": [
        "Purpose documented",
        "Purpose communicated",
        "No secondary unauthorized usage"
    ],

    "Data Subject Rights Management": [
        "Access request process",
        "Correction process",
        "Deletion process",
        "Response timelines defined"
    ],

    "Sensitive Personal Data Protection": [
        "Sensitive data identified",
        "Encryption enabled",
        "Restricted access",
        "Additional monitoring"
    ],

    # ==========================================================
    # Identity & Access Management
    # ==========================================================

    "Access Control": [
        "Least privilege enforced",
        "Access approval process",
        "Periodic access review",
        "Unauthorized access prevented"
    ],

    "Role-Based Access Control (RBAC)": [
        "Roles defined",
        "Permissions assigned by role",
        "Role review process",
        "Segregation of duties"
    ],

    "Multi-Factor Authentication (MFA)": [
        "MFA enabled",
        "Privileged accounts protected",
        "Remote access protected"
    ],

    "Password Security": [
        "Minimum password length",
        "Password complexity",
        "Password history",
        "Secure password storage",
        "Default passwords disabled"
    ],

    "Privileged Access Management": [
        "Admin accounts separated",
        "Privileged access monitored",
        "Approval required",
        "Session logging enabled"
    ],

    "User Account Lifecycle Management": [
        "Account provisioning",
        "Role change process",
        "Account deactivation",
        "Periodic account review"
    ],

    # ==========================================================
    # Information Security
    # ==========================================================

    "Information Security Policy": [
        "Policy documented",
        "Management approved",
        "Policy communicated",
        "Annual review"
    ],

    "Asset Management": [
        "Asset inventory",
        "Asset owner assigned",
        "Asset lifecycle defined"
    ],

    "Encryption at Rest": [
        "Database encryption",
        "Disk encryption",
        "Backup encryption"
    ],

    "Encryption in Transit": [
        "TLS enabled",
        "Secure APIs",
        "Encrypted communication"
    ],

    "Secure Configuration Management": [
        "Baseline configurations",
        "Configuration review",
        "Unauthorized changes prevented"
    ],

    "Patch Management": [
        "Patch policy",
        "Critical patch timelines",
        "Patch verification"
    ],

    "Vulnerability Management": [
        "Regular vulnerability scans",
        "Risk prioritization",
        "Remediation tracking"
    ],

    "Malware Protection": [
        "Endpoint protection",
        "Automatic updates",
        "Real-time scanning"
    ],

    "Endpoint Security": [
        "Device hardening",
        "Endpoint monitoring",
        "Endpoint encryption"
    ],

    "Mobile Device Security": [
        "Screen lock",
        "Encryption",
        "Remote wipe",
        "MDM implemented"
    ],

    # ==========================================================
    # Network & Infrastructure
    # ==========================================================

    "Network Security": [
        "Secure network architecture",
        "Intrusion detection",
        "Traffic monitoring"
    ],

    "Firewall Management": [
        "Firewall configured",
        "Firewall rules reviewed",
        "Firewall logging"
    ],

    "Network Segmentation": [
        "Critical systems isolated",
        "VLAN implemented",
        "Restricted lateral movement"
    ],

    "Secure Remote Access": [
        "VPN required",
        "MFA enabled",
        "Secure protocols used"
    ],

    "Cloud Security": [
        "Cloud security policies",
        "Cloud monitoring",
        "Cloud access control"
    ],

    "Server Security": [
        "Server hardening",
        "Patch management",
        "Monitoring enabled"
    ],

    # ==========================================================
    # Monitoring & Incident Response
    # ==========================================================

    "Audit Logging": [
        "Logs collected",
        "Logs protected",
        "Logs retained"
    ],

    "Security Monitoring": [
        "Continuous monitoring",
        "Alerting configured",
        "Incident detection"
    ],

    "Incident Response Plan": [
        "IR plan documented",
        "IR team assigned",
        "IR testing conducted"
    ],

    "Security Incident Reporting": [
        "Reporting procedure",
        "Escalation process",
        "Incident documentation"
    ],

    "Breach Notification": [
        "Notification procedure",
        "Regulatory reporting",
        "User notification"
    ],

    "Backup and Recovery": [
        "Regular backups",
        "Backup testing",
        "Recovery verification"
    ],

    "Disaster Recovery": [
        "DR plan",
        "Recovery objectives",
        "DR testing"
    ],

    "Business Continuity Planning": [
        "BCP documented",
        "Critical processes identified",
        "Periodic testing"
    ],

    # ==========================================================
    # Governance
    # ==========================================================

    "Risk Assessment Process": [
        "Risk methodology",
        "Risk register",
        "Periodic assessments"
    ],

    "Vendor Management": [
        "Vendor assessment",
        "Contracts reviewed",
        "Vendor monitoring"
    ],

    "Third-Party Risk Assessment": [
        "Risk reviews",
        "Periodic reassessment",
        "Risk documentation"
    ],

    "Security Awareness Training": [
        "Training program",
        "Annual training",
        "Training records"
    ],

    "Change Management": [
        "Change approval",
        "Testing performed",
        "Rollback plan"
    ],

    "Internal Security Audits": [
        "Audit schedule",
        "Audit reports",
        "Corrective actions"
    ],

    # ==========================================================
    # University Controls
    # ==========================================================

    "Student Data Protection": [
        "Student records protected",
        "Access restricted",
        "Encryption enabled"
    ],

    "Faculty & Staff Data Protection": [
        "Employee records protected",
        "Access control",
        "Retention policy"
    ],

    "Research Data Protection": [
        "Research data classified",
        "Access controlled",
        "Backups maintained"
    ],

    "ERP/LMS Security": [
        "ERP secured",
        "LMS secured",
        "Regular updates",
        "Monitoring enabled"
    ],

    # ==========================================================
    # ISO/IEC 27001:2022 Annex A Alignment — Additional Controls
    # (C051-C117)
    #
    # These requirements correspond to the additional controls
    # added to CONTROL_LIBRARY to achieve comprehensive Annex A
    # coverage. Control names below match CONTROL_LIBRARY exactly.
    # ==========================================================

    # ---------- A.5 Organizational controls (remaining) ----------

    "Information Security Roles and Responsibilities": [
        "Information security roles and responsibilities are formally defined and documented",
        "Security responsibilities are assigned to accountable personnel across departments",
        "Roles and responsibilities are communicated to affected staff and departments",
        "Roles and responsibilities are reviewed and updated periodically"
    ],

    "Segregation of Duties": [
        "Conflicting duties across administrative, financial, and academic record processes are identified",
        "Segregation of duties is enforced for critical functions such as finance, admissions, and examinations",
        "Compensating controls exist where full segregation is not feasible",
        "Segregation of duties arrangements are periodically reviewed"
    ],

    "Management Responsibilities for Information Security": [
        "Management requires staff and faculty to apply security in accordance with policy",
        "Management provides adequate resources for information security activities",
        "Management responsibilities for security are documented and assigned to specific roles",
        "Management promotes and models a culture of security awareness"
    ],

    "Contact with Authorities": [
        "Relevant regulatory, law enforcement, and data protection authorities are identified",
        "Procedures for contacting authorities are documented",
        "Designated personnel are responsible for authority liaison",
        "Contact information for relevant authorities is kept current"
    ],

    "Contact with Special Interest Groups": [
        "Relevant security forums, higher-education information-sharing groups, or associations are identified",
        "Participation or membership in such groups is maintained",
        "Information received from these groups is reviewed and disseminated internally"
    ],

    "Threat Intelligence": [
        "Threat intelligence sources relevant to higher education are identified",
        "Threat information is collected and analyzed on an ongoing basis",
        "Threat intelligence is used to inform risk assessments and control decisions",
        "Relevant threat intelligence findings are shared with appropriate personnel"
    ],

    "Information Security in Project Management": [
        "Information security requirements are integrated into the project management methodology",
        "Security risks are assessed at project initiation for IT and infrastructure projects",
        "Security requirements are tracked through the project lifecycle",
        "Security sign-off is required before project go-live"
    ],

    "Acceptable Use of Information and Assets": [
        "Acceptable use policy exists covering institutional information and IT assets",
        "Policy is communicated to students, faculty, and staff",
        "Acknowledgment of the acceptable use policy is obtained from users",
        "Violations of acceptable use are addressed through a defined process"
    ],

    "Return of Assets": [
        "Process exists for the return of institutional assets upon graduation, termination, or role change",
        "Asset return is tracked and documented",
        "Access is revoked in coordination with asset return",
        "Outstanding, unreturned assets are followed up"
    ],

    "Labelling of Information": [
        "Information labelling scheme is defined based on data classification",
        "Information is labelled according to its classification level",
        "Labelling procedures are communicated to relevant staff"
    ],

    "Information Transfer": [
        "Policies and procedures govern the transfer of information between departments, campuses, and external parties",
        "Secure transfer mechanisms are used for sensitive academic, financial, or personal data",
        "Information transfer agreements exist with relevant external parties",
        "Information transfers are monitored or logged"
    ],

    "Identity Management": [
        "Formal process exists for creating and managing identities for students, faculty, and staff",
        "Unique identities are assigned, with shared accounts limited to approved exceptions",
        "Identity lifecycle process covers role changes and departures",
        "Identity records are reconciled periodically across university systems"
    ],

    "Authentication Information Management": [
        "Secure issuance process exists for authentication credentials",
        "Authentication credentials are securely stored (e.g., hashed and salted)",
        "Users acknowledge responsibility for safeguarding their credentials",
        "Process exists for credential compromise reporting and reset"
    ],

    "Access Rights Provisioning and Review": [
        "Formal access provisioning process is tied to a user's role",
        "Access rights are reviewed on a periodic basis",
        "Access is revoked promptly upon role change or departure",
        "Access reviews are documented with evidence of remediation"
    ],

    "Information Security in Supplier Agreements": [
        "Security requirements are included in contracts with vendors serving the university",
        "Contracts define supplier security responsibilities and incident notification obligations",
        "Compliance with security requirements is verified before supplier onboarding",
        "Supplier agreements are reviewed periodically"
    ],

    "ICT Supply Chain Security": [
        "Supply chain risk assessment is performed for critical software and hardware vendors",
        "Security requirements flow down to sub-suppliers where relevant",
        "Provenance of hardware and software components is verified for critical systems",
        "Supply chain risks are documented and tracked"
    ],

    "Monitoring and Review of Supplier Services": [
        "Supplier service delivery and security performance is monitored",
        "Periodic supplier reviews or audits are conducted",
        "Issues identified during supplier review are tracked to resolution",
        "Supplier changes are assessed for security impact"
    ],

    "Assessment and Decision on Information Security Events": [
        "Criteria are defined for classifying an event as a security incident",
        "Process exists for triaging and assessing security events",
        "Assessment decisions are documented",
        "Events are escalated to incident response when warranted"
    ],

    "Learning from Information Security Incidents": [
        "Post-incident reviews are conducted following security incidents",
        "Root cause analysis is performed for significant incidents",
        "Lessons learned are documented and used to improve controls",
        "Trends across incidents are tracked over time"
    ],

    "Collection of Evidence": [
        "Procedures exist for identifying, collecting, and preserving evidence during incidents",
        "Chain of custody is maintained for collected evidence",
        "Evidence handling complies with applicable legal requirements",
        "Personnel involved in evidence handling are trained on proper procedures"
    ],

    "ICT Readiness for Business Continuity": [
        "ICT continuity requirements are identified based on the business continuity plan",
        "ICT systems and infrastructure are configured to meet continuity and recovery objectives",
        "ICT continuity capability is tested periodically",
        "Gaps identified during testing are remediated"
    ],

    "Legal, Statutory, Regulatory and Contractual Requirements": [
        "Applicable legal, statutory, regulatory, and contractual requirements are identified and documented",
        "Compliance obligations are mapped to relevant controls and processes",
        "Compliance with legal and regulatory requirements is reviewed periodically",
        "Changes in applicable law or regulation are tracked and incorporated"
    ],

    "Intellectual Property Rights": [
        "Intellectual property ownership policies are documented for research, course materials, and software",
        "Software licensing compliance is monitored",
        "IP protections are communicated to staff and researchers",
        "Process exists for addressing IP infringement or disputes"
    ],

    "Protection of Records": [
        "Institutional records are protected from loss, destruction, and falsification",
        "Retention requirements are applied to academic, financial, and administrative records",
        "Access to records is controlled based on sensitivity",
        "Integrity of critical records, such as transcripts, is periodically verified"
    ],

    "Independent Review of Information Security": [
        "Independent security reviews are conducted on a periodic basis",
        "Reviewers are independent of the areas being reviewed",
        "Review findings are documented and reported to management",
        "Remediation of identified gaps is tracked to completion"
    ],

    "Compliance with Information Security Policies and Standards": [
        "Process exists for monitoring departmental compliance with security policies and standards",
        "Departments and staff are periodically assessed against policy requirements",
        "Non-compliance issues are tracked and remediated",
        "Compliance status is reported to management"
    ],

    "Documented Operating Procedures": [
        "Operating procedures are documented for critical IT and administrative processes",
        "Procedures are kept up to date",
        "Procedures are accessible to relevant personnel"
    ],

    # ---------- A.6 People controls (remaining) ----------

    "Personnel Screening": [
        "Background screening is conducted prior to granting access to institutional systems, scoped to role sensitivity",
        "Screening scope is defined based on role and data sensitivity",
        "Screening records are maintained",
        "Screening is repeated or updated as appropriate for role changes"
    ],

    "Terms and Conditions of Employment": [
        "Security responsibilities are included in employment or appointment terms",
        "Terms cover confidentiality obligations",
        "Terms are acknowledged by personnel before access is granted"
    ],

    "Disciplinary Process": [
        "Formal disciplinary process exists for information security policy violations",
        "Process is documented and communicated to staff and faculty",
        "Disciplinary actions are applied proportionately and consistently"
    ],

    "Responsibilities After Termination or Change of Employment": [
        "Security responsibilities that continue after termination or role change are documented",
        "Access is revoked promptly upon termination or role change",
        "Return of assets is coordinated with the termination or offboarding process",
        "Continuing obligations are communicated to departing personnel"
    ],

    "Confidentiality and Non-Disclosure Agreements": [
        "Confidentiality or non-disclosure agreements are used for relevant personnel, researchers, and third parties",
        "Agreements cover institutional and research data",
        "Signed agreements are retained on file",
        "Agreements are reviewed periodically for adequacy"
    ],

    "Remote Working Security": [
        "Remote working security policy exists",
        "Requirements for securing home networks and personal devices used for university work are defined",
        "Remote access requires approved secure methods such as VPN and MFA",
        "Compliance with remote working requirements is monitored"
    ],

    # ---------- A.7 Physical controls ----------

    "Physical Security Perimeters": [
        "Physical security perimeters are defined around data centers, server rooms, and sensitive administrative offices",
        "Perimeter controls are documented",
        "Perimeter integrity is periodically assessed",
        "Unauthorized access attempts at perimeters are logged and reviewed"
    ],

    "Physical Entry Controls": [
        "Entry controls such as badges or locks are implemented at sensitive facilities",
        "Entry logs are maintained for restricted areas such as server rooms and examination departments",
        "Visitor access procedures are defined",
        "Entry rights to restricted areas are reviewed periodically"
    ],

    "Securing Offices, Rooms and Facilities": [
        "Physical security measures are applied to offices and records rooms containing sensitive information",
        "Access to sensitive facilities is restricted to authorized personnel",
        "Facility security requirements are documented",
        "Facility security is periodically assessed"
    ],

    "Physical Security Monitoring": [
        "Surveillance or access monitoring is implemented for sensitive campus areas",
        "Monitoring records are retained for an appropriate period",
        "Alerts or anomalies from physical monitoring are investigated",
        "Monitoring coverage is reviewed periodically"
    ],

    "Protection Against Physical and Environmental Threats": [
        "Environmental controls (fire, flood, power) are in place for facilities housing IT infrastructure",
        "Environmental risks are assessed for critical facilities",
        "Detection and suppression systems are installed where appropriate",
        "Environmental protection measures are tested and maintained"
    ],

    "Working in Secure Areas": [
        "Rules are defined for working within secure areas such as data centers or examination record rooms",
        "Access to secure areas is limited to authorized personnel",
        "Staff working in secure areas are informed of applicable procedures"
    ],

    "Clear Desk and Clear Screen": [
        "Clear desk and clear screen policy exists",
        "Policy is communicated to administrative and faculty staff",
        "Screen locking is configured on university devices"
    ],

    "Equipment Siting and Protection": [
        "Equipment is sited to reduce environmental and unauthorized access risk",
        "Equipment is protected against power fluctuations and physical damage",
        "Siting decisions are documented",
        "Protection measures are reviewed periodically"
    ],

    "Security of Assets Off-Premises": [
        "Policy governs the use of institutional assets off-premises",
        "Security requirements, such as encryption, are defined for offsite devices",
        "Loss or theft of off-premises assets is reported through a defined process",
        "Compliance with off-premises asset requirements is monitored"
    ],

    "Storage Media Security": [
        "Policy governs the handling of removable storage media",
        "Media containing sensitive data is encrypted or otherwise protected",
        "Inventory of removable media in use is maintained",
        "Secure disposal process exists for storage media"
    ],

    "Supporting Utilities": [
        "Backup power (UPS or generator) is provided for critical facilities",
        "Cooling and other supporting utilities are monitored",
        "Alerts are configured for utility failures",
        "Supporting utilities are tested periodically"
    ],

    "Cabling Security": [
        "Power and network cabling is protected from damage or interception",
        "Cabling is documented and labelled",
        "Cabling infrastructure is periodically inspected"
    ],

    "Equipment Maintenance": [
        "Maintenance schedule is defined for critical IT and physical security equipment",
        "Maintenance is performed by authorized personnel",
        "Maintenance records are maintained"
    ],

    "Secure Disposal or Reuse of Equipment": [
        "Data sanitization or destruction procedures are defined for retired equipment",
        "Sanitization is verified prior to disposal or reuse",
        "Disposal records are maintained",
        "Disposal vendors, if used, are appropriately vetted and contracted"
    ],

    # ---------- A.8 Technological controls (remaining) ----------

    "Access to Source Code": [
        "Access to source code for ERP, LMS, and other custom university systems is restricted to authorized developers",
        "Source code repositories are access-controlled and activity is logged",
        "Code changes are tracked through version control",
        "Source code access rights are reviewed periodically"
    ],

    "Capacity Management": [
        "Capacity requirements for critical systems are monitored",
        "Capacity planning is performed ahead of peak periods such as admissions or examinations",
        "Thresholds and alerts are configured for capacity issues",
        "Capacity plans are reviewed periodically"
    ],

    "Information Deletion": [
        "Policy defines when information must be securely deleted",
        "Secure deletion methods are implemented",
        "Deletion is applied consistently across production systems and backups where feasible",
        "Deletion actions are logged or otherwise verifiable"
    ],

    "Data Masking": [
        "Data masking or anonymization is applied to sensitive data used in non-production environments",
        "Masking techniques are appropriate to the sensitivity of the data",
        "Masking is applied consistently across test, training, and analytics environments",
        "Effectiveness of masking is periodically verified"
    ],

    "Data Leakage Prevention": [
        "Controls are implemented to detect and prevent unauthorized exfiltration of sensitive data",
        "Data leakage prevention rules cover sensitive data categories such as student and financial records",
        "Alerts from data leakage prevention controls are investigated",
        "Coverage of data leakage prevention controls is reviewed periodically"
    ],

    "Redundancy of Information Processing Facilities": [
        "Redundancy is implemented for critical information processing facilities",
        "Failover mechanisms are tested periodically",
        "Redundancy requirements are based on business impact analysis",
        "Availability of redundant systems is monitored"
    ],

    "Clock Synchronization": [
        "A centralized, authoritative time source (e.g., NTP) is used across university systems",
        "Clock synchronization is monitored",
        "Discrepancies in system timestamps are investigated"
    ],

    "Use of Privileged Utility Programs": [
        "Privileged utility programs are identified and their use is restricted",
        "Use of privileged utility programs is logged and monitored",
        "Access to privileged utilities requires approval and is limited to authorized personnel",
        "Inventory of privileged utility programs is maintained"
    ],

    "Installation of Software on Operational Systems": [
        "Policy restricts software installation on operational university systems",
        "An approved software list or change process governs installation",
        "Installation activity is logged or monitored",
        "Unauthorized software is detected and remediated"
    ],

    "Security of Network Services": [
        "Network services relied upon by university systems are identified and documented",
        "Security requirements are defined for each network service in use",
        "Unnecessary or insecure network services are disabled",
        "Security of network services is reviewed periodically"
    ],

    "Web Filtering": [
        "Web filtering solution is implemented on campus networks",
        "Filtering rules are updated to address emerging threats",
        "Filtering exceptions are documented and approved"
    ],

    "Secure Development Life Cycle": [
        "Secure development life cycle incorporates security requirements at each development phase",
        "Secure development standards are documented",
        "Developers are trained on secure development practices",
        "Compliance with the secure development life cycle is verified for university system projects"
    ],

    "Application Security Requirements": [
        "Security requirements are defined prior to developing or acquiring university applications",
        "Requirements cover authentication, authorization, and data protection",
        "Security requirements are incorporated into procurement or development contracts",
        "Compliance with application security requirements is verified before deployment"
    ],

    "Secure System Architecture and Engineering Principles": [
        "Secure architecture and engineering principles are documented and applied",
        "Architecture reviews are conducted for new or significantly modified systems",
        "Defense-in-depth principles are applied to system design",
        "Architecture decisions are documented"
    ],

    "Secure Coding": [
        "Secure coding standards are documented",
        "Developers are trained on secure coding practices",
        "Code reviews are performed to identify security vulnerabilities",
        "Static or dynamic code analysis tools are used where applicable"
    ],

    "Security Testing in Development and Acceptance": [
        "Security testing is performed during development of university systems",
        "Security testing is performed prior to acceptance or go-live",
        "Identified vulnerabilities are tracked to remediation",
        "Security testing results are documented"
    ],

    "Outsourced Development": [
        "Security requirements are defined for outsourced or contracted development work",
        "Oversight process exists for reviewing externally developed code",
        "Contracts with external developers include security and intellectual property provisions",
        "Deliverables from outsourced development are tested or reviewed before acceptance"
    ],

    "Separation of Development, Test and Production Environments": [
        "Development, test, and production environments are logically or physically separated",
        "Access controls differ between development, test, and production environments",
        "A change promotion process controls movement of code between environments",
        "Production data is restricted from development and test environments unless masked"
    ],

    "Test Information Management": [
        "Policy governs the selection and use of test data",
        "Sensitive production data is masked or anonymized before use in testing",
        "Access to test data is controlled",
        "Test data is securely disposed of after use"
    ],

    "Protection of Information Systems During Audit Testing": [
        "Audit testing activities on operational systems are planned and agreed with system owners",
        "Access granted for audit testing is controlled and time-limited",
        "Audit testing activities are monitored to prevent unintended disruption",
        "Scope and results of audit testing are documented"
    ]
}

# ==========================================================
# Validation
# ==========================================================
#
# Ensures CONTROL_REQUIREMENTS stays synchronized with
# CONTROL_LIBRARY (services/control_library.py). This import is
# read-only (module-level constants/functions only) and does not
# import anything from this file, so it does not introduce a
# circular dependency. If the import path differs in your
# environment, or if importing here ever creates a circular
# dependency, remove this block and keep CONTROL_REQUIREMENTS as
# the sole content of this file.

try:
    from app.services.control_library import CONTROL_LIBRARY as _CONTROL_LIBRARY

    _library_names = {control["name"] for control in _CONTROL_LIBRARY}
    _requirement_names = set(CONTROL_REQUIREMENTS.keys())

    _missing_requirements = sorted(_library_names - _requirement_names)
    _unknown_requirements = sorted(_requirement_names - _library_names)
    _empty_requirements = sorted(
        name for name, reqs in CONTROL_REQUIREMENTS.items() if not reqs
    )

    if _missing_requirements:
        raise RuntimeError(
            "CONTROL_REQUIREMENTS is missing entries for controls: "
            f"{_missing_requirements}"
        )

    if _unknown_requirements:
        raise RuntimeError(
            "CONTROL_REQUIREMENTS contains entries for unknown controls: "
            f"{_unknown_requirements}"
        )

    if _empty_requirements:
        raise RuntimeError(
            "CONTROL_REQUIREMENTS contains empty requirement lists for: "
            f"{_empty_requirements}"
        )

except ImportError:
    # services.control_library is not importable from this module in
    # the current environment (e.g. different package layout, or
    # importing it here would create a circular dependency). Skip
    # validation rather than break module import.
    pass