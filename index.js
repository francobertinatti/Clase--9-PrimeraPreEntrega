const express = require("express");
const productsRouter = require("./products");
const cartsRouter = require("./carts");

const app = express();
app.use(express.json());
const PORT = 8080;

app.get("/", (req, res) => {
  res.send("¡Bienvenido a mi sitio!");
});

// Middleware para poder parsear el JSON del body de las peticiones
app.use(express.json());

// Manejador de errores genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

// Rutas para manejar los productos
app.use("/productos", productsRouter);

// Rutas para manejar los carritos
app.use("/carritos", cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor express escuchando en el puerto ${PORT}`);
});
