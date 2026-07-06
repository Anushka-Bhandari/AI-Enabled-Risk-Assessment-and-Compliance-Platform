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
    ]
}