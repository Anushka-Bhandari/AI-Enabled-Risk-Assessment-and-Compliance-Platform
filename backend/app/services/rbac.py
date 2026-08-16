from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.models import User


# Platform users who can operate the Security Command Center.
PLATFORM_ROLES = {
    "SECURITY_OFFICER",
    "IT_ADMIN",
    "DIRECTOR",
    "PRINCIPAL",
}


def normalize_role(role):
    """
    Convert stored role values into a consistent format.

    Examples:
        "Security Officer" -> "SECURITY_OFFICER"
        "security_officer" -> "SECURITY_OFFICER"
        "IT Admin"         -> "IT_ADMIN"
    """
    if not role:
        return ""

    return str(role).strip().upper().replace(" ", "_").replace("-", "_")


def get_current_user():
    """
    Return the authenticated User object from the JWT identity.
    """
    identity = get_jwt_identity()

    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        return None

    return User.query.get(user_id)


def role_required(*allowed_roles):
    """
    Protect an endpoint using platform-role authorization.

    Example:
        @role_required("SECURITY_OFFICER", "IT_ADMIN")
    """

    normalized_allowed_roles = {
        normalize_role(role)
        for role in allowed_roles
    }

    def decorator(view_function):
        @wraps(view_function)
        def wrapped(*args, **kwargs):

            # 1. Make sure a valid JWT exists.
            try:
                verify_jwt_in_request()
            except Exception:
                return jsonify({
                    "success": False,
                    "message": "Authentication required."
                }), 401

            # 2. Resolve the JWT identity to a database user.
            user = get_current_user()

            if not user:
                return jsonify({
                    "success": False,
                    "message": "User not found."
                }), 404

            # 3. Read the trusted role from the database.
            user_role = normalize_role(user.role)

            # 4. Check authorization.
            if user_role not in normalized_allowed_roles:
                return jsonify({
                    "success": False,
                    "message": "You are not authorized to access this resource.",
                    "required_roles": sorted(normalized_allowed_roles),
                    "current_role": user_role or None
                }), 403

            # 5. Continue to the actual endpoint.
            return view_function(*args, **kwargs)

        return wrapped

    return decorator