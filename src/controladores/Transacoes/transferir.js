const { bancoCubos } = require("../../bancodedados");
const { procurarConta, data } = require("../../funcoesAuxiliares");

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha} = req.body;
    
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha){
        return res.status(400).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    const contaDeOrigem = procurarConta (bancoCubos.contas, "numero", numero_conta_origem);
        if (!contaDeOrigem){
        return res.status(404).json({ "mensagem": "Conta de origem inválida!" });
    };

    const contaDeDestino = procurarConta (bancoCubos.contas, "numero", numero_conta_destino);
    if (!contaDeDestino){
        return res.status(404).json({ "mensagem": "Conta de destino inválida!" });
    };

    if (senha !== contaDeOrigem.usuario.senha){
        return res.status(401).json({ "mensagem": "A senha informada é inválida!" });
    };
    
    if (contaDeOrigem.saldo < valor){
        return res.status(403).json({ "mensagem": "Saldo insuficiente!" });
    };

    contaDeOrigem.saldo -= valor;
    contaDeDestino.saldo += valor;

    bancoCubos.transferencias.push({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    });
    
    return res.status(204).json();
};

module.exports = {
    transferir
}