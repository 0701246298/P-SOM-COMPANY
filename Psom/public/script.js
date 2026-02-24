const stripe = Stripe("YOUR_STRIPE_PUBLIC_KEY");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const services = [
{ name:"Web Development", price:120, icon:"bi-code-slash" },
{ name:"Brand Identity", price:90, icon:"bi-palette" },
{ name:"SEO Optimization", price:75, icon:"bi-graph-up" },
{ name:"Digital Marketing", price:150, icon:"bi-megaphone" }
];

function renderServices(){
const container=document.getElementById("services");
services.forEach(s=>{
container.innerHTML+=`
<div class="col-md-3">
<div class="service-card text-center">
<i class="bi ${s.icon} icon"></i>
<h6>${s.name}</h6>
<p>$${s.price}</p>
<button class="btn btn-dark btn-sm" onclick="addToCart('${s.name}',${s.price})">Add</button>
</div>
</div>`;
});
}
renderServices();

function addToCart(name,price){
let existing=cart.find(i=>i.name===name);
if(existing){
existing.quantity++;
}else{
cart.push({name,price,quantity:1});
}
updateCart();
}

function removeItem(name){
cart=cart.filter(i=>i.name!==name);
updateCart();
}

function updateCart(){
localStorage.setItem("cart",JSON.stringify(cart));
let total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
document.getElementById("cart-count").innerText=cart.length;
document.getElementById("cart-total").innerText=total;

let cartItems=document.getElementById("cart-items");
cartItems.innerHTML="";
cart.forEach(i=>{
cartItems.innerHTML+=`
<div class="d-flex justify-content-between">
<span>${i.name} x${i.quantity}</span>
<button class="btn btn-sm btn-danger" onclick="removeItem('${i.name}')">X</button>
</div>`;
});
}
updateCart();

async function checkout(){
const currency=document.getElementById("currency").value;

const response=await fetch("/create-checkout-session",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({ items:cart, currency })
});

const session=await response.json();
stripe.redirectToCheckout({ sessionId:session.id });
}