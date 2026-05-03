<<<<<<< HEAD
FROM python:3.12-alpine

# Create working directory
WORKDIR /app

# Install system dependencies (Alpine)
RUN apk add --no-cache gcc musl-dev build-base

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create non-root user
RUN adduser -D appuser && chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Expose port
EXPOSE 5000

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
FROM python:3.11-slim AS builder
=======
FROM python:3.11-slim
>>>>>>> 72992bc (Fixed checkout API, resolved tests, completed Week 2)

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app

# Switch user
USER appuser

# Environment variables
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 5000

# Run app
CMD ["python", "app.py"]
