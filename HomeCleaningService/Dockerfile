# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables for Flask
ENV FLASK_APP=HomeCleaningService
ENV FLASK_RUN_HOST=0.0.0.0  # Allow access from outside the container
ENV FLASK_ENV=development    # Optional: Enables debug mode

# Expose port 5000 for the Flask app
EXPOSE 5000

# Command to run the Flask app directly
CMD ["flask", "run"]
