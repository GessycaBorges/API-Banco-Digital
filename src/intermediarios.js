const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    // Caso a senha não seja informada ou seja informada de forma incorreta
    if (!senha_banco || senha_banco !== "Cubos123Bank"){
        return res.status(404).json({ "mensagem": "A senha do banco informada é inválida!" });
    }

    // A senha sendo correta
    next();
};

module.exports = {
    validarSenha
};