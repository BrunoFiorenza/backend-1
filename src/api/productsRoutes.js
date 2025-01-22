import { Router } from "express";
import { io } from "../index.js";

export const productsRoutes = Router();


export const productsRoute = [
{"nombre": "Budin", "precio": 3000},
{"nombre": "Alfajor de maicena", "precio": 500},
{"nombre": "Torta", "precio": 4000},
{"nombre": "Cupcake", "precio": 1000},
{"nombre": "Chocotorta", "precio": 2000},
];

productsRoutes.get("/", (req, res) => {
    res.json(productsRoute);
});

productsRoutes.post("/", (req, res) => {
    const { nombre, precio } = req.body;
    productsRoute.push({ nombre, precio });

    io.emit("new-product", { nombre, precio });

    res.json({ nombre, precio });
});