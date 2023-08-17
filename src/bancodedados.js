const bancoCubos = {
    banco: {
        nome: 'Cubos Bank',
        numero: '123',
        agencia: '0001',
        senha: 'Cubos123Bank'
    },
    contas: [],
    saques: [],
    depositos: [],
    transferencias: []
};

let identificadorDeContas = 1;

module.exports = {
    bancoCubos,
    identificadorDeContas
};