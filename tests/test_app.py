<<<<<<< HEAD
import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_page(client):
    """Test the home page loads"""
    rv = client.get('/')
    assert rv.status_code == 200

def test_products_page(client):
    """Test the products page loads"""
    rv = client.get('/products')
    assert rv.status_code == 200

def test_cart_page(client):
    """Test the cart page loads"""
    rv = client.get('/cart')
    assert rv.status_code == 200

def test_health_endpoint(client):
    """Test health check endpoint"""
    rv = client.get('/health')
    assert rv.status_code == 200
    assert rv.json['status'] == 'healthy'

def test_api_products(client):
    """Test products API endpoint"""
    rv = client.get('/api/products')
    assert rv.status_code == 200
    assert isinstance(rv.json, list)

def test_add_to_cart(client):
    """Test adding item to cart"""
    rv = client.get('/add-to-cart/1')
    assert rv.status_code == 200
    assert rv.json['success'] == True
=======
import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + '/..'))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'test-key'
    with app.test_client() as client:
        with app.app_context():
            yield client

def test_home_page(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'TechStore' in response.data

def test_products_page(client):
    response = client.get('/products')
    assert response.status_code == 200
    assert b'Products' in response.data

def test_cart_page(client):
    response = client.get('/cart')
    assert response.status_code == 200

def test_health_endpoint(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_add_to_cart(client):
    response = client.post('/api/add-to-cart', 
                          json={'product_id': '1', 'quantity': 1})
    assert response.status_code == 200
    assert response.json['success'] == True

def test_checkout_empty_cart(client):
    with client.session_transaction() as sess:
        sess['cart'] = {}
    response = client.post('/api/checkout')
    assert response.status_code == 400
>>>>>>> e7ad686 (Updated DevSecOps pipeline, Terraform IaC security fixes, Checkov improvements)
