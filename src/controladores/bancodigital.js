let { bancoCubos, identificadorDeContas } = require("../bancodedados");

//Listar contas bancárias
const listarContas = (req, res) => {
    return res.status(200).json(bancoCubos.contas);
};

//Criar conta bancária
const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    
    // Verificar se todos os campos foram informados (todos são obrigatórios)
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return res.status(404).json({ "mensagem": "Todos os dados precisam ser informados" });
    }

    // CPF deve ser um campo único
    const cpfProcurado = bancoCubos.contas.find ((conta) => {
        return conta.usuario.cpf === cpf;
    });

    // E-mail deve ser um campo único
    const emailProcurado = bancoCubos.contas.find ((conta) => {
        return conta.usuario.email === email;
    });

    if (cpfProcurado || emailProcurado) {
        return res.status(404).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" })
    };
    
    // Criar uma nova conta cujo número é único
    // Definir o saldo inicial da conta como 0
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
    }

    bancoCubos.contas.push(contaCliente);
    
    return res.status(200).json();
};

//Atualizar os dados do usuário da conta bancária
const atualizarConta = (req,res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    //Verificar se foi passado todos os campos no body da requisição
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return res.status(404).json({ "mensagem": "Todos os dados precisam ser informados" });
    }

    //Verificar se o numero da conta passado como parametro na URL é válida
    const contaProcurada = bancoCubos.contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    //Se o CPF for informado, verificar se já existe outro registro com o mesmo CPF
    const cpfProcurado = bancoCubos.contas.find ((conta) => {
        return conta.usuario.cpf === cpf;
    });
    
    //Se o E-mail for informado, verificar se já existe outro registro com o mesmo E-mail
    const emailProcurado = bancoCubos.contas.find ((conta) => {
        return conta.usuario.email === email;
    });

    if (cpfProcurado || emailProcurado) {
        return res.status(404).json({ "mensagem": "Já existe cadastro com o cpf ou e-mail informado!" });
    };

    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "O número da conta informado não existe" })
    }

    //Atualizar os dados do usuário de uma conta bancária
    contaProcurada.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }

    return res.status(200).json();
}

//Excluir uma conta bancária
const excluirConta = (req,res) => {
    const { numeroConta } = req.params;

    //Verificar se o numero da conta passado como parametro na URL é válido
    const contaProcurada = bancoCubos.contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "O número da conta informado não existe" });
    };
    
    //Permitir excluir uma conta bancária apenas se o saldo for 0 (zero)
    if (contaProcurada.saldo !== 0) {
        return res.status(404).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" });
    }

    //Remover a conta do objeto de persistência de dados.
    bancoCubos.contas = bancoCubos.contas.filter((conta) => {
        return conta !== contaProcurada;
    })

    return res.status(200).json();
}

//Depósitar em uma conta bancária
//Sacar de uma conta bancária
//Transferir valores entre contas bancárias
//Consultar saldo da conta bancária
//Emitir extrato bancário

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta
}