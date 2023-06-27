import time
from flask import Flask, jsonify, make_response, request, render_template, redirect, flash, url_for
from flask_restful import Resource, Api, marshal_with, fields
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from functools import wraps
import uuid
import jwt
import sqlite3
import datetime
import os


PROJECT_ROOT = os.path.dirname(os.path.realpath(__file__))

DATABASE = os.path.join(PROJECT_ROOT, 'database.db')

app = Flask(__name__, template_folder='templates/')

app.config['SECRET_KEY'] = '8b9NxaDQd7iqvE8$'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)

api = Api(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    admin = db.Column(db.Boolean, default=False)
    registration_date = db.Column(db.DateTime, nullable=False)
    points = db.Column(db.Integer, default=0)
    user_quizzes = relationship('UserQuiz', backref='user', lazy=True)


class Quiz(db.Model):
    quiz_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(25), unique=True, nullable=False)
    description = db.Column(db.String(50), unique=True, nullable=False)
    user_quizzes = relationship('UserQuiz', backref='quiz', lazy=True)


class UserQuiz(db.Model):
    user_quiz_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    attempt_date = db.Column(db.DateTime, nullable=False)
    time_taken = db.Column(db.Float, nullable=False)
    accuracy = db.Column(db.Float, nullable=False)


class Leaderboard(db.Model):
    leaderboard_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_score = db.Column(db.Integer, nullable=False)
    rank = db.Column(db.Integer, nullable=False)
    last_update = db.Column(db.DateTime, nullable=False)


@app.route('/update-score/<int:user_id>/<int:score>', methods=['POST'])
def update_score(user_id, score):
    user = User.query.get(user_id)
    if user:
        if game_completed(user_id):
            user.points += score
            db.session.commit()
            return jsonify({'message': 'Score updated successfully'})
        else:
            return jsonify({'message': 'Game not completed yet'})
    else:
        return jsonify({'message': 'User not found'}), 404


# Function to check if the game is completed
def game_completed(user_id):
    user = User.query.get(user_id)
    if user:
        if user.points >= 1:
            return True
        else:
            return False
    else:
        return False


# Function to calculate the additional points based on the time taken
def calculate_additional_points(time_taken):
    max_time = 5 * 60  # 5 minutes in seconds
    max_additional_points = 200
    time_remaining = max_time - time_taken
    if time_remaining > 0:
        additional_points = (time_remaining / max_time) * max_additional_points
    else:
        additional_points = 0
    return additional_points


# Function to process the quiz submission
def process_quiz_submission(quiz):

    score = 250
    accuracy = 1.0
    timer = 240.0

    user_quiz = UserQuiz.query.filter_by(user=current_user, quiz=quiz).first()
    if user_quiz:
        if score > user_quiz.score or (score == user_quiz.score and timer < user_quiz.timer):
            user_quiz.score = score
            user_quiz.accuracy = accuracy
            user_quiz.timer = timer
            user_quiz.attempt_date = datetime.datetime.now()
            db.session.commit()
    else:
        user_quiz = UserQuiz(
            user=current_user,
            quiz=quiz,
            score=score,
            accuracy=accuracy,
            timer=timer,
            attempt_date=datetime.datetime.now()
        )
        db.session.add(user_quiz)
        db.session.commit()

    return score, accuracy, timer


# Flask route to complete the quiz
@app.route('/complete-quiz/', methods=['POST'])
@login_required
def complete_quiz():
    data = request.get_json()
    quiz_id = data.get('quiz_id')
    time_taken = data.get('time_taken')
    accuracy = data.get('accuracy')

    user_quiz = UserQuiz.query.filter_by(user_id=current_user.id, quiz_id=quiz_id).first()

    if user_quiz is None:
        # First attempt at the quiz, store the results
        score = calculate_score(time_taken, accuracy)
        additional_points = calculate_additional_points(time_taken)
        total_score = score + additional_points
        new_user_quiz = UserQuiz(
            user_id=current_user.id,
            quiz_id=quiz_id,
            score=total_score,
            attempt_date=datetime.datetime.utcnow(),
            time_taken=time_taken,
            accuracy=accuracy
        )
        db.session.add(new_user_quiz)
        db.session.commit()
        flash('Quiz completed successfully!', 'success')
    else:
        # User has attempted the quiz before, compare with personal best
        if time_taken < user_quiz.time_taken and accuracy > user_quiz.accuracy:
            # Better time and better accuracy, update the personal best
            user_quiz.time_taken = time_taken
            user_quiz.accuracy = accuracy
            user_quiz.score = calculate_score(time_taken, accuracy)
            db.session.commit()
            flash('Congratulations! You have set a new personal best!', 'success')
        else:
            flash('Quiz completed successfully!', 'success')

    return jsonify({'message': 'Quiz completed successfully'})


def calculate_score(time_taken, accuracy):
    max_time = 300
    max_accuracy = 100
    time_weight = 0.8
    accuracy_weight = 0.2

    normalized_time = min(time_taken / max_time, 1)
    normalized_accuracy = accuracy / max_accuracy

    score = (time_weight * (1 - normalized_time)) + (accuracy_weight * normalized_accuracy)

    scaled_score = score * 500

    rounded_score = int(round(scaled_score))

    return rounded_score



@app.route('/leaderboard')
def leaderboard():
    score = int(request.args.get('score', 0))
    return render_template('leaderboard.html', score=score)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def generate_token(user):
    payload = {
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token


def verify_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.query.get(user_id)
        return user
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


@app.route('/register/', methods=['GET', 'POST'])
def register():
    content_type = request.headers.get('Content-Type', '')
    if request.method == 'POST':
        if content_type.startswith('application/json'):
            data = request.get_json()

            email = data.get('email')
            name = data.get('username')
            password = data.get('password')
        else:
            email = request.form.get('email')
            name = request.form.get('username')
            password = request.form.get('password')

        existing_email_user = User.query.filter_by(email=email).first()
        if existing_email_user:
            return make_response(jsonify('Emailul exista deja!', 409))

        existing_username_user = User.query.filter_by(username=name).first()
        if existing_username_user:
            return make_response(jsonify('Numele exista deja!', 409))

        hashed_password = generate_password_hash(password, method='sha256')

        new_user = User(
            email=email,
            username=name,
            password=hashed_password,
            admin=False,
            registration_date=datetime.datetime.now()
        )

        db.session.add(new_user)
        db.session.commit()

        return redirect('/')

    return render_template('register.html')


@app.route('/login/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            flash('Invalid email or password', 'error')
            return redirect(url_for('login'))  # Redirect to login page again

        login_user(user)
        token = generate_token(user)
        response = make_response(redirect(url_for('index')))  # Redirect to homepage
        response.set_cookie('access_token', token, httponly=True)
        return response

    return render_template('login.html')


@app.route('/logout/')
@login_required
def logout():
    logout_user()
    response = make_response(redirect('/'))
    response.delete_cookie('access_token')
    return response


@app.route('/')
def index():
    return render_template('guest.html')


# @app.route('/api/search', methods=['GET'])
# def search():
#     query = request.args.get('query')
#     results = search_products(query)
#     return jsonify(results)
#
#
# def search_products(query):
#     results = Products.query.filter(Products.name.ilike(f'%{query}%')).all()
#     return [{'id': product.id, 'name': product.name} for product in results]


@app.route('/profile/')
def profile():
    return render_template('profile.html')


@app.route('/usa/')
def usa():
    return render_template('usa-states.html')


@app.route('/na/')
def north_america():
    return render_template('north_america.html')


@app.route('/europe/')
def europe():
    return render_template("europe-countries.html")


@app.route('/romania/')
def romania():
    return render_template("romania-counties.html")


@app.route('/africa/')
def africa():
    return render_template("africa-countries.html")


@app.route('/slithering/')
def slithering():
    return render_template("slithering.html")


@app.route('/random-quiz/')
def randomQuiz():
    return render_template("africa-countries.html")


if __name__ == '__main__':
    with app.app_context():
        # db.drop_all()
        db.create_all()
    app.run(host="localhost", port=5000, debug=True)

