import express from "express";
import { products } from "./api/products.js";
import { cart} from "./api/cart.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(products)
app.use(cart)

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});