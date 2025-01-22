const socket = io();

const productsList = document.getElementById("productsRoute");

socket.on("init", (productsRoute) => {
    productsRoute.forEach((productRoute) => {
        const li = createProduct(productRoute);
        productsList.appendChild(li);
    });
});

socket.on("new-product", (productRoute) => {
    const li = createProduct(productRoute);
    productsList.appendChild(li);
});

function createProduct(productRoute) {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${productRoute.nombre}</strong>: ${productRoute.precio}`;
    li.className = "collection-item";

    return li;
}