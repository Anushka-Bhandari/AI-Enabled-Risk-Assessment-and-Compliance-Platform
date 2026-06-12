import flask

dashboard = flask.Blueprint("dashboard", __name__)

@dashboard.route("/dashboard")
def dashboard_page():
    return "dashboard display"