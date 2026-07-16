from app.models import ComplianceResult
from app.services.control_frameworks import (
    CONTROL_FRAMEWORKS,
    SUPPORTED_FRAMEWORKS,
)


class FrameworkService:

    IMPLEMENTED = "IMPLEMENTED"
    PARTIAL = "PARTIALLY_IMPLEMENTED"
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED"

    def __init__(self, assessment_id):

        self.assessment_id = assessment_id

    def calculate_scores(self):

        framework_scores = {

            framework: {

                "implemented": 0,

                "partial": 0,

                "missing": 0,

                "total": 0,

                "score": 0

            }

            for framework in SUPPORTED_FRAMEWORKS

        }

        results = ComplianceResult.query.filter_by(

            assessment_id=self.assessment_id

        ).all()

        for result in results:

            frameworks = CONTROL_FRAMEWORKS.get(
                result.control_id,
                []
            )

            for framework in frameworks:

                framework_scores[framework]["total"] += 1

                if result.compliance_status == self.IMPLEMENTED:

                    framework_scores[framework]["implemented"] += 1

                elif result.compliance_status == self.PARTIAL:

                    framework_scores[framework]["partial"] += 1

                elif result.compliance_status == self.NOT_IMPLEMENTED:

                    framework_scores[framework]["missing"] += 1

                else:
                    # Unknown status - treat it as missing for safety
                    framework_scores[framework]["missing"] += 1

        for framework, values in framework_scores.items():

            total = values["total"]

            if total == 0:

                continue

            values["score"] = round(

                (

                    values["implemented"]

                    +

                    0.5 * values["partial"]

                )

                / total

                * 100,

                2

            )

        return framework_scores