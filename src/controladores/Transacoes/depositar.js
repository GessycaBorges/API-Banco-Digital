const { bancoCubos } = require("../../bancodedados");
const { procurarConta, data } = require("../../funcoesAuxiliares");

const depositar = (req,res) =>{
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor){
        return res.status(400).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numero_conta);
    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta inválida!" });
    };

    if (valor <= 0){
        return res.status(403).json({ "mensagem": "O valor não pode ser menor que zero!" });
    };

    contaProcurada.saldo += valor;
    
    bancoCubos.depositos.push({
        data,
        numero_conta,
        valor
    });

    return res.status(204).json();
};

module.exports = {
    depositar
}
