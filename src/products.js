const express = require("express");
const fs = require("fs");

const router = express.Router();

// Ruta GET para listar todos los productos
router.get("/", (req, res) => {
  const { limit } = req.query;
  let products = JSON.parse(fs.readFileSync("../data/productos.json", "utf-8"));

  if (limit) {
    products = products.slice(0, limit);
  }
  res.json(products);
});

// Ruta GET para traer un producto por id
router.get("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid); // convierte a número
  const products = JSON.parse(
    fs.readFileSync("../data/productos.json", "utf-8")
  );
  const product = products.find((p) => p.id === pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send(`Producto con id ${pid} no encontrado`);
  }
});

// Ruta POST para agregar un nuevo producto
router.post("/", (req, res) => {
  const newProduct = {
    id: null, // cambia la cadena vacía por null
    title: req.body.title,
    price: parseFloat(req.body.price),
    thumbnail: req.body.thumbnail,
  };

  const products = JSON.parse(
    fs.readFileSync("../data/productos.json", "utf-8")
  );

  // Generamos un nuevo id para el producto
  const lastId = products.length > 0 ? products[products.length - 1].id : 0;
  const newId = lastId + 1;

  newProduct.id = newId.toString(); // convertimos el nuevo id a string

  products.push(newProduct);
  fs.writeFileSync("../data/productos.json", JSON.stringify(products, null, 2));
  res.json(newProduct);
});

// Ruta PUT para actualizar un producto por id
router.put("/:pid", (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;
  const products = JSON.parse(
    fs.readFileSync("../data/productos.json", "utf-8")
  );
  const productIndex = products.findIndex((p) => p.id === pid);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedProduct };
    fs.writeFileSync("../data/productos.json", JSON.stringify(products));
    res.json(products[productIndex]);
  } else {
    res.status(404).send(`Producto con id ${pid} no encontrado`);
  }
});

// Ruta DELETE para eliminar un producto por id
router.delete("/:pid", (req, res) => {
  const pid = req.params.pid;
  const products = JSON.parse(
    fs.readFileSync("../data/productos.json", "utf-8")
  );
  const newProducts = products.filter((p) => p.id !== pid);
  fs.writeFileSync("../data/productos.json", JSON.stringify(newProducts));
  res.send(`Producto con id ${pid} eliminado`);
});

module.exports = router;
