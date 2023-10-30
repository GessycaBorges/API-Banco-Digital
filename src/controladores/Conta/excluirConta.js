const { bancoCubos } = require("../../bancodedados");
const { procurarConta } = require("../../funcoesAuxiliares");

const excluirConta = (req,res) => {
    const { numeroConta } = req.params;

    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numeroConta);
    if (!contaProcurada){
        return res.status(400).json({ "mensagem": "O número da conta informado não existe!" });
    };
    
    if (contaProcurada.saldo !== 0) {
        return res.status(403).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" });
    }

    bancoCubos.contas = bancoCubos.contas.filter((conta) => {
        return conta !== contaProcurada;
    })

    return res.status(204).json();
};

module.exports = {
    excluirConta
}