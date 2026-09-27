from datetime import datetime, timezone, date
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

doctor_patient = db.Table(
    'doctor_patient',
    db.Column('doctor_id', db.Integer, db.ForeignKey('doctors.id'), primary_key=True),
    db.Column('patient_id', db.Integer, db.ForeignKey('patients.id'), primary_key=True)
)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    patient = db.relationship('Patient', back_populates='user', uselist=False, cascade='all,delete-orphan')
    doctor = db.relationship('Doctor', back_populates='user', uselist=False, cascade='all,delete-orphan')
    parent = db.relationship('Parent', back_populates='user', uselist=False, cascade='all,delete-orphan')

    def to_dict(self):
        d = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if self.role == 'patient' and self.patient:
            d['patient_id'] = self.patient.id
            d['age'] = self.patient.age
            d['gender'] = self.patient.gender
            d['emergency_contact'] = self.patient.emergency_contact
        elif self.role == 'doctor' and self.doctor:
            d['doctor_id'] = self.doctor.id
            d['specialization'] = self.doctor.specialization
            d['registration_number'] = self.doctor.registration_number
            d['hospital'] = self.doctor.hospital
        elif self.role == 'parent' and self.parent:
            d['parent_id'] = self.parent.id
            d['linked_patient_id'] = self.parent.patient_id
        return d


class Patient(db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    emergency_contact = db.Column(db.String(100), nullable=True)

    user = db.relationship('User', back_populates='patient')
    parents = db.relationship('Parent', back_populates='patient')
    doctors = db.relationship('Doctor', secondary=doctor_patient, back_populates='patients')
    exercises = db.relationship('ExerciseResult', back_populates='patient', cascade='all,delete-orphan', order_by='ExerciseResult.created_at.desc()')
    streak = db.relationship('Streak', back_populates='patient', uselist=False, cascade='all,delete-orphan')


class Doctor(db.Model):
    __tablename__ = 'doctors'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    specialization = db.Column(db.String(100))
    registration_number = db.Column(db.String(50), unique=True)
    hospital = db.Column(db.String(200))

    user = db.relationship('User', back_populates='doctor')
    patients = db.relationship('Patient', secondary=doctor_patient, back_populates='doctors')


class Parent(db.Model):
    __tablename__ = 'parents'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=True)

    user = db.relationship('User', back_populates='parent')
    patient = db.relationship('Patient', back_populates='parents')


class ExerciseResult(db.Model):
    __tablename__ = 'exercise_results'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    game_type = db.Column(db.String(30), nullable=False)
    score = db.Column(db.Integer, default=0)
    accuracy = db.Column(db.Float, default=0)
    repetitions = db.Column(db.Integer, default=0)
    reaction_time = db.Column(db.Float, nullable=True)
    duration = db.Column(db.Integer, default=0)
    smoothness = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    patient = db.relationship('Patient', back_populates='exercises')

    def to_dict(self):
        game_names = {
            'target_touch': 'Target Touch',
            'object_catch': 'Object Catch',
            'path_following': 'Path Following',
        }
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'game_type': self.game_type,
            'game_name': game_names.get(self.game_type, self.game_type),
            'score': self.score,
            'accuracy': round(self.accuracy, 1) if self.accuracy else 0,
            'repetitions': self.repetitions,
            'reaction_time': round(self.reaction_time, 1) if self.reaction_time else None,
            'duration': self.duration,
            'smoothness': round(self.smoothness, 2) if self.smoothness else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'date': self.created_at.strftime('%Y-%m-%d') if self.created_at else None,
        }


class Streak(db.Model):
    __tablename__ = 'streaks'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), unique=True, nullable=False)
    current_streak = db.Column(db.Integer, default=0)
    longest_streak = db.Column(db.Integer, default=0)
    last_activity_date = db.Column(db.Date, nullable=True)

    patient = db.relationship('Patient', back_populates='streak')

    def to_dict(self):
        return {
            'current_streak': self.current_streak,
            'longest_streak': self.longest_streak,
            'last_activity': self.last_activity_date.isoformat() if self.last_activity_date else None,
        }


class Feedback(db.Model):
    __tablename__ = 'feedbacks'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False, default='Anonymous Reviewer')
    q1_rating = db.Column(db.String(100), nullable=False, default='5 Stars - Excellent')
    q2_tracking = db.Column(db.String(100), nullable=False, default='Very smooth & responsive')
    q3_module = db.Column(db.String(100), nullable=False, default='Virtual Piano Tapping')
    q4_ai_coach = db.Column(db.String(100), nullable=False, default='Very helpful with clear medical tips')
    q5_usability = db.Column(db.String(100), nullable=False, default='Super easy & intuitive')
    q6_recommend = db.Column(db.String(100), nullable=False, default='Definitely Yes (Highly Recommended)')
    comments = db.Column(db.Text, nullable=True, default='')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name or 'Anonymous Reviewer',
            'q1_rating': self.q1_rating or '5 Stars - Excellent',
            'q2_tracking': self.q2_tracking or 'Very smooth & responsive',
            'q3_module': self.q3_module or 'Rehab Games',
            'q4_ai_coach': self.q4_ai_coach or 'Very helpful',
            'q5_usability': self.q5_usability or 'Super easy & intuitive',
            'q6_recommend': self.q6_recommend or 'Definitely Yes',
            'comments': self.comments or '',
            'created_at': self.created_at.strftime('%b %d, %Y %I:%M %p') if self.created_at else 'Recent'
        }
