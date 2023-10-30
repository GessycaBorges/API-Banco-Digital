const { bancoCubos } = require("../../bancodedados");
const { procurarConta } = require("../../funcoesAuxiliares");

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;
    
    if (!numero_conta || !senha){
        return res.status(400).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numero_conta);
    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    };

    if (senha !== contaProcurada.usuario.senha){
        return res.status(401).json({ "mensagem": "A senha informada é inválida!" });
    };

    return res.status(200).json( { saldo: contaProcurada.saldo});
};

module.exports = {
    consultarSaldo
}