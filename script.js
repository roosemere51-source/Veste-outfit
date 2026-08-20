const produtos = [
    { id: 1, nome: "Camiseta Básica", preco: 49.90, imagem: "" },
    { id: 2, nome: "Calça Jeans", preco: 129.90, imagem: "" },
    { id: 3, nome: "Vestido Floral", preco: 89.90, imagem: "" },
    { id: 4, nome: "Jaqueta Corta Vento", preco: 199.90, imagem: "" },
    { id: 5, nome: "Shorts Esportivo", preco: 59.90, imagem: "" },
    { id: 6, nome: "Blusa de Moletom", preco: 79.90, imagem: "" }
];

let carrinho = [];
const listaProdutosEl = document.getElementById('lista-produtos');
const modalCarrinhoEl = document.getElementById('modal-carrinho');
const itensCarrinhoEl = document.getElementById('itens-carrinho');
const contadorCarrinhoEl = document.getElementById('contador-carrinho');
const valorTotalEl = document.getElementById('valor-total');

function renderizarProdutos() {
    listaProdutosEl.innerHTML = produtos.map(produto => `
        <div class="produto">
            <img src="${produto.imagem || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%23ddd width=%22200%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%23888%22>Imagem</text></svg>'}" alt="${produto.nome}">
            <div class="produto-info">
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                <button class="btn" onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
            </div>
        </div>
    `).join('');
}

function adicionarAoCarrinho(idProduto) {
    const produto = produtos.find(p => p.id === idProduto);
    const itemNoCarrinho = carrinho.find(i => i.id === idProduto);
    if (itemNoCarrinho) {
        itemNoCarrinho.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarCarrinho();
    alert(`${produto.nome} adicionado!`);
}

function atualizarCarrinho() {
    contadorCarrinhoEl.textContent = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    if (carrinho.length === 0) {
        itensCarrinhoEl.innerHTML = '<p>Carrinho vazio</p>';
        valorTotalEl.textContent = '0,00';
        return;
    }
    let total = 0;
    itensCarrinhoEl.innerHTML = carrinho.map(item => {
        total += item.preco * item.quantidade;
        return `
            <div class="item-carrinho">
                <div><strong>${item.nome}</strong><br>R$ ${item.preco.toFixed(2).replace('.', ',')} × ${item.quantidade}</div>
                <button onclick="removerDoCarrinho(${item.id})" style="background:red;color:white;border:none;padding:4px 8px;border-radius:4px;">✕</button>
            </div>
        `;
    }).join('');
    valorTotalEl.textContent = total.toFixed(2).replace('.', ',');
}

function removerDoCarrinho(idProduto) {
    carrinho = carrinho.filter(i => i.id !== idProduto);
    atualizarCarrinho();
}

document.getElementById('carrinho-icone').addEventListener('click', (e) => {
    e.preventDefault();
    modalCarrinhoEl.style.display = 'flex';
});
document.querySelector('.fechar').addEventListener('click', () => {
    modalCarrinhoEl.style.display = 'none';
});
document.getElementById('finalizar-compra').addEventListener('click', () => {
    if (carrinho.length === 0) { alert('Carrinho vazio!'); return; }
    const total = carrinho.reduce((soma, i) => soma + i.preco * i.quantidade, 0);
    alert(`Pedido no valor de R$ ${total.toFixed(2).replace('.', ',')} enviado!`);
    carrinho = [];
    atualizarCarrinho();
    modalCarrinhoEl.style.display = 'none';
});

renderizarProdutos();
