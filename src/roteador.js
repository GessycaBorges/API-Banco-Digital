//Rotas
const express = require("express");
const controladores = require("./controladores/bancodigital");
const { validarSenha } = require("./intermediarios");

const rotas = express();

rotas.use(express.json());

rotas.get("/contas", validarSenha, controladores.listarContas);
rotas.post("/contas", validarSenha, controladores.criarConta);
rotas.put("/contas/:numeroConta/usuario", validarSenha, controladores.atualizarConta);
rotas.delete("/contas/:numeroConta", validarSenha, controladores.excluirConta);

module.exports = rotas;