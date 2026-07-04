# services/control_library.py

"""
Master Control Library

This file defines the master list of security, privacy, and governance
controls supported by the platform.

All modules (Questionnaire, Compliance Engine, Risk Engine, AI
Recommendation Engine) use this library as the single source of truth.
"""

CONTROL_LIBRARY = [
    # ==========================
    # Privacy & Data Governance
    # ==========================
    "Privacy Notice",
    "Consent Management",
    "Data Inventory",
    "Data Classification",
    "Data Retention",
    "Data Disposal",
    "Data Minimization",
    "Purpose Limitation",
    "Data Subject Rights Management",
    "Sensitive Personal Data Protection",

    # ==========================
    # Identity & Access Management
    # ==========================
    "Access Control",
    "Role-Based Access Control (RBAC)",
    "Multi-Factor Authentication (MFA)",
    "Password Security",
    "Privileged Access Management",
    "User Account Lifecycle Management",

    # ==========================
    # Information Security
    # ==========================
    "Information Security Policy",
    "Asset Management",
    "Encryption at Rest",
    "Encryption in Transit",
    "Secure Configuration Management",
    "Patch Management",
    "Vulnerability Management",
    "Malware Protection",
    "Endpoint Security",
    "Mobile Device Security",

    # ==========================
    # Network & Infrastructure Security
    # ==========================
    "Network Security",
    "Firewall Management",
    "Network Segmentation",
    "Secure Remote Access",
    "Cloud Security",
    "Server Security",

    # ==========================
    # Monitoring & Incident Management
    # ==========================
    "Audit Logging",
    "Security Monitoring",
    "Incident Response Plan",
    "Security Incident Reporting",
    "Breach Notification",
    "Backup and Recovery",
    "Disaster Recovery",
    "Business Continuity Planning",

    # ==========================
    # Governance & Compliance
    # ==========================
    "Risk Assessment Process",
    "Vendor Management",
    "Third-Party Risk Assessment",
    "Security Awareness Training",
    "Change Management",
    "Internal Security Audits",

    # ==========================
    # University-Specific Controls
    # ==========================
    "Student Data Protection",
    "Faculty & Staff Data Protection",
    "Research Data Protection",
    "ERP/LMS Security",
]