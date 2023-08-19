let { bancoCubos, identificadorDeContas } = require("../bancodedados");
const { format } = require("date-fns");

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
const depositar = (req,res) =>{
    const { numero_conta, valor } = req.body;

    //Verificar se o numero da conta e o valor do deposito foram informados no body
    if (!numero_conta || !valor){
        return res.status(404).json({ "mensagem": "O número da conta e o valor são obrigatórios!" });
    }

    //Verificar se a conta bancária informada existe
    const contaProcurada = bancoCubos.contas.find ((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta inválida!" });
    }

    //Não permitir depósitos com valores negativos ou zerados
    if (valor <= 0){
        return res.status(404).json({ "mensagem": "O valor não pode ser menor que zero!" });
    }

    //Somar o valor de depósito ao saldo da conta encontrada
    contaProcurada.saldo += valor;
    
    //Registrar depósito
    const data = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    bancoCubos.depositos.push({
        data,
        numero_conta,
        valor
    });

    return res.status(200).json();
}

//Sacar de uma conta bancária
const sacar = (req, res) => {
    //Verificar se o numero da conta, o valor do saque e a senha foram informados no body
    const { numero_conta, valor, senha} = req.body;

    if (!numero_conta || !valor || !senha){
        return res.status(404).json({ "mensagem": "O número da conta, o valor e a senha são obrigatórios!" });
    }

    //Verificar se a conta bancária informada existe
    const contaProcurada = bancoCubos.contas.find ((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta inválida!" });
    }

    //Verificar se a senha informada é uma senha válida para a conta informada
    const senhaProcurada = bancoCubos.contas.find ((conta) => {
        return conta.usuario.senha === senha;
    });

    if (!senhaProcurada){
        return res.status(404).json({ "mensagem": "A senha informada é inválida!" });
    }

    //Verificar se há saldo disponível para saque
    if (contaProcurada.saldo < valor){
        return res.status(404).json({ "mensagem": "Saldo insuficiente!" });
    }

    //Subtrair o valor sacado do saldo da conta encontrada
    contaProcurada.saldo -= valor;

    //Registrar saque
    const data = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    bancoCubos.saques.push({
        data,
        numero_conta,
        valor
    });

    return res.status(200).json();
}

//Transferir valores entre contas bancárias
const transferir = (req, res) => {
    //Verificar se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados no body
    const { numero_conta_origem, numero_conta_destino, valor, senha} = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha){
        return res.status(404).json({ "mensagem": "O número das contas de origem e de destino, o valor e a senha são obrigatórios!" });
    }

    //Verificar se a conta bancária de origem informada existe
    const contaDeOrigem = bancoCubos.contas.find ((conta) => {
        return conta.numero === Number(numero_conta_origem);
    });
    if (!contaDeOrigem){
        return res.status(404).json({ "mensagem": "Conta de origem inválida!" });
    }

    //Verificar se a conta bancária de destino informada existe
    const contaDeDestino = bancoCubos.contas.find ((conta) => {
        return conta.numero === Number(numero_conta_destino);
    });

    if (!contaDeDestino){
        return res.status(404).json({ "mensagem": "Conta de destino inválida!" });
    }

    //Verificar se a senha informada é uma senha válida para a conta de origem informada
    if (senha !== contaDeOrigem.usuario.senha){
        return res.status(404).json({ "mensagem": "A senha informada é inválida!" });
    }
    
    //Verificar se há saldo disponível na conta de origem para a transferência
    if (contaDeOrigem.saldo < valor){
        return res.status(404).json({ "mensagem": "Saldo insuficiente!" });
    }

    //Subtrair o valor da transfência do saldo na conta de origem
    contaDeOrigem.saldo -= valor;

    //Somar o valor da transferência no saldo da conta de destino
    contaDeDestino.saldo += valor;

    //Registrar transferência
    const data = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    bancoCubos.transferencias.push({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    });
    
    return res.status(200).json();
}

//Consultar saldo da conta bancária
const consultarSaldo = (req, res) => {
    //Verificar se o numero da conta e a senha foram informadas (passado como query params na url)
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha){
        return res.status(404).json({ "mensagem": "O número da conta e a senha são obrigatórios!" });
    }

    //Verificar se a conta bancária informada existe
    const contaProcurada = bancoCubos.contas.find ((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    //Verificar se a senha informada é uma senha válida
    if (senha !== contaProcurada.usuario.senha){
        return res.status(404).json({ "mensagem": "A senha informada é inválida!" });
    }

    //Exibir o saldo da conta bancária em questão
    return res.status(200).json( { saldo: contaProcurada.saldo});
}

//Emitir extrato bancário
const extrato = (req, res) => {
    //Verificar se o numero da conta e a senha foram informadas (passado como query params na url)
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha){
        return res.status(404).json({ "mensagem": "O número da conta e a senha são obrigatórios!" });
    }

    //Verificar se a conta bancária informada existe
    const contaProcurada = bancoCubos.contas.find ((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    }

    //Verificar se a senha informada é uma senha válida
    if (senha !== contaProcurada.usuario.senha){
        return res.status(404).json({ "mensagem": "A senha informada é inválida!" });
    }

    //Retornar a lista de transferências, depósitos e saques da conta em questão.
    const depositos = bancoCubos.depositos.filter ((deposito) => {
        return deposito.numero_conta === numero_conta;
    });
    const saques = bancoCubos.saques.filter ((saque) => {
        return saque.numero_conta === numero_conta;
    });
    const trasferenciasEnviadas = bancoCubos.transferencias.filter ((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta;
    });
    const trasferenciasRecebidas = bancoCubos.transferencias.filter ((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta;
    });

    const extrato ={
        depositos,
        saques,
        trasferenciasEnviadas,
        trasferenciasRecebidas
    }
    console.log(extrato)
    return res.status(200).json(extrato);
}

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    extrato
}