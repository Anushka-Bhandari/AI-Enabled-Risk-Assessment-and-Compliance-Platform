from app.models import ThreatAnalysis


class ThreatAnalysisService:
    """
    Service responsible for loading
    previously generated threat analyses.
    """

    def __init__(self, alert_id: int):

        self.alert_id = alert_id

    def load(self):

        analysis = ThreatAnalysis.query.filter_by(
            alert_id=self.alert_id
        ).first()

        if not analysis:

            raise ValueError(
                f"No threat analysis found for Alert {self.alert_id}."
            )

        return analysis.to_dict()