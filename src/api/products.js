import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { __dirname } from '../dirname.js'

export const products = Router();
const productsFilePath = path.join(__dirname, './data/productos.json');

function readProducts() {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
}

function writeProducts(data) {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
}

const productos = readProducts();

products.get("/productos", (req, res) => {
    const { limit } = req.query;
    if (!limit) {
        return res.status(200).json({ productos });
    }
    if (isNaN(limit) || limit <= 0) {
        return res.status(400).json({ error: "El parámetro 'limit' debe ser un número mayor a 0" });
    }
    const productosLimitados = productos.slice(0, limit);
    res.status(200).json({ productos: productosLimitados });
});

products.get("/productos/:pid", (req, res) => {
    const { pid } = req.params;
    if (isNaN(Number(pid))) {
        return res.status(400).json({ error: "El ID debe ser un número válido" });
    }
    const producto = productos.find((producto) => producto.id === Number(pid));
    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ producto });
});

products.post("/productos", (req, res) => {
    const { nombre, precio } = req.body;
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es obligatorio y debe ser una cadena no vacía" });
    }
    if (precio == null || typeof precio !== "number" || precio <= 0) {
        return res.status(400).json({ error: "El precio es obligatorio y debe ser un número mayor a 0" });
    }
    if (productos.some((producto) => producto.nombre.toLowerCase() === nombre.toLowerCase())) {
        return res.status(409).json({ error: "El nombre del producto ya existe" });
    }
    const newProducto = {
        id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1, 
        nombre,
        precio,
    };
    productos.push(newProducto);
    res.status(201).json({ message: "Producto creado exitosamente", producto: newProducto });
});

products.put("/productos/:pid", (req, res) => {
    const { pid } = req.params;
    const { nombre, precio } = req.body;
    if (isNaN(pid) || pid <= 0) {
        return res.status(400).json({ error: "El ID debe ser un número válido mayor a 0" });
    }
    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es obligatorio y debe ser una cadena no vacía" });
    }
    if (precio == null || typeof precio !== "number" || precio <= 0) {
        return res.status(400).json({ error: "El precio es obligatorio y debe ser un número mayor a 0" });
    }
    const index = productos.findIndex((producto) => producto.id === Number(pid));
    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    const producto = productos[index];
    producto.nombre = nombre ?? producto.nombre;
    producto.precio = precio ?? producto.precio;
    productos[index] = producto;
    res.status(200).json({ message: "Producto actualizado exitosamente", producto });
});

products.delete("/productos/:pid", (req, res) => {
    const { pid } = req.params;
    if (isNaN(pid) || pid <= 0) {
        return res.status(400).json({ error: "El ID debe ser un número válido mayor a 0" });
    }
    const index = productos.findIndex((producto) => producto.id === Number(pid));
    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }
    productos.splice(index, 1);
    res.status(200).json({ message: "Producto eliminado exitosamente" });
});