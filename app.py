from flask import Flask, render_template, request, jsonify, session, redirect, url_for, make_response
from flask_session import Session
import os
import json
import secrets
import uuid
from datetime import datetime
from functools import wraps

app = Flask(__name__)

# Security configurations
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

Session(app)

# Product Database
PRODUCTS = {
    '1': {
        'id': '1',
        'name': 'MacBook Pro 16" M3 Max',
        'price': 3499.99,
        'category': 'Laptops',
        'image': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        'description': 'Apple M3 Max chip, 48GB RAM, 1TB SSD, 16-core GPU',
        'stock': 10
    },
    '2': {
        'id': '2',
        'name': 'Samsung Galaxy S24 Ultra',
        'price': 1299.99,
        'category': 'Smartphones',
        'image': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
        'description': '6.8" Dynamic AMOLED 2X, 200MP Camera, 5000mAh',
        'stock': 15
    },
    '3': {
        'id': '3',
        'name': 'Sony WH-1000XM5',
        'price': 399.99,
        'category': 'Audio',
        'image': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
        'description': 'Industry-leading noise cancellation, 30hr battery',
        'stock': 20
    },
    '4': {
        'id': '4',
        'name': 'iPad Pro 12.9" M2',
        'price': 1199.99,
        'category': 'Tablets',
        'image': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        'description': 'M2 chip, 256GB, Liquid Retina XDR display',
        'stock': 8
    },
    '5': {
        'id': '5',
        'name': 'Apple Watch Ultra 2',
        'price': 799.99,
        'category': 'Wearables',
        'image': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
        'description': '49mm Titanium, GPS+Cellular, 100m water resistant',
        'stock': 12
    },
    '6': {
        'id': '6',
        'name': 'Logitech MX Master 3S',
        'price': 99.99,
        'category': 'Accessories',
        'image': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400',
        'description': '8K DPI, Silent clicks, MagSpeed wheel',
        'stock': 25
    }
}

# Store orders
ORDERS = {}

# ==================== PAGE ROUTES ====================

@app.route('/')
def home():
    featured_products = list(PRODUCTS.values())[:4]
    return render_template('index.html', products=featured_products)

@app.route('/products')
def products():
    category = request.args.get('category', 'all')
    if category == 'all':
        product_list = list(PRODUCTS.values())
    else:
        product_list = [p for p in PRODUCTS.values() if p['category'].lower() == category.lower()]
    return render_template('products.html', products=product_list, active_category=category)

@app.route('/cart')
def cart():
    cart_items = session.get('cart', {})
    cart_details = []
    subtotal = 0
    
    for product_id, quantity in cart_items.items():
        if product_id in PRODUCTS:
            product = PRODUCTS[product_id]
            item_total = product['price'] * quantity
            cart_details.append({
                'product': product,
                'quantity': quantity,
                'subtotal': round(item_total, 2)
            })
            subtotal += item_total
    
    shipping = 0 if subtotal > 100 else 9.99
    tax = subtotal * 0.1
    total = subtotal + shipping + tax
    
    return render_template('cart.html', 
                         cart_items=cart_details,
                         subtotal=round(subtotal, 2),
                         shipping=round(shipping, 2),
                         tax=round(tax, 2),
                         total=round(total, 2))

@app.route('/checkout')
def checkout():
    if not session.get('cart'):
        return redirect(url_for('cart'))
    return render_template('checkout.html')

@app.route('/order-confirmation/<order_id>')
def order_confirmation(order_id):
    order = ORDERS.get(order_id)
    if not order:
        return redirect(url_for('home'))
    return render_template('order_confirmation.html', order=order)

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200

# ==================== API ROUTES ====================

@app.route('/api/add-to-cart', methods=['POST'])
def add_to_cart():
    try:
        data = request.get_json()
        product_id = str(data.get('product_id'))
        quantity = int(data.get('quantity', 1))
        
        if product_id not in PRODUCTS:
            return jsonify({'error': 'Product not found'}), 404
        
        cart = session.get('cart', {})
        cart[product_id] = cart.get(product_id, 0) + quantity
        session['cart'] = cart
        session.modified = True
        
        return jsonify({
            'success': True,
            'message': 'Product added to cart',
            'cart_count': sum(cart.values())
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/update-cart', methods=['POST'])
def update_cart():
    try:
        data = request.get_json()
        product_id = str(data.get('product_id'))
        quantity = int(data.get('quantity', 0))
        
        cart = session.get('cart', {})
        if quantity <= 0:
            cart.pop(product_id, None)
        else:
            cart[product_id] = quantity
        
        session['cart'] = cart
        session.modified = True
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/remove-from-cart', methods=['POST'])
def remove_from_cart():
    try:
        data = request.get_json()
        product_id = str(data.get('product_id'))
        cart = session.get('cart', {})
        cart.pop(product_id, None)
        session['cart'] = cart
        session.modified = True
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cart-summary')
def cart_summary():
    cart = session.get('cart', {})
    items = []
    subtotal = 0
    
    for pid, qty in cart.items():
        if pid in PRODUCTS:
            p = PRODUCTS[pid]
            item_subtotal = p['price'] * qty
            items.append({
                'id': pid,
                'name': p['name'],
                'quantity': qty,
                'price': p['price'],
                'subtotal': round(item_subtotal, 2)
            })
            subtotal += item_subtotal
    
    shipping = 0 if subtotal > 100 else 9.99
    tax = subtotal * 0.1
    total = subtotal + shipping + tax
    
    return jsonify({
        'items': items,
        'subtotal': round(subtotal, 2),
        'shipping': round(shipping, 2),
        'tax': round(tax, 2),
        'total': round(total, 2)
    })

@app.route('/api/products')
def api_products():
    limit = request.args.get('limit', 4, type=int)
    products_list = list(PRODUCTS.values())[:limit]
    return jsonify([{
        'id': p['id'],
        'name': p['name'],
        'price': p['price'],
        'image': p['image'],
        'category': p['category']
    } for p in products_list])

@app.route('/api/place-order', methods=['POST'])
def place_order():
    try:
        data = request.get_json()
        print("Received order data:", data)  # Debug log
        
        # Get cart from session
        cart = session.get('cart', {})
        print("Cart contents:", cart)  # Debug log
        
        if not cart:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country', 'payment_method']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400
        
        # Calculate totals
        subtotal = 0
        order_items = []
        
        for product_id, quantity in cart.items():
            if product_id in PRODUCTS:
                product = PRODUCTS[product_id]
                item_subtotal = product['price'] * quantity
                subtotal += item_subtotal
                order_items.append({
                    'product_id': product_id,
                    'name': product['name'],
                    'price': product['price'],
                    'quantity': quantity,
                    'subtotal': round(item_subtotal, 2)
                })
        
        shipping = 0 if subtotal > 100 else 9.99
        tax = subtotal * 0.1
        total = subtotal + shipping + tax
        
        # Generate order ID
        order_id = str(uuid.uuid4())[:8].upper()
        
        # Create order object
        order = {
            'order_id': order_id,
            'customer': {
                'name': data['name'],
                'email': data['email'],
                'phone': data['phone'],
                'address': data['address'],
                'city': data['city'],
                'state': data['state'],
                'zip': data['zip'],
                'country': data['country']
            },
            'items': order_items,
            'subtotal': round(subtotal, 2),
            'shipping': round(shipping, 2),
            'tax': round(tax, 2),
            'total': round(total, 2),
            'payment_method': data['payment_method'],
            'order_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'status': 'Pending' if data['payment_method'] == 'cod' else 'Confirmed'
        }
        
        # Store order
        ORDERS[order_id] = order
        print(f"Order created: {order_id}")  # Debug log
        
        # Clear cart
        session['cart'] = {}
        session.modified = True
        
        return jsonify({
            'success': True,
            'order_id': order_id,
            'total': round(total, 2),
            'message': 'Order placed successfully!'
        })
        
    except Exception as e:
        print(f"Error placing order: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)