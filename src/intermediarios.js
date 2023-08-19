const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    // senha não informada ou informada de forma incorreta
    if (!senha_banco || senha_banco !== "Cubos123Bank"){
        return res.status(404).json({ "mensagem": "A senha do banco informada é inválida!" });
    };

    next();
};

module.exports = {
    validarSenha
};