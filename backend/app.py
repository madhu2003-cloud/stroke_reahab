import os
import sys
from flask import Flask, send_from_directory, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend')


def create_app():
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    JWTManager(app)

    from routes.auth import auth_bp
    from routes.dashboard import dashboard_bp
    from routes.games import games_bp
    from routes.patients import patients_bp
    from routes.progress import progress_bp
    from routes.profile import profile_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(games_bp, url_prefix='/api/games')
    app.register_blueprint(patients_bp, url_prefix='/api/patients')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')

    with app.app_context():
        db.create_all()

    @app.route('/')
    def index():
        return send_file(os.path.join(FRONTEND_DIR, 'index.html'))

    @app.route('/css/<path:filename>')
    def serve_css(filename):
        return send_from_directory(os.path.join(FRONTEND_DIR, 'css'), filename)

    @app.route('/js/<path:filename>')
    def serve_js(filename):
        return send_from_directory(os.path.join(FRONTEND_DIR, 'js'), filename,
                                   mimetype='application/javascript')

    @app.route('/assets/<path:filename>')
    def serve_assets(filename):
        return send_from_directory(os.path.join(FRONTEND_DIR, 'assets'), filename)

    @app.route('/<path:path>')
    def catch_all(path):
        if path.startswith('api/'):
            return {'error': 'Not found'}, 404
        file_path = os.path.join(FRONTEND_DIR, path)
        if os.path.isfile(file_path):
            return send_file(file_path)
        return send_file(os.path.join(FRONTEND_DIR, 'index.html'))

    return app


if __name__ == '__main__':
    app = create_app()
    print('\n  StrokeRehab Server running at http://localhost:5000\n')
    app.run(debug=True, host='0.0.0.0', port=5000)
