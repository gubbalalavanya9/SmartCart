const products = [
    { id: 1, name: "Smart Watch Pro", price: 2499, category: "Electronics", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { id: 2, name: "Noise Cancel Buds", price: 1899, category: "Audio", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 3, name: "Cotton Baby Onesie", price: 599, category: "Baby Wear", img: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500" },
    { id: 4, name: "Luxury Journal", price: 799, category: "Stationary", img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500" }
];

let cart = [];
let orders = [];
let buyNowItem = null;

function renderGrid(data) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = data.map(p => `
        <div class="card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>₹${p.price}</p>
            <div class="button-group">
                <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
                <button class="buy-btn" onclick="openBuyModal(${p.id})">Buy Now</button>
            </div>
            <div id="msg-${p.id}" class="added-message">✓ Added to cart!</div>
        </div>
    `).join('');
}

// CONFIRMATION BELOW OBJECT
function addToCart(id) {
    const p = products.find(x => x.id === id);
    cart.push(p);
    updateCartUI();
    
    const msg = document.getElementById(`msg-${id}`);
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 2000);
}

// UPDATED CART UI WITH IMAGE
function updateCartUI() {
    const list = document.getElementById('cart-list');
    let total = 0;
    list.innerHTML = cart.map((item, idx) => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.img}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price}</p>
                </div>
                <button onclick="removeFromCart(${idx})" style="border:none; cursor:pointer;">🗑️</button>
            </div>
        `;
    }).join('');
    document.getElementById('cart-total').innerText = "₹" + total;
    document.getElementById('cart-count').innerText = cart.length;
}

function removeFromCart(idx) { cart.splice(idx, 1); updateCartUI(); }

// BUY NOW MODAL LOGIC
function openBuyModal(id) {
    buyNowItem = products.find(p => p.id === id);
    document.getElementById('buy-img').src = buyNowItem.img;
    document.getElementById('buy-title').innerText = buyNowItem.name;
    document.getElementById('buy-price-unit').innerText = "Unit Price: ₹" + buyNowItem.price;
    updateBuyTotal();
    document.getElementById('buy-modal').classList.add('active');
}

function updateBuyTotal() {
    const q = document.getElementById('buy-qty').value;
    document.getElementById('buy-total').innerText = "₹" + (buyNowItem.price * q);
}

function closeBuyModal() { document.getElementById('buy-modal').classList.remove('active'); }

function confirmPurchase() {
    const q = document.getElementById('buy-qty').value;
    const order = { id: "#ORD"+Math.floor(Math.random()*1000), total: (buyNowItem.price * q), date: new Date().toLocaleDateString() };
    orders.unshift(order);
    updateOrdersUI();
    confetti();
    alert("Purchase Success!");
    closeBuyModal();
}

// SEARCH & DRAWER LOGIC
function handleSearch() {
    const q = document.getElementById('p-search').value.toLowerCase();
    renderGrid(products.filter(p => p.name.toLowerCase().includes(q)));
}

function toggleCart() { document.getElementById('cart-drawer').classList.toggle('open'); toggleOverlay(); }
function toggleOrders() { document.getElementById('orders-drawer').classList.toggle('open'); toggleOverlay(); }
function toggleOverlay() { document.getElementById('overlay').classList.toggle('active'); }
function closeAll() { 
    document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
    document.getElementById('overlay').classList.remove('active'); 
}

function handleCheckout() {
    if(cart.length === 0) return;
    const order = { id: "#ORD"+Math.floor(Math.random()*1000), total: cart.reduce((s,i)=>s+i.price,0), date: new Date().toLocaleDateString() };
    orders.unshift(order);
    cart = []; updateCartUI(); updateOrdersUI();
    confetti(); alert("Order Success!"); closeAll();
}

function updateOrdersUI() {
    const list = document.getElementById('orders-list');
    list.innerHTML = orders.map(o => `<div style="padding:15px; background:#f9f9f9; border-radius:10px; margin-bottom:10px;">
        <strong>Order ID: ${o.id}</strong><br><small>${o.date}</small><br>Total: ₹${o.total}</div>`).join('');
}

function filterByCategory(cat, btn) {
    document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid(cat === 'All' ? products : products.filter(p => p.category === cat));
}

renderGrid(products);