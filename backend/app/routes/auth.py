from flask import request
import flask

#Blueprint is a Flask feature used to organize routes.
#Blueprint() is a constructor.  

#__name__  Flask uses this to locate files and templates.s

auth = flask.Blueprint("auth", __name__)

#This is called a decorator. A decorator modifies a function.
@auth.route("/login", methods = ["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    
    return f"email: {email}, password: {password}"

@auth.route("/register", methods = ["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    institution = data.get("institution")

    if not email:
        return {"error":"email is required"}
    if '@' not in email:
        return {"error": "@ is required"}
    
    if not name:
        return {"error" : "name is required"}
    
    if not password or len(password) < 6:
        return {"error" : "enter password greater than 6 digits"}
    

    return {
        "name": name,
        "email": email,
        "password": password,
        "institution": institution
    }