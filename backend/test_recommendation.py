from app import create_app
from app.services.recommendation_engine import RecommendationEngine

app = create_app()

with app.app_context():

    assessment_id = 1      # <-- Change to an assessment that already has
                            #     compliance and risk results

    try:

        result = RecommendationEngine(
            assessment_id
        ).run()

        print("=" * 80)
        print("AI Recommendations")
        print("=" * 80)
        print(result)

    except Exception as e:

        print("=" * 80)
        print("ERROR")
        print("=" * 80)
        print(str(e))