const socket = io();

const productForm = document.getElementById('product-form');
const productTitle = document.getElementById('product-title');
const productCode = document.getElementById('product-code');
const productPrice = document.getElementById('product-price');
const productStock = document.getElementById('product-stock');
const deleteProductForm = document.getElementById('delete-product-form');
const deleteProductId = document.getElementById('delete-product-id');
const productList = document.getElementById('product-list');

// Enviar nuevo producto
productForm.addEventListener('submit', (event) => {
    const title = productTitle.value.trim();
    const code = productCode.value.trim();
    const price = parseFloat(productPrice.value);
    const stock = parseInt(productStock.value);

    if (!title || !code || isNaN(price) || isNaN(stock)) {
        Swal.fire('Error', 'Todos los campos son obligatorios y deben ser válidos', 'error');
        return;
    }

    socket.emit('add-product', { title, code, price, stock, status: true, category: 'almacen', thumbnail: 'Sin imagen' });

    // Resetear formulario
    productForm.reset();
});

// Eliminar producto
deleteProductForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const productId = parseInt(deleteProductId.value);

    if (isNaN(productId) || productId <= 0) {
        Swal.fire('Error', 'Ingrese un ID válido', 'error');
        return;
    }

    socket.emit('delete-product', { id: productId });

    // Resetear formulario
    deleteProductForm.reset();
});

// Escuchar actualización de productos
// Escuchar actualización de productos
socket.on('update-products', (products) => {
    productList.innerHTML = '';
    products.sort((a, b) => a.id - b.id); //ordenar ascendente
    products.forEach(product => {
        const productsList = document.createElement('div');
        productsList.classList.add('col-md-3', 'p-2');
        productsList.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">Código del producto: ${product.id}</h5>
                    <p class="card-text"><strong>Nombre del producto:</strong> ${product.title}</p>
                    <p class="card-text"><strong>Precio:</strong> $ ${product.price}</p>
                    <p class="card-text"><strong>Código:</strong> ${product.code}</p>
                    <p class="card-text"><strong>Stock:</strong> ${product.stock}</p>
                </div>
            </div>
        `;

        productList.appendChild(productsList);
    });
});


// Manejo de errores
socket.on('error-message', (message) => {
    Swal.fire('Error', message, 'error');
});
