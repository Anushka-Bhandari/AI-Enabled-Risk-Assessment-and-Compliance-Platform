from app import db
from app.models import Alert


class AlertEngine:
    """
    Persists Alert objects produced by the Detection Engine.

    The Detection Engine (DetectionEngine.run_detection) is responsible for
    evaluating an ActivityLog against RULE_LIBRARY and returning fully
    populated Alert objects, each already carrying the correct
    university_id. This class's only responsibility is to persist those
    objects.
    """

    def __init__(self, alerts):
        self.alerts = alerts

    def run(self):
        """
        Persist the Alert objects and return them.
        """

        if not self.alerts:
            return []

        try:
            for alert in self.alerts:
                db.session.add(alert)

            db.session.commit()
        except Exception:
            db.session.rollback()
            raise

        return self.alerts