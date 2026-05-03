from app import app

def test_home_security():
    client = app.test_client()
    response = client.get('/')
    assert response.status_code == 200

def test_products_security():
    client = app.test_client()
    response = client.get('/products')
    assert response.status_code == 200
