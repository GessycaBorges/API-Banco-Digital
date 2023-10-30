const { bancoCubos } = require("../../bancodedados");
const { dadoProcuradoUsuario, procurarConta, data } = require("../../funcoesAuxiliares");

const sacar = (req, res) => {
    const { numero_conta, valor, senha} = req.body;
    
    if (!numero_conta || !valor || !senha){
        return res.status(400).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numero_conta);
    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta inválida!" });
    };

    const senhaProcurada = dadoProcuradoUsuario(bancoCubos.contas, "senha", senha);
    if (!senhaProcurada){
        return res.status(401).json({ "mensagem": "A senha informada é inválida!" });
    };

    if (contaProcurada.saldo < valor){
        return res.status(403).json({ "mensagem": "Saldo insuficiente!" });
    };

    contaProcurada.saldo -= valor;

    bancoCubos.saques.push({
        data,
        numero_conta,
        valor
    });

    return res.status(204).json();
};

module.exports = {
    sacar
}