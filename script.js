// Cargar el carrito desde la memoria del navegador para que no se borre al cambiar de página
let cart = JSON.parse(localStorage.getItem('alaya_cart')) || [];

// Ejecutar al cargar cualquier página
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

// Abrir o cerrar el panel lateral del carrito
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.toggle('open');
    }
}

// Añadir un arreglo floral al carrito
function addToCart(name, price) {
    cart.push({ name, price });
    saveCart();
    updateCartUI();
    
    // Abre el carrito automáticamente para confirmar que se agregó
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('open');
    }
}

// Eliminar un producto específico del carrito
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

// Guardar en localStorage
function saveCart() {
    localStorage.setItem('alaya_cart', JSON.stringify(cart));
}

// Actualizar la interfaz visual del carrito y el contador superior
function updateCartUI() {
    const cartList = document.getElementById('cartItemsList');
    const cartCount = document.getElementById('cart-count'); // ID corregido con guion
    const cartTotal = document.getElementById('cartTotal');

    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    if (!cartList || !cartTotal) return;

    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align: center; color: #777; margin-top: 20px;">Tu carrito está vacío.</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        html += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>$${item.price.toFixed(2)}</small>
                </div>
                <button onclick="removeItem(${index})" style="background:none; border:none; color: #d6087d; cursor:pointer; font-weight:bold;">Eliminar</button>
            </div>
        `;
    });

    cartList.innerHTML = html;
    cartTotal.textContent = total.toFixed(2);
}

// Calcular el tiempo estimado de entrega (usando los tiempos según sector)
function calcularTiempo() {
    const zonaInput = document.getElementById('zone-input');
    const resultDiv = document.getElementById('delivery-result');
    
    if (!zonaInput || !resultDiv) return;

    const zona = zonaInput.value.trim();

    if (zona === "") {
        resultDiv.innerHTML = "⚠️ Por favor, ingresa una zona o sector válido.";
        return;
    }

    const tiempos = [30, 40, 45, 50];
    const tiempoAleatorio = tiempos[Math.floor(Math.random() * tiempos.length)];

    resultDiv.innerHTML = `🚚 ¡Excelente! Para la zona de <strong>${zona}</strong>, tu pedido floral de ALAYA llegará en aproximadamente <strong>${tiempoAleatorio} minutos</strong>.`;
}

// Finalizar la compra
function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega flores antes de realizar tu pedido.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`🌸 ¡Gracias por tu compra en ALAYA!\nTotal pagado: $${total.toFixed(2)}\nTu pedido se está preparando y llegará en un promedio de 35 a 45 minutos.`);
    
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}