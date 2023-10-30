const { bancoCubos } = require("../../bancodedados");
const { dadoProcuradoUsuario, procurarConta } = require("../../funcoesAuxiliares");

const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return res.status(400).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numeroConta);
    if (!contaProcurada){
        return res.status(400).json({ "mensagem": "O número da conta informado não existe!" });
    };

    const demaisContas = bancoCubos.contas.filter((conta) => {
        return conta.numero !== Number(numeroConta);
    });

    const cpfProcurado = dadoProcuradoUsuario(demaisContas, "cpf", cpf);
    const emailProcurado = dadoProcuradoUsuario(demaisContas, "email", email);
    if (cpfProcurado || emailProcurado) {
        return res.status(400).json({ "mensagem": "Já existe cadastro com o cpf ou e-mail informado!" });
    };

    contaProcurada.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    };

    return res.status(204).json();
};

module.exports = {
    atualizarConta
}