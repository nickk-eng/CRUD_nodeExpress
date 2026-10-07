const express = require("express");
const jsonServer = require("json-server");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", jsonServer.bodyParser, router);

app.get("/", (_req, res) => res.redirect("/get/"));

app.listen(port, () => {
  console.log(`Aplicação disponível na porta ${port}`);
});
