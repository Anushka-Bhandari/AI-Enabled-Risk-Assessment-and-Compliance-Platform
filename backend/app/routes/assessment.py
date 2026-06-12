import flask

assessment = flask.Blueprint("assessment", __name__)

@assessment.route("/assessment")
def assessment_page():
    return "assessment_page"