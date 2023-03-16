const express = require("express");
const fs = require("fs");

const cartsRouter = express.Router();

// Ruta POST para crear un nuevo carrito
cartsRouter.post("/", (req, res) => {
  const newCart = { id: Date.now().toString(), products: [] };
  fs.writeFileSync("../data/carrito.json", JSON.stringify(newCart));
  res.json(newCart);
});

// Ruta GET para obtener un carrito por su id
cartsRouter.get("/:cid", (req, res) => {
  const cid = req.params.cid;
  const cart = JSON.parse(fs.readFileSync("../data/carrito.json", "utf-8"));
  if (cart.id === cid) {
    res.json(cart);
  } else {
    res.status(404).send(`Carrito con id ${cid} no encontrado`);
  }
});

// Ruta DELETE para eliminar un carrito por su id
cartsRouter.delete("/:cid", (req, res) => {
  const cid = req.params.cid;
  try {
    fs.unlinkSync("./data/carrito.json");
    res.send(`Carrito con id ${cid} eliminado`);
  } catch (error) {
    res.status(404).send(`Carrito con id ${cid} no encontrado`);
  }
});

// Ruta POST para agregar un producto a un carrito
cartsRouter.post("/:cid/productos", (req, res) => {
  const cid = req.params.cid;
  const pid = req.body.id;
  const products = JSON.parse(
    fs.readFileSync("../data/productos.json", "utf-8")
  );
  const cart = JSON.parse(fs.readFileSync("../data/carrito.json", "utf-8"));
  const product = products.find((p) => p.id === pid);
  if (!product) {
    res.status(404).send(`Producto con id ${pid} no encontrado`);
    return;
  }
  cart.products.push(product);
  fs.writeFileSync("../data/carrito.json", JSON.stringify(cart));
  res.json(cart);
});

// Ruta GET para obtener los productos de un carrito
cartsRouter.get("/:cid/productos", (req, res) => {
  const cid = req.params.cid;
  const cart = JSON.parse(fs.readFileSync("../data/carrito.json", "utf-8"));
  if (cart.id !== cid) {
    res.status(404).send(`Carrito con id ${cid} no encontrado`);
    return;
  }
  res.json(cart.products);
});

// Ruta DELETE para eliminar un producto de un carrito
cartsRouter.delete("/:cid/productos/:pid", (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = JSON.parse(fs.readFileSync("../data/carrito.json", "utf-8"));
  const productIndex = cart.products.findIndex((p) => p.id === pid);
  if (productIndex !== -1) {
    cart.products.splice(productIndex, 1);
    fs.writeFileSync("./data/carrito.json", JSON.stringify(cart));
    res.json(cart);
  } else {
    res
      .status(404)
      .send(`Producto con id ${pid} no encontrado en el carrito con id ${cid}`);
  }
});

module.exports = cartsRouter;
