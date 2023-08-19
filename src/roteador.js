//Rotas
const express = require("express");
const controladores = require("./controladores/bancodigital");
const { validarSenha } = require("./intermediarios");

const rotas = express();

rotas.use(express.json());

rotas.get("/contas", validarSenha, controladores.listarContas);
rotas.post("/contas", controladores.criarConta);
rotas.put("/contas/:numeroConta/usuario", controladores.atualizarConta);
rotas.delete("/contas/:numeroConta", controladores.excluirConta);
rotas.post("/transacoes/depositar", controladores.depositar);
rotas.post("/transacoes/sacar", controladores.sacar);
rotas.post("/transacoes/transferir", controladores.transferir);
rotas.get("/contas/saldo", controladores.consultarSaldo);
rotas.get("/contas/extrato", controladores.extrato)

module.exports = rotas;