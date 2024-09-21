# config.py
import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'secretkey321')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'mysql+pymysql://admin:passtheword123@mydatabase.chfnruiozb1h.us-east-1.rds.amazonaws.com:3306/mydatabase')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    S3_BUCKET = os.getenv('S3_BUCKET', 'your_bucket_name')
    S3_KEY = os.getenv('S3_KEY', 'your_aws_access_key')
    S3_SECRET = os.getenv('S3_SECRET', 'your_aws_secret_key')
    S3_LOCATION = f"http://{S3_BUCKET}.s3.amazonaws.com/"
