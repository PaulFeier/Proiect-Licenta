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
    user_quizzes = relationship('UserQuiz', backref='user', lazy=True)


class Quiz(db.Model):
    quiz_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(25), unique=True, nullable=False)
    description = db.Column(db.String(50), unique=True, nullable=False)
    questions = relationship('Question', backref='quiz', lazy=True)
    user_quizzes = relationship('UserQuiz', backref='quiz', lazy=True)


class Question(db.Model):
    question_id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), nullable=False)
    question_text = db.Column(db.String(100), unique=True, nullable=False)
    correct_answer = db.Column(db.String(50), nullable=False)


class UserQuiz(db.Model):
    user_quiz_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.quiz_id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    attempt_date = db.Column(db.DateTime, nullable=False)


class Leaderboard(db.Model):
    leaderboard_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_score = db.Column(db.Integer, nullable=False)
    rank = db.Column(db.Integer, nullable=False)
    last_update = db.Column(db.DateTime, nullable=False)


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

        new_user = User(email=email, username=name, password=hashed_password, admin=False)

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


@app.route('/home/')
def home():
    return render_template('guest.html')


@app.route('/guest/')
def guest():
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

