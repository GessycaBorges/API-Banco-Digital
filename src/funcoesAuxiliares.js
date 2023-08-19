const { format } = require("date-fns");

function dadoProcuradoUsuario (local, dado, dadoQuery) {
    const resultado = local.find((conta) => {
        return conta.usuario[dado] === dadoQuery;
    });
    return resultado;
};

function procurarConta (local, numeroProcurado, numeroInformado) {
    const resultado = local.find((conta) => {
        return conta[numeroProcurado] === Number(numeroInformado);
    });
    return resultado;
};

const data = format(new Date(), "yyyy-MM-dd HH:mm:ss");

function filtrarDados (local,numeroFornecido, numeroComparar){
    const resultado = local.filter((acao) => {
        return acao[numeroFornecido] === numeroComparar;
    })
    return resultado
};

module.exports = {
    dadoProcuradoUsuario,
    procurarConta,
    data,
    filtrarDados
};