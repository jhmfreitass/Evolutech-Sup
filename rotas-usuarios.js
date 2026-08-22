const express = require("express");
const db = require("./banco");

const router = express.Router();

// ========================================
// CADASTRAR USUÁRIO
// ========================================
router.post("/usuarios", (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Preencha todos os campos."
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "A senha precisa ter pelo menos 6 caracteres."
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        // Não permite cadastrar o administrador
        if (emailNormalizado === "jhmourafreitas@gmail.com") {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Este e-mail pertence ao administrador."
            });
        }

        // Verifica se o e-mail já existe
        const usuarioExistente = db.prepare(`
            SELECT id
            FROM usuarios
            WHERE email = ?
        `).get(emailNormalizado);

        if (usuarioExistente) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Este e-mail já está cadastrado!"
            });
        }

        // Cria o usuário
        const resultado = db.prepare(`
            INSERT INTO usuarios
            (nome, email, senha, cargo, setor)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            nome.trim(),
            emailNormalizado,
            senha,
            "",
            ""
        );

        return res.status(201).json({
            sucesso: true,
            mensagem: "Cadastro realizado com sucesso!",
            id: resultado.lastInsertRowid
        });

    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);

        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro interno do servidor."
        });
    }
});

module.exports = router;