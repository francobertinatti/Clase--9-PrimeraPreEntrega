const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const productosFilePath = path.join(__dirname, "data", "productos.json");

router.get("/", (req, res) => {
  fs.readFile(productosFilePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const productos = JSON.parse(data);
    const limit = req.query.limit;
    if (limit) {
      res.json(productos.slice(0, limit));
    } else {
      res.json(productos);
    }
  });
});

router.get("/:pid", (req, res) => {
  const pid = req.params.pid;
  fs.readFile(productosFilePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const productos = JSON.parse(data);
    const producto = productos.find((p) => p.id.toString() === pid.toString());
    if (!producto) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(producto);
  });
});

router.post("/", (req, res) => {
  const producto = req.body;
  const requiredFields = [
    "title",
    "description",
    "code",
    "price",
    "stock",
    "category",
  ];

  // Verifica si los campos requeridos están presentes
  const missingFields = requiredFields.filter((field) => !(field in producto));
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Faltan los siguientes campos obligatorios: ${missingFields.join(
        ", "
      )}`,
    });
  }

  // Genera el nuevo ID
  fs.readFile(productosFilePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const productos = JSON.parse(data);
    const ids = productos.map((p) => p.id);
    const maxId = Math.max(...ids);
    const newId = maxId + 1;
    producto.id = newId;

    // Agrega el nuevo producto
    productos.push(producto);
    fs.writeFile(productosFilePath, JSON.stringify(productos), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(201).json(producto);
    });
  });
});

router.put("/:pid", (req, res) => {
  const pid = req.params.pid;
  const productoActualizado = req.body;
  fs.readFile(productosFilePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const productos = JSON.parse(data);
    const productoIndex = productos.findIndex(
      (p) => p.id.toString() === pid.toString()
    );
    if (productoIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    const producto = productos[productoIndex];
    const productoActualizadoConId = {
      ...productoActualizado,
      id: producto.id,
    };
    const productosActualizados = [
      ...productos.slice(0, productoIndex),
      productoActualizadoConId,
      ...productos.slice(productoIndex + 1),
    ];
    fs.writeFile(
      productosFilePath,
      JSON.stringify(productosActualizados),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.json(productoActualizadoConId);
      }
    );
  });
});

router.delete("/:pid", (req, res) => {
  const pid = req.params.pid;
  fs.readFile(productosFilePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    const productos = JSON.parse(data);
    const productoIndex = productos.findIndex(
      (p) => p.id.toString() === pid.toString()
    );
    if (productoIndex === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    const productoEliminado = productos.splice(productoIndex, 1)[0];
    fs.writeFile(productosFilePath, JSON.stringify(productos), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(productoEliminado);
    });
  });
});

module.exports = router;
