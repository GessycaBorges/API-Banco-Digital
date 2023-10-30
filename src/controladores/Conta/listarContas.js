const { bancoCubos } = require("../../bancodedados");

const listarContas = (req, res) => {
    return res.status(200).json(bancoCubos.contas);
};

module.exports = {
    listarContas
}