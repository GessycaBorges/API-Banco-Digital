const { bancoCubos } = require("../../bancodedados");
const { procurarConta, filtrarDados } = require("../../funcoesAuxiliares");

const extrato = (req, res) => {
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

    const depositos = filtrarDados(bancoCubos.depositos, "numero_conta", numero_conta);
    const saques = filtrarDados(bancoCubos.saques, "numero_conta", numero_conta);
    const trasferenciasEnviadas = filtrarDados(bancoCubos.transferencias, "numero_conta_origem", numero_conta);
    const trasferenciasRecebidas = filtrarDados(bancoCubos.transferencias, "numero_conta_destino", numero_conta);

    const extrato ={
        depositos,
        saques,
        trasferenciasEnviadas,
        trasferenciasRecebidas
    };

    return res.status(200).json(extrato);
};

module.exports = {
    extrato
}