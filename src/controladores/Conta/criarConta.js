const { bancoCubos, identificadorDeContas } = require("../../bancodedados");
const { dadoProcuradoUsuario } = require("../../funcoesAuxiliares");

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return res.status(400).json({ "mensagem": "Todos os dados precisam ser informados!" });
    }

    const cpfProcurado = dadoProcuradoUsuario(bancoCubos.contas, "cpf", cpf);
    const emailProcurado = dadoProcuradoUsuario(bancoCubos.contas, "email", email);

    if (cpfProcurado || emailProcurado) {
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    };
    
    const contaCliente = {
        numero: identificadorDeContas++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };

    bancoCubos.contas.push(contaCliente);
    
    return res.status(204).json();
};

module.exports = {
    criarConta
}