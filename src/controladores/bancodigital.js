let { bancoCubos, identificadorDeContas } = require("../bancodedados");
const { dadoProcuradoUsuario, procurarConta, data, filtrarDados } = require("../funcoesAuxiliares");

//--------------- LISTAR CONTAS BANCÁRIAS ---------------
const listarContas = (req, res) => {
    return res.status(200).json(bancoCubos.contas);
};

//--------------- CRIAR CONTAS BANCÁRIAS ---------------
const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    
    // Todos os campos são obrigatórios
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return res.status(404).json({ "mensagem": "Todos os dados precisam ser informados!" });
    }

    // CPF e email devem ser um campo único
    const cpfProcurado = dadoProcuradoUsuario(bancoCubos.contas, "cpf", cpf);
    const emailProcurado = dadoProcuradoUsuario(bancoCubos.contas, "email", email);
    if (cpfProcurado || emailProcurado) {
        return res.status(404).json({ "mensagem": "Já existe uma conta com o cpf ou e-mail informado!" });
    };
    
    // Criar uma nova conta
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

//--------------- ATUALIZAR DADOS ---------------
const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    // Todos os campos são obrigatórios
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha){
        return res.status(404).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    //Verificar se o numero da conta é válido
    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numeroConta);
    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "O número da conta informado não existe!" });
    };

    //Verificar se já existe CPF ou email
    const demaisContas = bancoCubos.contas.filter((conta) => {
        return conta.numero !== Number(numeroConta);
    });

    const cpfProcurado = dadoProcuradoUsuario(demaisContas, "cpf", cpf);
    const emailProcurado = dadoProcuradoUsuario(demaisContas, "email", email);
    if (cpfProcurado || emailProcurado) {
        return res.status(404).json({ "mensagem": "Já existe cadastro com o cpf ou e-mail informado!" });
    };

    //Atualizar os dados do usuário de uma conta bancária
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

//--------------- EXCLUIR CONTA ---------------
const excluirConta = (req,res) => {
    const { numeroConta } = req.params;

    //Verificar se o numero da conta é válido
    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numeroConta);
    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "O número da conta informado não existe!" });
    };
    
    //Permitir excluir apenas se o saldo for 0 (zero)
    if (contaProcurada.saldo !== 0) {
        return res.status(404).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" });
    }

    //Remover a conta
    bancoCubos.contas = bancoCubos.contas.filter((conta) => {
        return conta !== contaProcurada;
    })

    return res.status(204).json();
};

//--------------- DEPOSITAR ---------------
const depositar = (req,res) =>{
    const { numero_conta, valor } = req.body;

    //Verificar se os dados foram informados no body
    if (!numero_conta || !valor){
        return res.status(404).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    //Verificar se a conta bancária informada existe
    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numero_conta);
    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta inválida!" });
    };

    //Não permitir depósitos com valores negativos ou zerados
    if (valor <= 0){
        return res.status(404).json({ "mensagem": "O valor não pode ser menor que zero!" });
    };

    //Somar o valor de depósito ao saldo da conta encontrada
    contaProcurada.saldo += valor;
    
    //Registrar depósito
    bancoCubos.depositos.push({
        data,
        numero_conta,
        valor
    });

    return res.status(204).json();
};

//--------------- SACAR ---------------
const sacar = (req, res) => {
    const { numero_conta, valor, senha} = req.body;
    
    //Verificar se os dados foram informados no body
    if (!numero_conta || !valor || !senha){
        return res.status(404).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    //Verificar se a conta existe
    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numero_conta);
    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta inválida!" });
    };

    //Verificar se a senha informada é válida
    const senhaProcurada = dadoProcuradoUsuario(bancoCubos.contas, "senha", senha);
    if (!senhaProcurada){
        return res.status(404).json({ "mensagem": "A senha informada é inválida!" });
    };

    //Verificar se há saldo disponível para saque
    if (contaProcurada.saldo < valor){
        return res.status(404).json({ "mensagem": "Saldo insuficiente!" });
    };

    //Subtrair o valor sacado do saldo da conta encontrada
    contaProcurada.saldo -= valor;

    //Registrar saque
    bancoCubos.saques.push({
        data,
        numero_conta,
        valor
    });

    return res.status(204).json();
};

//--------------- TRASFERIR ---------------
const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha} = req.body;
    
    //Verificar se os dados foram informados no body
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha){
        return res.status(404).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    //Verificar se a conta bancária de origem existe
    const contaDeOrigem = procurarConta (bancoCubos.contas, "numero", numero_conta_origem);
        if (!contaDeOrigem){
        return res.status(404).json({ "mensagem": "Conta de origem inválida!" });
    };

    //Verificar se a conta bancária de destino existe
    const contaDeDestino = procurarConta (bancoCubos.contas, "numero", numero_conta_destino);
    if (!contaDeDestino){
        return res.status(404).json({ "mensagem": "Conta de destino inválida!" });
    };

    //Verificar se a senha informada é válida para a conta de origem
    if (senha !== contaDeOrigem.usuario.senha){
        return res.status(404).json({ "mensagem": "A senha informada é inválida!" });
    };
    
    //Verificar se há saldo disponível na conta de origem
    if (contaDeOrigem.saldo < valor){
        return res.status(404).json({ "mensagem": "Saldo insuficiente!" });
    };

    //Subtrair o valor na conta de origem e somar o valor na conta de destino
    contaDeOrigem.saldo -= valor;
    contaDeDestino.saldo += valor;

    //Registrar transferência
    bancoCubos.transferencias.push({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    });
    
    return res.status(204).json();
};

//--------------- CONSULTAR SALDO ---------------
const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;
    
    //Verificar se os dados foram informados
    if (!numero_conta || !senha){
        return res.status(404).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    //Verificar se a conta bancária informada existe
    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numero_conta);
    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    };

    //Verificar se a senha informada é válida
    if (senha !== contaProcurada.usuario.senha){
        return res.status(404).json({ "mensagem": "A senha informada é inválida!" });
    };

    //Exibir o saldo da conta bancária em questão
    return res.status(200).json( { saldo: contaProcurada.saldo});
};

//--------------- EMITIR EXTRATO ---------------
const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;
    
    //Verificar se os dados foram informados
    if (!numero_conta || !senha){
        return res.status(404).json({ "mensagem": "Todos os dados precisam ser informados!" });
    };

    //Verificar se a conta bancária informada existe
    const contaProcurada = procurarConta (bancoCubos.contas, "numero", numero_conta);
    if (!contaProcurada){
        return res.status(404).json({ "mensagem": "Conta bancária não encontada!" });
    };

    //Verificar se a senha informada é válida
    if (senha !== contaProcurada.usuario.senha){
        return res.status(404).json({ "mensagem": "A senha informada é inválida!" });
    };

    //Retornar a lista de transferências, depósitos e saques
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