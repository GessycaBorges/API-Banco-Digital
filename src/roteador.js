const express = require("express");
const { validarSenha } = require("./intermediarios");
const { listarContas } = require("./controladores/Conta/listarContas");
const { criarConta } = require("./controladores/Conta/criarConta");
const { atualizarConta } = require("./controladores/Conta/atualizarDadosDaConta");
const { excluirConta } = require("./controladores/Conta/excluirConta");
const { depositar } = require("./controladores/Transacoes/depositar");
const { sacar } = require("./controladores/Transacoes/sacar");
const { transferir } = require("./controladores/Transacoes/transferir");
const { consultarSaldo } = require("./controladores/Transacoes/consultarSaldo");
const { extrato } = require("./controladores/Transacoes/emitirExtrato");

const rotas = express();

rotas.use(express.json());

rotas.get("/contas", validarSenha, listarContas);
rotas.post("/contas", criarConta);
rotas.put("/contas/:numeroConta/usuario", atualizarConta);
rotas.delete("/contas/:numeroConta", excluirConta);

rotas.post("/transacoes/depositar", depositar);
rotas.post("/transacoes/sacar", sacar);
rotas.post("/transacoes/transferir", transferir);
rotas.get("/contas/saldo", consultarSaldo);
rotas.get("/contas/extrato", extrato);

module.exports = rotas;