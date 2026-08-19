const products=[
{id:1,name:"Camiseta Essential",cat:"camisetas",price:79.9,img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",tag:"Mais vendida"},
{id:2,name:"Camiseta Oversized",cat:"camisetas",price:99.9,img:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=80",tag:"Nova"},
{id:3,name:"Calça Jeans Classic",cat:"calcas",price:159.9,img:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80",tag:"Destaque"},
{id:4,name:"Vestido Urban",cat:"vestidos",price:139.9,img:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=80",tag:"Nova"},
{id:5,name:"Moletom Comfort",cat:"moletons",price:189.9,img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80",tag:"Destaque"},
{id:6,name:"Calça Cargo",cat:"calcas",price:179.9,img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",tag:""},
{id:7,name:"Camiseta Street",cat:"camisetas",price:89.9,img:"https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=700&q=80",tag:""},
{id:8,name:"Vestido Minimal",cat:"vestidos",price:149.9,img:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80",tag:""}
];
let cart=JSON.parse(localStorage.getItem("veste_cart")||"[]");
const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function render(){
 let q=document.getElementById("search").value.toLowerCase(), c=document.getElementById("category").value, s=document.getElementById("sort").value;
 let arr=products.filter(p=>(c==="todos"||p.cat===c)&&p.name.toLowerCase().includes(q));
 if(s==="low")arr.sort((a,b)=>a.price-b.price); if(s==="high")arr.sort((a,b)=>b.price-a.price);
 document.getElementById("resultInfo").textContent=`${arr.length} produto(s)`;
 document.getElementById("productGrid").innerHTML=arr.map(p=>`<article class="product"><div class="product-img">${p.tag?`<span class="badge">${p.tag}</span>`:""}<img src="${p.img}" alt="${p.name}"></div><div class="product-info"><span class="category-label">${p.cat}</span><h3>${p.name}</h3><div class="price">${money(p.price)}</div><button class="buy" onclick="add(${p.id})">Adicionar ao carrinho</button></div></article>`).join("");
}
function save(){localStorage.setItem("veste_cart",JSON.stringify(cart))}
function add(id){let x=cart.find(i=>i.id===id);if(x)x.qty++;else cart.push({id,qty:1});save();renderCart();openCart()}
function renderCart(){
 const box=document.getElementById("cartItems"); let total=0,count=0;
 if(!cart.length)box.innerHTML="<div style='padding:40px 10px;text-align:center;color:#777'>Seu carrinho está vazio.</div>";
 else box.innerHTML=cart.map(i=>{let p=products.find(x=>x.id===i.id),sub=p.price*i.qty;total+=sub;count+=i.qty;return `<div class="cart-row"><img src="${p.img}"><div style="flex:1"><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty"><button onclick="change(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="change(${p.id},1)">+</button><button class="remove" onclick="removeItem(${p.id})">Remover</button></div></div></div>`}).join("");
 document.getElementById("cartTotal").textContent=money(total);document.getElementById("cartCount").textContent=count;
}
function change(id,n){let x=cart.find(i=>i.id===id);if(!x)return;x.qty+=n;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save();renderCart()}
function removeItem(id){cart=cart.filter(i=>i.id!==id);save();renderCart()}
function openCart(){document.getElementById("drawer").classList.add("open");document.getElementById("overlay").classList.add("active")}
function closeCart(){document.getElementById("drawer").classList.remove("open");document.getElementById("overlay").classList.remove("active")}
function checkout(){
 if(!cart.length)return alert("Adicione pelo menos um produto ao carrinho.");
 let total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 document.getElementById("checkoutSummary").innerHTML=`<strong>Total do pedido: ${money(total)}</strong><br><small>${cart.reduce((s,i)=>s+i.qty,0)} item(ns) no carrinho</small>`;
 document.getElementById("checkoutModal").classList.add("active");closeCart()
}
document.getElementById("cartBtn").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("clearCart").onclick=()=>{cart=[];save();renderCart()};document.getElementById("checkoutBtn").onclick=checkout;
document.getElementById("closeModal").onclick=()=>document.getElementById("checkoutModal").classList.remove("active");
document.getElementById("category").onchange=render;document.getElementById("sort").onchange=render;document.getElementById("search").oninput=render;document.getElementById("searchBtn").onclick=render;
document.getElementById("placeOrder").onclick=async()=>{
 let name=document.getElementById("name").value.trim();
 if(!name)return alert("Informe seu nome.");
 if(!cart.length)return alert("Seu carrinho está vazio.");
 const payment=document.querySelector('input[name="payment"]:checked').value;
 const items=cart.map(i=>{const p=products.find(x=>x.id===i.id);return {id:p.id,name:p.name,quantity:i.qty,unitPrice:p.price};});
 try{
   const r=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
     customer:{name,email:document.getElementById("email").value.trim(),phone:document.getElementById("phone").value.trim(),address:document.getElementById("address").value.trim(),cep:document.getElementById("cep").value.trim(),city:document.getElementById("city").value.trim()},
     items,
     payment
   })});
   const data=await r.json();
   if(!r.ok)throw new Error(data.error||"Não foi possível criar o checkout.");
   if(data.checkoutUrl){window.location.href=data.checkoutUrl;return;}
   alert("Checkout criado, mas o link não foi retornado.");
 }catch(e){alert(e.message)}
};
document.getElementById("done").onclick=()=>{document.getElementById("checkoutModal").classList.remove("active");document.getElementById("checkoutForm").classList.remove("hidden");document.getElementById("success").classList.add("hidden")};
render();renderCart();
