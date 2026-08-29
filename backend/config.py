import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'stroke-rehab-secret-key-2024')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///strokerehab.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-stroke-rehab-secret')
    JWT_ACCESS_TOKEN_EXPIRES = 86400
    JWT_TOKEN_LOCATION = ['headers']
