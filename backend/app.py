from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "postgresql://postgres:123:5432/notesdb")
# app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:123@db:5432/notesdb"
# app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:123@localhost:5432/notesdb"

# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# Use environment variables for database connection
# db_user = os.getenv("POSTGRES_USER", "postgres")
# db_password = os.getenv("POSTGRES_PASSWORD", "123")
# db_host = os.getenv("POSTGRES_HOST", "db")  # 'db' is the Docker service name
# db_name = os.getenv("POSTGRES_DB", "notesdb")

# app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{db_user}:{db_password}@{db_host}:5432/{db_name}"
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "postgresql://postgres:123@10.10.10.163:5432/notesdb")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

with app.app_context():
    db.create_all()

@app.route("/notes", methods=["GET"])
def get_notes():
    notes = Note.query.all()
    return jsonify([{"id": n.id, "title": n.title, "content": n.content} for n in notes])

@app.route("/notes", methods=["POST"])
def add_note():
    data = request.json
    new_note = Note(title=data["title"], content=data["content"])
    db.session.add(new_note)
    db.session.commit()
    return jsonify({"message": "Note added"}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
