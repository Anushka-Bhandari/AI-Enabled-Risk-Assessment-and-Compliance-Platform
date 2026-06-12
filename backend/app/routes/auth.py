import flask

#Blueprint is a Flask feature used to organize routes.
#Blueprint() is a constructor.  

#__name__  Flask uses this to locate files and templates.s

auth = flask.Blueprint("auth", __name__)

@auth.route("/login") #This is called a decorator. A decorator modifies a function.
def login():
    return "login successfull"

@auth.route("/register")
def register():
    return "user registered successfully"
