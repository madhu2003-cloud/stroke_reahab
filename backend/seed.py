"""Seed the database with demo accounts and realistic exercise data."""
import sys
import os
import random
from datetime import date, datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User, Patient, Doctor, Parent, ExerciseResult, Streak, doctor_patient
import bcrypt


def hash_pw(pw):
    return bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def seed():
    app = create_app()
    with app.app_context():
        if User.query.filter_by(email='patient@demo.com').first():
            print('Demo data already exists. Skipping seed.')
            return

        # Create demo patient
        patient_user = User(
            name='Alex Demo', email='patient@demo.com',
            password_hash=hash_pw('demo123'), role='patient', phone='1234567890'
        )
        db.session.add(patient_user)
        db.session.flush()

        patient = Patient(user_id=patient_user.id, age=55, gender='male', emergency_contact='Jane Demo')
        db.session.add(patient)
        db.session.flush()

        # Create demo doctor
        doctor_user = User(
            name='Dr. Sarah Wilson', email='doctor@demo.com',
            password_hash=hash_pw('demo123'), role='doctor', phone='9876543210'
        )
        db.session.add(doctor_user)
        db.session.flush()

        doctor = Doctor(
            user_id=doctor_user.id, specialization='Neurology',
            registration_number='MED00001', hospital='City Medical Center'
        )
        db.session.add(doctor)
        db.session.flush()

        # Create demo parent
        parent_user = User(
            name='Maria Demo', email='parent@demo.com',
            password_hash=hash_pw('demo123'), role='parent', phone='5551234567'
        )
        db.session.add(parent_user)
        db.session.flush()

        parent = Parent(user_id=parent_user.id, patient_id=patient.id)
        db.session.add(parent)

        # Assign patient to doctor
        doctor.patients.append(patient)

        # Generate 30 days of exercise data with gradual improvement
        game_types = ['target_touch', 'object_catch', 'path_following']
        today = date.today()
        streak_count = 0
        max_streak = 0
        last_active = None

        for day_offset in range(29, -1, -1):
            d = today - timedelta(days=day_offset)
            skip_probability = 0.15
            if random.random() < skip_probability:
                if streak_count > max_streak:
                    max_streak = streak_count
                streak_count = 0
                continue

            if last_active and (d - last_active).days == 1:
                streak_count += 1
            elif last_active is None or (d - last_active).days > 1:
                streak_count = 1
            last_active = d

            improvement_factor = 1 + (29 - day_offset) * 0.015
            num_exercises = random.randint(1, 4)
            chosen_games = random.sample(game_types, min(num_exercises, 3))
            for i, gt in enumerate(chosen_games):
                base_score = random.randint(50, 75)
                score = min(100, int(base_score * improvement_factor))
                base_accuracy = random.uniform(55, 80)
                accuracy = min(99, base_accuracy * improvement_factor)
                reaction_time = max(400, random.uniform(800, 1800) / improvement_factor)
                duration = random.randint(45, 180)
                reps = random.randint(8, 25)
                smoothness = min(1.0, random.uniform(0.5, 0.8) * improvement_factor)

                hour = random.randint(8, 20)
                minute = random.randint(0, 59)
                created = datetime(d.year, d.month, d.day, hour, minute, 0, tzinfo=timezone.utc)

                result = ExerciseResult(
                    patient_id=patient.id, game_type=gt, score=score,
                    accuracy=round(accuracy, 1), repetitions=reps,
                    reaction_time=round(reaction_time, 1), duration=duration,
                    smoothness=round(smoothness, 2), created_at=created
                )
                db.session.add(result)

        if streak_count > max_streak:
            max_streak = streak_count

        streak = Streak(
            patient_id=patient.id,
            current_streak=streak_count,
            longest_streak=max_streak,
            last_activity_date=last_active
        )
        db.session.add(streak)
        db.session.commit()

        print('Demo data seeded successfully!')
        print(f'  Patient: patient@demo.com / demo123')
        print(f'  Doctor:  doctor@demo.com  / demo123')
        print(f'  Parent:  parent@demo.com  / demo123')
        print(f'  Streak:  current={streak_count}, longest={max_streak}')


if __name__ == '__main__':
    seed()
