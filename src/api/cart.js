import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { __dirname } from '../dirname.js';
import { readProducts } from './products.js';

export const cart = Router();
const cartFilePath = path.join(__dirname, './data/carrito.json');

function readCart() {
    const data = fs.readFileSync(cartFilePath);
    return JSON.parse(data);
}

function writeCart(data) {
    fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2));
}

cart.post("/carrito", (req, res) => {
    const cartItems = readCart();
    const newCart = {
        id: cartItems.length > 0 ? cartItems[cartItems.length - 1].id + 1 : 1,
        products: [],
    };
    cartItems.push(newCart);
    writeCart(cartItems);
    res.status(201).json({ message: "Carrito creado exitosamente", cart: newCart });
});

cart.get("/carrito/:cid", (req, res) => {
    const { cid } = req.params;
    const cartItems = readCart();
    if (isNaN(cid) || cid <= 0) {
        return res.status(400).json({ error: "El ID debe ser un número válido mayor a 0" });
    }
    const cart = cartItems.find(cart => cart.id === Number(cid));
    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.status(200).json({ cart });
});

cart.post("/carrito/:cid/product/:pid", (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cartItems = readCart();
    const productos = readProducts(); 
    if (isNaN(cid) || cid <= 0) {
        return res.status(400).json({ error: "El ID del carrito debe ser un número válido mayor a 0" });
    }
    if (isNaN(pid) || pid <= 0) {
        return res.status(400).json({ error: "El ID del producto debe ser un número válido mayor a 0" });
    }
    if (quantity == null || typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ error: "La cantidad es obligatoria y debe ser un número mayor a 0" });
    }
    const cartIndex = cartItems.findIndex(cart => cart.id === Number(cid));
    if (cartIndex === -1) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const product = productos.find(product => product.id === Number(pid));
    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    const cart = cartItems[cartIndex];
    const existingProductIndex = cart.products.findIndex(p => p.id === Number(pid));
    if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
    } else {
        cart.products.push({ id: Number(pid), quantity });
    }
    writeCart(cartItems);
    res.status(200).json({ message: "Producto agregado al carrito exitosamente", cart });
});