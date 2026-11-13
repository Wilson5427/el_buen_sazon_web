const weeklyMenu = {
  "Lunes": {
    entrada: "Consomé de carne con chifles",
    segundos: ["Pollo a la plancha", "Seco de costilla", "Papas con cuero"]
  },
  "Martes": {
    entrada: "Sopa de acelga",
    segundos: ["Pollo en salsa de champiñones", "Estofado de carne", "Chuleta de cerdo"]
  },
  "Miércoles": {
    entrada: "Crema de zanahoria con canguil",
    segundos: ["Pollo broaster", "Milanesa de pescado", "Chuleta de res a la plancha"]
  },
  "Jueves": {
    entrada: "Sopa de bolas de verde",
    segundos: ["Milanesa de pollo", "Fritada", "Guatita"]
  },
  "Viernes": {
    entrada: "Sopa de quinua",
    segundos: ["Filete de res a la plancha", "Estofado de pollo", "Tilapia frita"]
  },
  "Sábado": {
    entrada: "Sopa de menestrón",
    segundos: ["Pollo en salsa de maní", "Chuleta de cerdo a la plancha", "Estofado de carne", "Tilapia frita"]
  },
  "Domingo": {
    entrada: "Sancocho",
    segundos: ["Chuleta de cerdo", "Seco de costilla", "Milanesa de pollo"]
  }
};

const specials = [
  {name:"Mixto de gallina horneada",price:3.25,emoji:"🍗"},
  {name:"Mixto de gallina chicharrón",price:3.25,emoji:"🍗"},
  {name:"Mixto de camarones apanados",price:3.50,emoji:"🍤"},
  {name:"Mixto de alitas broaster",price:3.50,emoji:"🍗"},
  {name:"Costilla ahumada",price:3.50,emoji:"🥩"},
  {name:"Mixto de alitas BBQ",price:3.50,emoji:"🍖"}
];

const extras = [
  {name:"Coca-Cola",price:0.50,emoji:"🥤"},
  {name:"Agua",price:0.50,emoji:"💧"},
  {name:"Vaso de jugo",price:0.25,emoji:"🧃"},
  {name:"Porción de papas fritas",price:1.00,emoji:"🍟"}
];

let selectedDay = Object.keys(weeklyMenu)[new Date().getDay() === 0 ? 6 : new Date().getDay()-1];
let cart = [];
let orderType = "servir";

const money = value => "$" + value.toFixed(2).replace(".", ",");
const dayTabs = document.getElementById("dayTabs");
const dailyMenu = document.getElementById("dailyMenu");
const specialGrid = document.getElementById("specialGrid");
const extrasGrid = document.getElementById("extrasGrid");

function renderDays() {
  dayTabs.innerHTML = Object.keys(weeklyMenu).map(day =>
    `<button class="day-tab ${day===selectedDay?"active":""}" role="tab" aria-selected="${day===selectedDay}" data-day="${day}">${day}</button>`
  ).join("");
  dayTabs.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    selectedDay = btn.dataset.day; renderDays(); renderDailyMenu();
  }));
}

function renderDailyMenu() {
  const menu = weeklyMenu[selectedDay];
  dailyMenu.innerHTML = `
    <article class="menu-column">
      <h3>🥣 Entrada</h3>
      <ul><li>${menu.entrada}<button class="mini-add" id="addEntry">+ $1,25</button></li></ul>
      <p class="muted">Entrada sola $1,25 o incluida en el almuerzo completo.</p>
    </article>
    <article class="menu-column">
      <h3>🍛 Segundos</h3>
      <ul>${menu.segundos.map((item,i)=>`<li><span>${item}</span><button class="mini-add" data-second="${i}">+ $2,00</button></li>`).join("")}</ul>
      <p class="muted">Segundo solo $2,00 o incluido en el almuerzo completo.</p>
    </article>
    <article class="menu-column">
      <h3>🥤 Bebida</h3>
      <ul><li>Jugo de frutas <strong>${money(0.25)}</strong></li></ul>
      <p class="muted">La bebida se agrega por separado.</p>
      <h3 style="margin-top:22px">💰 Precios</h3>
      <ul><li>Almuerzo completo <strong>$3,00</strong></li><li>Segundo solo <strong>$2,00</strong></li></ul>
    </article>
    <div class="menu-action">
      <p>El almuerzo completo incluye la entrada y un segundo a elección.</p>
      <button class="add-meal" id="addMeal">＋ Agregar almuerzo completo · $3,00</button>
    </div>`;
  document.getElementById("addMeal").addEventListener("click", () => {
    addToCart(`${selectedDay} - Almuerzo completo`,3.00,`Entrada: ${menu.entrada} + un segundo a elección (se confirma por WhatsApp).`);
  });
  document.getElementById("addEntry").addEventListener("click", () => {
    addToCart(`${selectedDay} - Entrada: ${menu.entrada}`,1.25,"Entrada sola");
  });
  dailyMenu.querySelectorAll("[data-second]").forEach(btn => {
    const second = menu.segundos[Number(btn.dataset.second)];
    btn.addEventListener("click", () => addToCart(`${selectedDay} - ${second}`,2.00,"Segundo solo"));
  });
}

function renderProductCards() {
  specialGrid.innerHTML = specials.map((item,i)=>`
    <article class="food-card">
      <div class="food-emoji">${item.emoji}</div><h3>${item.name}</h3>
      <p>Plato especial de El Buen Sazón.</p>
      <div class="card-bottom"><span class="card-price">${money(item.price)}</span><button class="add-btn" data-special="${i}">＋ Agregar</button></div>
    </article>`).join("");
  specialGrid.querySelectorAll("[data-special]").forEach(btn=>{
    const item=specials[Number(btn.dataset.special)];
    btn.addEventListener("click",()=>addToCart(item.name,item.price,"Plato especial"));
  });
  extrasGrid.innerHTML = extras.map((item,i)=>`
    <article class="extra-card">
      <div class="food-emoji">${item.emoji}</div>
      <div><strong>${item.name}</strong><small>Para acompañar tu pedido</small></div>
      <span class="card-price">${money(item.price)}</span>
      <button class="add-btn" aria-label="Agregar ${item.name}" data-extra="${i}">+</button>
    </article>`).join("");
  extrasGrid.querySelectorAll("[data-extra]").forEach(btn=>{
    const item=extras[Number(btn.dataset.extra)];
    btn.addEventListener("click",()=>addToCart(item.name,item.price,"Bebida o acompañante"));
  });
}

function addToCart(name,price,detail="") {
  const existing=cart.find(item=>item.name===name && item.detail===detail);
  if(existing) existing.qty++;
  else cart.push({name,price,detail,qty:1});
  renderCart(); showToast();
}
function changeQty(index,delta) {
  cart[index].qty += delta;
  if(cart[index].qty<=0) cart.splice(index,1);
  renderCart();
}
function renderCart() {
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  document.getElementById("navCartCount").textContent=count;
  document.getElementById("fabCartCount").textContent=count;
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map((item,i)=>`
    <div class="cart-item">
      <div><strong>${item.name}</strong><small>${item.detail}</small><small>${money(item.price)} c/u</small></div>
      <div class="item-controls"><button data-change="${i}" data-delta="-1">−</button><span>${item.qty}</span><button data-change="${i}" data-delta="1">+</button></div>
    </div>`).join("") : `<div class="empty-cart">Tu carrito está vacío.<br><span>Agrega algo rico del menú. 🍽️</span></div>`;
  document.querySelectorAll("[data-change]").forEach(btn=>btn.addEventListener("click",()=>changeQty(Number(btn.dataset.change),Number(btn.dataset.delta))));
  const subtotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  const fee=orderType==="llevar" && cart.length ? 0.25 : 0;
  document.getElementById("subtotal").textContent=money(subtotal);
  document.getElementById("packaging").textContent=money(fee);
  document.getElementById("packagingLabel").textContent=orderType==="llevar"?"Bandeja para llevar":"Bandeja";
  document.getElementById("total").textContent=money(subtotal+fee);
}
function showToast() {
  const toast=document.getElementById("toast"); toast.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>toast.classList.remove("show"),1500);
}
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","false");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","true");
}
document.getElementById("openCartNav").addEventListener("click",openCart);
document.getElementById("openCartFab").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("cartOverlay").addEventListener("click",closeCart);
document.querySelectorAll('input[name="orderType"]').forEach(input=>input.addEventListener("change",e=>{
  orderType=e.target.value; renderCart();
}));
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){alert("Tu carrito está vacío. Agrega algún plato antes de enviar el pedido.");return;}
  const subtotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  const fee=orderType==="llevar"?0.25:0;
  const lines=cart.map(item=>`• ${item.qty} x ${item.name} — ${money(item.price*item.qty)}${item.detail?`\n  ${item.detail}`:""}`).join("\n");
  const message=`¡Hola! Quiero realizar este pedido en El Buen Sazón:\n\n${lines}\n\nModalidad: ${orderType==="llevar"?"Para llevar":"Para servir"}\nSubtotal: ${money(subtotal)}\n${orderType==="llevar"?"Bandeja para llevar: "+money(fee)+"\n":""}TOTAL: ${money(subtotal+fee)}\n\n¿Me ayudan confirmando la disponibilidad?`;
  const phone="593979269385";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
document.getElementById("menuToggle").addEventListener("click",()=>{
  const nav=document.getElementById("mainNav");
  nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded",nav.classList.contains("open"));
});
document.querySelectorAll("#mainNav a").forEach(link=>link.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();

renderDays();
renderDailyMenu();
renderProductCards();
renderCart();
