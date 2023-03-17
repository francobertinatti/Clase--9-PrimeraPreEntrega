const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const cartsFilePath = "./data/carrito.json";
const productsFilePath = "./data/productos.json";

//TODO: Ruta POST en la raíz (/) para crear un nuevo carrito (OK)

router.post("/", (req, res) => {
  try {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, "utf-8"));
    const newCart = {
      id: uuidv4(),
      products: [],
    };
    carts.push(newCart);
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//TODO: Listar productos del carrito con el id cid (OK) http://localhost:8080/carrito/f6c792e9-3d3a-4b67-a2a1-7e8edc62f88a
router.get("/:cid", (req, res) => {
  try {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, "utf-8"));
    const cart = carts.find((cart) => cart.id === req.params.cid);
    if (!cart) {
      res.status(404).send("Carrito no encontrado");
    } else {
      res.json(cart.products);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error: not found");
  }
});

// Agregar producto al carrito con el id cid http://localhost:8080/{id_del_carrito}/product/{id_del_producto} = http://localhost:8080/carrito/f6c792e9-3d3a-4b67-a2a1-7e8edc62f88a/product/1

router.post("/:cid/product/:pid", (req, res) => {
  try {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, "utf-8"));
    const cartIndex = carts.findIndex((cart) => cart.id === req.params.cid);
    if (cartIndex === -1) {
      res.status(404).send("Carrito no encontrado");
      return;
    }
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    const product = products.find(
      (product) => product.id === Number(req.params.pid)
    );
    if (!product) {
      res.status(404).send("Producto no encontrado");
      return;
    }
    const cart = carts[cartIndex];
    const existingProduct = cart.products.find(
      (product) => product.id === Number(req.params.pid)
    );
    const quantity = Number(req.body.quantity);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      const newProduct = products.find(
        (product) => product.id === Number(req.params.pid)
      );
      if (newProduct) {
        cart.products.push({
          id: Number(req.params.pid),
          quantity,
        });
      } else {
        res.status(404).send("Producto no encontrado");
        return;
      }
    }
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.json(cart.products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:cid/product/:pid", (req, res) => {
  try {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, "utf-8"));
    const cart = carts.find((cart) => cart.id === req.params.cid);
    if (!cart) {
      res.status(404).send("Carrito no encontrado");
      return;
    }
    const product = cart.products.find(
      (product) => product.id === parseInt(req.params.pid)
    );
    if (!product) {
      res.status(404).send("Producto no encontrado");
      return;
    }
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
