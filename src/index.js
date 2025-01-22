import path from "path";
import express from "express";
import { products } from "./api/products.js";
import { cart } from "./api/cart.js"
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./dirname.js";
import { productsRoutes, productsRoute } from "./api/productsRoutes.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));


app.engine(
    "hbs",
    handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    })
);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));

app.use("/", products)
app.use("/api/carrito", cart)
app.use("/api/productsRoute", productsRoutes)

const server = app.listen(5000, () =>
    console.log("Server running on port http://localhost:5000")
);

export const io = new Server(server);

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.emit("init", productsRoute);
});