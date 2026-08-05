"""
Central configuration for the Event Generator.

This file contains ONLY static data.
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
    "FILE_UPLOAD": "File Upload",
    "FILE_DOWNLOAD": "File Download",
    "DATABASE_ACCESS": "Database Access",
    "DATABASE_DOWNLOAD": "Database Download",
    "VPN_LOGIN": "VPN Login",
    "UNKNOWN_DEVICE": "Unknown Device",
    "UNKNOWN_IP": "Unknown IP",
    "USB_CONNECTED": "USB Connected",
    "MALWARE_DETECTED": "Malware Detected",
    "PRIVILEGE_ESCALATION": "Privilege Escalation"
}

# ============================================================
# EVENT WEIGHTS
# ============================================================

EVENT_WEIGHTS = {
    "LOGIN": 40,
    "LOGOUT": 15,
    "FAILED_LOGIN": 8,
    "PASSWORD_CHANGE": 3,
    "EMAIL_SENT": 5,
    "FILE_UPLOAD": 6,
    "FILE_DOWNLOAD": 8,
    "DATABASE_ACCESS": 5,
    "DATABASE_DOWNLOAD": 2,
    "VPN_LOGIN": 4,
    "UNKNOWN_DEVICE": 1,
    "UNKNOWN_IP": 1,
    "USB_CONNECTED": 1,
    "MALWARE_DETECTED": 1,
    "PRIVILEGE_ESCALATION": 1
}

# ============================================================
# RESOURCES
# ============================================================

RESOURCES = [
    "Student Portal",
    "Faculty Portal",
    "Finance Database",
    "Research Repository",
    "Library Portal",
    "ERP System",
    "Attendance System",
    "VPN Gateway"
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
    "University Desktop"
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
    "Pune"
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
    }
]