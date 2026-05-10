# DevSecOps E-Commerce Project

## Project Overview

This project demonstrates a complete DevSecOps pipeline implementation for a secure e-commerce application using:

- Flask Application
- Docker
- GitHub Actions CI/CD
- Trivy Security Scanning
- Terraform Infrastructure as Code
- Checkov IaC Security Scanning

---

# Week 1 - CI/CD Pipeline Setup

## Implemented Features

- Flask-based e-commerce application
- Docker containerization
- GitHub Actions pipeline
- Automated testing using Pytest

## Technologies Used

- Python
- Flask
- Docker
- GitHub Actions
- Pytest

---

# Week 2 - Container Security Scanning

## Implemented Features

- Docker image vulnerability scanning
- Trivy integration in CI/CD pipeline
- Automated security scanning during builds

## Security Tool

- Trivy

## Security Checks

- OS package vulnerabilities
- Dependency vulnerabilities
- Container image scanning

---

# Week 3 - Infrastructure as Code (IaC) Scanning

## Implemented Features

- Terraform infrastructure configuration
- AWS S3 bucket configuration
- Checkov integration for IaC scanning
- Detection of cloud misconfigurations

## IaC Security Tool

- Checkov

## Misconfigurations Detected

- Public S3 bucket access
- Missing versioning
- Missing encryption
- Missing public access block

---

# Project Structure

```bash
.
├── app.py
├── Dockerfile
├── requirements.txt
├── templates/
├── tests/
├── terraform/
├── .github/
│   └── workflows/
│       └── devsecops.yml
└── README.md
```

---

# Running the Application

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Flask Application

```bash
python app.py
```

---

# Running Tests

```bash
pytest
```

---

# Build Docker Image

```bash
docker build -t ecommerce-app .
```

---

# Run Trivy Scan

```bash
trivy image ecommerce-app
```

---

# Run Checkov Scan

```bash
checkov -d terraform/
```

---

# CI/CD Pipeline Stages

- Install Dependencies
- Run Tests
- Build Docker Image
- Run Trivy Scan
- Run Checkov Scan

---

# Author

Kuldeep Giri
