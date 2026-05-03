# 🛒 Secure E-Commerce DevSecOps Pipeline

## 📌 Project Overview

This project demonstrates a **secure E-Commerce web application** integrated with **DevSecOps practices**.
It focuses on automating development, security testing, and deployment using modern tools.

---

## 🚀 Features

* Product browsing and cart functionality
* Secure Flask-based backend
* Docker containerization
* CI/CD pipeline using GitHub Actions
* Integrated security scanning at every stage

---

## 🛠️ Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python (Flask)
* **Containerization:** Docker
* **CI/CD:** GitHub Actions
* **Infrastructure as Code:** Terraform

---

## 🔐 Security Tools Integrated

* **Bandit** → Static Code Analysis (SAST)
* **Safety** → Dependency Check (SCA)
* **Trivy** → Container Vulnerability Scan
* **OWASP ZAP** → Dynamic Application Security Testing (DAST)
* **Checkov** → Terraform (IaC) Security Scan

---

## 🐳 Docker Setup

### Build Image

```bash
docker build -t ecommerce .
```

### Run Container

```bash
docker run -d -p 5000:5000 ecommerce
```

👉 Open in browser:

```
http://localhost:5000
```

---

## 🔍 Security Scanning Commands

### OWASP ZAP Scan

```bash
docker run -t -v %cd%:/zap/wrk:rw zaproxy/zap-stable zap-baseline.py -t http://host.docker.internal:5000 -r zap_report.html
```

### Trivy Scan

```bash
docker run --rm aquasec/trivy:latest image ecommerce
```

### Checkov Scan

```bash
checkov -d terraform/
```

---

## 📂 Project Structure

```
ecommerce-dev/
│
├── templates/
├── static/
├── terraform/
├── tests/
├── .github/workflows/
├── Dockerfile
├── docker-compose.yml
├── app.py
└── requirements.txt
```

---

## 📊 DevSecOps Pipeline Flow

```
Code → Build → Test → Security Scan → Deploy
```

---

## 📈 Output

* Automated CI/CD pipeline
* Security vulnerabilities detection
* Containerized deployment
* Infrastructure automation

---

## 🎯 Conclusion

This project demonstrates how **security can be integrated into the DevOps pipeline** to build secure, scalable, and reliable applications.

---

## 👨‍💻 Author

**Rinku Shamrao Dhole**
MCA Student

---

## ⭐ Acknowledgement

This project was developed as part of internship training under **Codec Technologies**.

---
