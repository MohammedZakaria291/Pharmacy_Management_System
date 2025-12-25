let cart = [];
const TAX_RATE = 0.08;

document.getElementById('medicineName').addEventListener('change', function() {
    const selected = this.options[this.selectedIndex];
    const price = selected.getAttribute('data-price') || '0.00';
    document.getElementById('unitPrice').textContent = `Unit Price: $${price}`;
});

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const medicineSelect = document.getElementById('medicineName');
    const medicineName = medicineSelect.value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(medicineSelect.options[medicineSelect.selectedIndex].getAttribute('data-price'));
    
    if (medicineName && quantity && price) {
        addToCart(medicineName, quantity, price);
        
        const successMsg = document.getElementById('successMessage');
        successMsg.classList.add('show');
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 3000);
        
        this.reset();
        document.getElementById('unitPrice').textContent = 'Unit Price: $0.00';
    }
});

function addToCart(name, qty, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ name, qty, price });
    }
    
    updateCart();
}


function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}


function updateCart() {
    const cartTbody = document.getElementById('cartTbody');
    
    if (cart.length === 0) {
        cartTbody.innerHTML = '<tr><td colspan="4" class="empty-cart">Cart is empty</td></tr>';
        updateTotals(0, 0, 0);
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    cartTbody.innerHTML = cart.map((item, index) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${(item.qty * item.price).toFixed(2)}</td>
            <td>
                <button class="delete-btn" onclick="removeFromCart(${index})">×</button>
            </td>
        </tr>
    `).join('');
    
    updateTotals(subtotal, tax, total);
}

function updateTotals(subtotal, tax, total) {
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
}

function clearCart() {
    if (cart.length === 0) {
        alert('Cart is already empty!');
        return;
    }
    
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        updateCart();
    }
}


function completeSale() {
    if (cart.length === 0) {
        alert('Cart is empty! Please add items before completing the sale.');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    
    const SALES_KEY = 'pharma_sales_v1';
    try {
        const sales = JSON.parse(localStorage.getItem(SALES_KEY) || '[]');
        const saleRecord = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: [...cart],
            subtotal: subtotal,
            tax: tax,
            total: total
        };
        sales.push(saleRecord);
        localStorage.setItem(SALES_KEY, JSON.stringify(sales));
    } catch (e) {
        console.error('Failed to save sale', e);
    }
    
    alert(`Sale completed successfully!\nTotal: $${total.toFixed(2)}\n\nThank you for choosing our pharmacy.\nWe wish you a speedy recovery and good health always.`);
    
    cart = [];
    updateCart();
    window.location.href = "../reset/index.html";
}

function resetForm() {
    document.getElementById('orderForm').reset();
    document.getElementById('unitPrice').textContent = 'Unit Price: $0.00';
}