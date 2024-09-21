# __init__.py

from flask import Flask
from flask_migrate import Migrate
import os
import boto3
from HomeCleaningService.routes import register_routes
from HomeCleaningService.extensions import db, bcrypt, login_manager

def create_app():
    app = Flask(__name__)
    app.config.from_object('HomeCleaningService.config.Config')

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    # Initialize Flask-Migrate
    migrate = Migrate(app, db)

    global s3
    s3 = boto3.client(
        "s3",
        aws_access_key_id=app.config['S3_KEY'],
        aws_secret_access_key=app.config['S3_SECRET'],
        region_name=os.getenv("AWS_REGION", "us-east-1")
    )

    with app.app_context():
        from HomeCleaningService.models import User

        @login_manager.user_loader
        def load_user(user_id):
            return User.query.get(int(user_id))

        register_routes(app, db, bcrypt, s3, upload_file_to_s3)

    return app

def upload_file_to_s3(file, bucket_name, acl="public-read"):
    """Upload a file to S3 and return the URL."""
    try:
        s3.upload_fileobj(
            file,
            bucket_name,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
        return f"https://{bucket_name}.s3.amazonaws.com/{file.filename}"
    except Exception as e:
        print(f"Error uploading file to S3: {e}")
        return str(e)
