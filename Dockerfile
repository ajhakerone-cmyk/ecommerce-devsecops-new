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
=======
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt


# -------- Final Stage --------
FROM python:3.11-slim

# Create non-root user
RUN useradd -m appuser

WORKDIR /app

# Copy dependencies
COPY --from=builder /root/.local /home/appuser/.local

# Copy app
COPY --chown=appuser:appuser . .
RUN mkdir -p /app/flask_session && chown -R appuser:appuser /app

# Environment variables
ENV PATH=/home/appuser/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py \
    FLASK_ENV=production

# Switch user
USER appuser

EXPOSE 5000

# Health check (no external lib needed)
HEALTHCHECK CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1

# Run app
CMD ["python", "app.py"]
>>>>>>> e7ad686 (Updated DevSecOps pipeline, Terraform IaC security fixes, Checkov improvements)
