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

    # University-specific activities
    "EXAM_RECORD_ACCESS": "Exam Record Access",
    "EXAM_RECORD_DOWNLOAD": "Exam Record Download",
    "EXAM_RESULT_MODIFY": "Exam Result Modification",
    "STUDENT_RECORD_ACCESS": "Student Record Access",
    "STUDENT_RECORD_DOWNLOAD": "Student Record Download",
    "STUDENT_RECORD_MODIFY": "Student Record Modification",
    "ATTENDANCE_ACCESS": "Attendance Record Access",
    "ATTENDANCE_MODIFY": "Attendance Record Modification",
    "FINANCIAL_RECORD_ACCESS": "Financial Record Access",
    "FINANCIAL_RECORD_MODIFY": "Financial Record Modification",
    "ADMISSION_RECORD_ACCESS": "Admission Record Access",
    "BULK_DATA_EXPORT": "Bulk University Data Export",
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
}

# ============================================================
# UNIVERSITY EVENT GENERATION
# ============================================================

# Probability that a generated event is university-specific rather than
# one of the existing generic security events.
UNIVERSITY_EVENT_RATE = 0.35

# Role-aware weights for university-specific activities. These describe
# normal activities for the monitored university roles.
ROLE_EVENT_WEIGHTS = {
    "Faculty": {
        "STUDENT_RECORD_ACCESS": 8,
        "STUDENT_RECORD_DOWNLOAD": 2,
        "ATTENDANCE_ACCESS": 6,
        "ATTENDANCE_MODIFY": 3,
        "EXAM_RECORD_ACCESS": 4,
    },
    "Exam Cell": {
        "EXAM_RECORD_ACCESS": 8,
        "EXAM_RECORD_DOWNLOAD": 4,
        "EXAM_RESULT_MODIFY": 5,
        "STUDENT_RECORD_ACCESS": 3,
        "BULK_DATA_EXPORT": 1,
    },
    "Accounts": {
        "FINANCIAL_RECORD_ACCESS": 10,
        "FINANCIAL_RECORD_MODIFY": 4,
        "BULK_DATA_EXPORT": 1,
    },
    "Lab Assistant": {
        "STUDENT_RECORD_ACCESS": 3,
        "ATTENDANCE_ACCESS": 2,
        "BULK_DATA_EXPORT": 1,
    },
    "HOD": {
        "STUDENT_RECORD_ACCESS": 5,
        "ATTENDANCE_ACCESS": 4,
        "EXAM_RECORD_ACCESS": 4,
        "EXAM_RESULT_MODIFY": 1,
    },
    "Director": {
        "STUDENT_RECORD_ACCESS": 3,
        "EXAM_RECORD_ACCESS": 3,
        "FINANCIAL_RECORD_ACCESS": 3,
        "ADMISSION_RECORD_ACCESS": 2,
        "BULK_DATA_EXPORT": 1,
    },
    "Network Engineer": {
        "BULK_DATA_EXPORT": 1,
    },
    "Research Coordinator": {
        "STUDENT_RECORD_ACCESS": 2,
        "BULK_DATA_EXPORT": 2,
    },
}

# Resources are tied to the activity, rather than selected independently.
EVENT_RESOURCES = {
    "EXAM_RECORD_ACCESS": "Examination System",
    "EXAM_RECORD_DOWNLOAD": "Examination System",
    "EXAM_RESULT_MODIFY": "Results Database",
    "STUDENT_RECORD_ACCESS": "Student Database",
    "STUDENT_RECORD_DOWNLOAD": "Student Database",
    "STUDENT_RECORD_MODIFY": "Student Database",
    "ATTENDANCE_ACCESS": "Attendance Portal",
    "ATTENDANCE_MODIFY": "Attendance Portal",
    "FINANCIAL_RECORD_ACCESS": "Finance Database",
    "FINANCIAL_RECORD_MODIFY": "Finance Database",
    "ADMISSION_RECORD_ACCESS": "Admissions Portal",
    "BULK_DATA_EXPORT": "University Data Warehouse",
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
    "Hostel Management System"
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

# ============================================================
# MONITORED USERS
# ============================================================

MONITORED_USERS = [

    {
        "name": "Ananya Sharma",
        "email": "ananya.sharma@college.edu",
        "role": "Faculty",
        "department": "Computer Science"
    },

    {
        "name": "Rahul Verma",
        "email": "rahul.verma@college.edu",
        "role": "Faculty",
        "department": "Electronics"
    },

    {
        "name": "Priya Singh",
        "email": "priya.singh@college.edu",
        "role": "Faculty",
        "department": "Mechanical"
    },

    {
        "name": "Amit Joshi",
        "email": "amit.joshi@college.edu",
        "role": "Exam Cell",
        "department": "Administration"
    },

    {
        "name": "Neha Gupta",
        "email": "neha.gupta@college.edu",
        "role": "Accounts",
        "department": "Finance"
    },

    {
        "name": "Karan Mehta",
        "email": "karan.mehta@college.edu",
        "role": "Lab Assistant",
        "department": "IT"
    },

    {
        "name": "Sakshi Jain",
        "email": "sakshi.jain@college.edu",
        "role": "HOD",
        "department": "Computer Science"
    },

    {
        "name": "Rohit Kapoor",
        "email": "rohit.kapoor@college.edu",
        "role": "Director",
        "department": "Administration"
    },

    {
        "name": "Nitin Arora",
        "email": "nitin.arora@college.edu",
        "role": "Network Engineer",
        "department": "IT"
    },

    {
        "name": "Meera Patel",
        "email": "meera.patel@college.edu",
        "role": "Research Coordinator",
        "department": "Research"
    }

]