@echo off
REM Activate virtual environment
call .venv\Scripts\activate

REM Set environment variables
set FLASK_APP=HomeCleaningService
set FLASK_ENV=development

REM Run the Flask application
python -m flask run
