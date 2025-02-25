from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  
from sqlalchemy.exc import OperationalError
from sqlalchemy import create_engine
import psycopg2
import os

app = Flask(__name__)
CORS(app)  

# Database configuration
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "saikasyapa")
DB_HOST = os.getenv("POSTGRES_HOST", "database-2.climgmeu4ove.ap-south-1.rds.amazonaws.com")
DB_PORT = "5432"
DB_NAME = os.getenv("POSTGRES_DB", "notesdb")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

def create_db_if_not_exists():
    """Check if the database exists, and create it if it does not."""
    try:
        # Try connecting to the target database
        engine = create_engine(DATABASE_URL)
        with engine.connect():
            print(f"Database '{DB_NAME}' already exists.")
    except OperationalError:
        print(f"Database '{DB_NAME}' does not exist. Creating...")

        # Connect to default 'postgres' database to create 'notesdb'
        default_conn = psycopg2.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname="postgres"  # Connect to default DB first
        )
        default_conn.autocommit = True
        cursor = default_conn.cursor()
        
        # Create database if it doesn't exist
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}';")
        exists = cursor.fetchone()
        if not exists:
            cursor.execute(f"CREATE DATABASE {DB_NAME};")
            print(f"Database '{DB_NAME}' created successfully.")
        
        cursor.close()
        default_conn.close()

# Ensure the database exists before running the app
create_db_if_not_exists()

with app.app_context():
    db.create_all()
    print("Tables created successfully.")

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
