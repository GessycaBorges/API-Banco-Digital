//Desafio Módulo 2 - Back-end
const express = require("express");
const rotas = require("./roteador");

const app = express();

app.use(express.json());
app.use(rotas);

app.listen(3000); //Porta 3000