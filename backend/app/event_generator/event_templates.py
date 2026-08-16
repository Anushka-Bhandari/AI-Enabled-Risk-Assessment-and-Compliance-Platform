"""
Central configuration for the Event Generator.

This file contains ONLY static data.

No event generation logic should be placed here.
"""

# ============================================================
# EVENT TYPES
# ============================================================

EVENT_TYPES = {
    "LOGIN": "User Login",
    "LOGOUT": "User Logout",
    "FAILED_LOGIN": "Failed Login",
    "PASSWORD_CHANGE": "Password Change",

    "EMAIL_SENT": "Email Sent",
    "BULK_EMAIL": "Bulk Email",

    "FILE_UPLOAD": "File Upload",
    "FILE_DOWNLOAD": "File Download",

    "DATABASE_ACCESS": "Database Access",
    "DATABASE_DOWNLOAD": "Database Download",

    "VPN_LOGIN": "VPN Login",

    "UNKNOWN_DEVICE": "Unknown Device",

    "UNKNOWN_IP": "Unknown IP",

    "USB_CONNECTED": "USB Connected",

    "MALWARE_DETECTED": "Malware Detected",

    "PRIVILEGE_ESCALATION": "Privilege Escalation",

    "APPLICATION_INSTALL": "Unauthorized Application",

    "FIREWALL_BLOCK": "Firewall Blocked Request",

    "FILE_DELETE": "File Delete",

    "ANTIVIRUS_DISABLED": "Antivirus Disabled",

    "AUDIT_LOG_TAMPERING": "Audit Log Tampering",

    # --------------------------------------------------------
    # University-specific events
    # --------------------------------------------------------

    "EXAM_RECORD_ACCESS": "Exam Record Access",
    "EXAM_RECORD_DOWNLOAD": "Exam Record Download",

    "RESULT_ACCESS": "Result Access",
    "RESULT_MODIFICATION": "Result Modification",

    "STUDENT_RECORD_ACCESS": "Student Record Access",
    "STUDENT_RECORD_DOWNLOAD": "Student Record Download",

    "ATTENDANCE_ACCESS": "Attendance Access",
    "ATTENDANCE_MODIFICATION": "Attendance Modification",

    "FACULTY_HR_RECORD_ACCESS": "Faculty HR Record Access",

    "ADMISSION_RECORD_ACCESS": "Admission Record Access",

    "SCHOLARSHIP_RECORD_ACCESS": "Scholarship Record Access",

    "FEE_RECORD_ACCESS": "Fee Record Access",

    "BULK_STUDENT_DATA_EXPORT": "Bulk Student Data Export",

    "ADMINISTRATIVE_DOCUMENT_ACCESS": "Administrative Document Access",

    "SUSPICIOUS_LOGIN": "Suspicious Login",

    "UNAUTHORIZED_ACCESS": "Unauthorized Access",

    "PRIVILEGE_ACTIVITY": "Privilege Activity",
}

# ============================================================
# WEIGHTED EVENT PROBABILITIES
# ============================================================

EVENT_WEIGHTS = {
    "LOGIN": 40,

    "LOGOUT": 18,

    "FILE_DOWNLOAD": 8,

    "FILE_UPLOAD": 7,

    "DATABASE_ACCESS": 8,

    "EMAIL_SENT": 6,

    "FAILED_LOGIN": 4,

    "PASSWORD_CHANGE": 2,

    "VPN_LOGIN": 2,

    "UNKNOWN_DEVICE": 1,

    "UNKNOWN_IP": 1,

    "USB_CONNECTED": 1,

    "DATABASE_DOWNLOAD": 0.7,

    "BULK_EMAIL": 0.5,

    "APPLICATION_INSTALL": 0.5,

    "MALWARE_DETECTED": 0.3,

    "PRIVILEGE_ESCALATION": 0.2,

    "FIREWALL_BLOCK": 0.8,

    "FILE_DELETE": 0.7,

    "ANTIVIRUS_DISABLED": 0.2,

    "AUDIT_LOG_TAMPERING": 0.1,

    # --------------------------------------------------------
    # University-specific events
    # --------------------------------------------------------

    "STUDENT_RECORD_ACCESS": 4,

    "ATTENDANCE_ACCESS": 4,

    "EXAM_RECORD_ACCESS": 3,

    "RESULT_ACCESS": 3,

    "FACULTY_HR_RECORD_ACCESS": 2,

    "ADMISSION_RECORD_ACCESS": 2,

    "FEE_RECORD_ACCESS": 2,

    "ADMINISTRATIVE_DOCUMENT_ACCESS": 2,

    "STUDENT_RECORD_DOWNLOAD": 1.5,

    "EXAM_RECORD_DOWNLOAD": 1.5,

    "SCHOLARSHIP_RECORD_ACCESS": 1.5,

    "RESULT_MODIFICATION": 1,

    "ATTENDANCE_MODIFICATION": 1,

    "BULK_STUDENT_DATA_EXPORT": 0.4,

    "SUSPICIOUS_LOGIN": 0.3,

    "UNAUTHORIZED_ACCESS": 0.2,

    "PRIVILEGE_ACTIVITY": 0.2,
}

# ============================================================
# EVENT STATUS
# ============================================================

EVENT_STATUS = [
    "SUCCESS",
    "FAILED",
    "WARNING",
    "BLOCKED"
]

# ============================================================
# RESOURCES
# ============================================================

RESOURCES = [
    "Student Database",
    "Faculty Database",
    "Finance Database",
    "HR Database",
    "Research Repository",
    "Library Portal",
    "ERP System",
    "Learning Management System",
    "Email Server",
    "Attendance Portal",
    "Admissions Portal",
    "Network Drive",
    "VPN Gateway",
    "Hostel Management System",

    # --------------------------------------------------------
    # University-specific resources
    # --------------------------------------------------------

    "Examination System",
    "Results Database",
    "Scholarship System",
    "Fee Management System",
    "Administrative Documents"
]

# ============================================================
# DEVICES
# ============================================================

DEVICES = [
    "Windows Laptop",
    "MacBook Pro",
    "Linux Workstation",
    "Android Phone",
    "iPhone",
    "University Desktop",
    "Lab Computer",
    "Unknown Device"
]

# ============================================================
# LOCATIONS
# ============================================================

LOCATIONS = [
    "Jaipur",
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Chandigarh",
    "Remote",
    "Unknown"
]

# ============================================================
# BROWSERS
# ============================================================

BROWSERS = [
    "Chrome",
    "Firefox",
    "Edge",
    "Safari"
]

# ============================================================
# OPERATING SYSTEMS
# ============================================================

OPERATING_SYSTEMS = [
    "Windows 11",
    "Windows 10",
    "Ubuntu 24.04",
    "macOS",
    "Android 15",
    "iOS 19"
]

# ============================================================
# DATABASE TABLES
# ============================================================

DATABASE_TABLES = [
    "Students",
    "Faculty",
    "Attendance",
    "Results",
    "Payroll",
    "Admissions",
    "Library",
    "Research"
]

# ============================================================
# USB DEVICES
# ============================================================

USB_DEVICES = [
    "Kingston 64GB",
    "SanDisk 32GB",
    "HP USB Drive",
    "Seagate External HDD",
    "WD Passport SSD"
]

# ============================================================
# MALWARE
# ============================================================

MALWARE_NAMES = [
    "Trojan.X",
    "Ransom.Crypt",
    "Worm.Agent",
    "Backdoor.AI",
    "Spyware.Pro",
    "Keylogger.Z"
]

# ============================================================
# APPLICATIONS
# ============================================================

APPLICATIONS = [
    "Wireshark",
    "Nmap",
    "AnyDesk",
    "TeamViewer",
    "PuTTY",
    "PowerShell Script",
    "Unknown Executable"
]
