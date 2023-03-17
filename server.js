const express = require("express");
const productosRouter = require("./products");
const carritoRouter = require("./carts");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static("public"));

app.use("/productos", productosRouter);
app.use("/carrito", carritoRouter);

app.listen(port, () => {
  console.log(`Server ejecutandose en PUERTO : ${port}`);
});
