# routes.py

from flask import render_template, redirect, url_for, request, flash, jsonify, current_app as app
from HomeCleaningService.forms import RegistrationForm, LoginForm
from HomeCleaningService.models import User
from flask_login import login_user, current_user, logout_user, login_required
from sqlalchemy.exc import IntegrityError

def register_routes(app, db, bcrypt, s3, upload_file_to_s3):
    @app.route('/')
    def index():
        """Render the home page (login page)."""
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        return render_template('login.html', form=LoginForm())

    @app.route('/register', methods=['GET', 'POST'])
    def register():
        """Handle user registration."""
        if current_user.is_authenticated:
            return redirect(url_for('index'))

        form = RegistrationForm()
        if form.validate_on_submit():
            hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
            user = User(username=form.username.data, email=form.email.data, password=hashed_password)
            try:
                db.session.add(user)
                db.session.commit()
                flash('Your account has been created!', 'success')
                return redirect(url_for('login'))
            except IntegrityError as e:
                db.session.rollback()
                if 'UNIQUE constraint failed' in str(e.orig):
                    flash('Account already exists with this username or email.', 'danger')
                else:
                    flash(f'Error creating account: {e}', 'danger')
                app.logger.error(f'Error creating account: {e}')
        return render_template('register.html', form=form)

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        """Handle user login."""
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))

        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(username=form.username.data).first()
            if user and bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                print(f"User {user.username} logged in successfully.")  # Debug print
                return redirect(url_for('dashboard'))
            else:
                flash('Invalid username or password', 'danger')
                print(f"Failed login attempt for username: {form.username.data}")  # Debug print

        return render_template('login.html', form=form)

    @app.route('/logout')
    def logout():
        """Handle user logout."""
        logout_user()
        return redirect(url_for('index'))

    @app.route('/dashboard')
    @login_required
    def dashboard():
        print(f"Dashboard accessed by: {current_user.username}")
        bookings = [{'date': '2024-08-27', 'plan': '$100'}]
        return render_template('dashboard.html', title='Dashboard', bookings=bookings)

    @app.route('/account')
    @login_required
    def account():
        """Render the user account page."""
        return render_template('account.html', title='Account')

    @app.route('/api/users', methods=['GET'])
    def get_users():
        """Return a list of users in JSON format."""
        users = User.query.all()
        users_data = [{"id": user.id, "username": user.username, "email": user.email} for user in users]
        return jsonify(users_data)

    @app.route('/forgot_password', methods=['GET', 'POST'])
    def forgot_password():
        """Handle forgotten password requests."""
        if request.method == 'POST':
            email = request.form['email']
            flash('If this email is registered, you will receive a password reset link', 'info')
            return redirect(url_for('login'))
        return render_template('forgot_password.html')

    @app.route("/upload", methods=["POST"])
    def upload_file():
        """Handle file upload."""
        if "user_file" not in request.files:
            return "No user_file key in request.files"
        file = request.files["user_file"]
        if file.filename == "":
            return "Please select a file"
        if file:
            file_url = upload_file_to_s3(file, app.config["S3_BUCKET"])
            return redirect(url_for('uploaded_file', file_url=file_url))

    @app.route("/files")
    def list_files():
        """List files in the S3 bucket."""
        objects = s3.list_objects_v2(Bucket=app.config["S3_BUCKET"])
        files = [obj['Key'] for obj in objects.get('Contents', [])]
        return {"files": files}

    @app.route("/upload_profile_picture", methods=["POST"])
    def upload_profile_picture():
        """Handle profile picture upload."""
        if "profile_picture" not in request.files:
            return "No profile_picture key in request.files"
        file = request.files["profile_picture"]
        if file.filename == "":
            return "Please select a file"
        if file:
            file_url = upload_file_to_s3(file, app.config["S3_BUCKET"])
            current_user.profile_picture_url = file_url
            db.session.commit()
            return redirect(url_for('account'))
