const express = require("express");
const path = require("path");
const db = require("./banco");

const app = express();

const PORTA = 3000;


// =====================================================
// CONFIGURAÇÕES
// =====================================================

app.use(express.json());


// =====================================================
// CORS
// Permite que o Live Server converse com o Node
// =====================================================

app.use(
    function (req, res, next) {

        res.header(
            "Access-Control-Allow-Origin",
            "*"
        );

        res.header(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,DELETE,OPTIONS"
        );

        res.header(
            "Access-Control-Allow-Headers",
            "Content-Type"
        );


        if (req.method === "OPTIONS") {

            return res.sendStatus(200);

        }


        next();

    }
);


// =====================================================
// ARQUIVOS DO SITE
// =====================================================

app.use(
    express.static(
        path.join(__dirname)
    )
);


// =====================================================
// TABELA DE CHAMADOS
// =====================================================

db.exec(`

    CREATE TABLE IF NOT EXISTS chamados (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        titulo TEXT NOT NULL,

        categoria TEXT NOT NULL,

        prioridade TEXT NOT NULL,

        setor TEXT NOT NULL,

        descricao TEXT NOT NULL,

        solicitante TEXT NOT NULL,

        email TEXT NOT NULL,

        status TEXT NOT NULL
            DEFAULT 'Aberto',

        data TEXT NOT NULL

    )

`);

console.log(
    "Tabela de chamados pronta!"
);


// =====================================================
// LOGIN
// =====================================================

app.post(
    "/api/login",
    (req, res) => {

        try {

            const {
                email,
                senha
            } = req.body;


            if (
                !email ||
                !senha
            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "Informe o e-mail e a senha."

                });

            }


            const usuario =
                db.prepare(`

                    SELECT

                        id,
                        nome,
                        email,
                        senha,
                        cargo

                    FROM usuarios

                    WHERE LOWER(email)
                        = LOWER(?)

                    LIMIT 1

                `).get(email);


            if (!usuario) {

                return res.status(401).json({

                    sucesso: false,

                    mensagem:
                        "E-mail ou senha incorretos."

                });

            }


            if (
                usuario.senha !== senha
            ) {

                return res.status(401).json({

                    sucesso: false,

                    mensagem:
                        "E-mail ou senha incorretos."

                });

            }


            res.json({

                sucesso: true,

                mensagem:
                    "Login realizado com sucesso!",

                usuario: {

                    id:
                        usuario.id,

                    nome:
                        usuario.nome,

                    email:
                        usuario.email,

                    cargo:
                        usuario.cargo ||
                        "Usuário"

                }

            });


        } catch (erro) {

            console.error(
                "Erro durante o login:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro interno ao realizar login."

            });

        }

    }
);


// =====================================================
// CADASTRAR USUÁRIO
// =====================================================

app.post(
    "/api/usuarios",
    (req, res) => {

        try {

            const {
                nome,
                email,
                senha,
                cargo
            } = req.body;


            if (
                !nome ||
                !email ||
                !senha
            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "Preencha nome, e-mail e senha."

                });

            }


            const cargoFinal =
                cargo ||
                "Usuário";


            const inserir =
                db.prepare(`

                    INSERT INTO usuarios

                    (
                        nome,
                        email,
                        senha,
                        cargo
                    )

                    VALUES (?, ?, ?, ?)

                `);


            const resultado =
                inserir.run(
                    nome,
                    email,
                    senha,
                    cargoFinal
                );


            res.json({

                sucesso: true,

                mensagem:
                    "Usuário cadastrado com sucesso!",

                id:
                    resultado.lastInsertRowid

            });


        } catch (erro) {

            if (
                erro.code ===
                "SQLITE_CONSTRAINT_UNIQUE"
            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "Este e-mail já está cadastrado."

                });

            }


            console.error(
                "Erro ao cadastrar usuário:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao cadastrar usuário."

            });

        }

    }
);


// =====================================================
// LISTAR USUÁRIOS
// =====================================================

app.get(
    "/api/usuarios",
    (req, res) => {

        try {

            const usuarios =
                db.prepare(`

                    SELECT

                        id,
                        nome,
                        email,
                        cargo

                    FROM usuarios

                    ORDER BY id DESC

                `).all();


            res.json(
                usuarios
            );


        } catch (erro) {

            console.error(
                "Erro ao buscar usuários:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao buscar usuários."

            });

        }

    }
);


// =====================================================
// LISTAR TÉCNICOS
// =====================================================

app.get(
    "/api/tecnicos",
    (req, res) => {

        try {

            const tecnicos =
                db.prepare(`

                    SELECT

                        id,
                        nome,
                        email,
                        cargo

                    FROM usuarios

                    WHERE cargo = 'Técnico'

                    ORDER BY nome ASC

                `).all();


            res.json(
                tecnicos
            );


        } catch (erro) {

            console.error(
                "Erro ao buscar técnicos:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao buscar técnicos."

            });

        }

    }
);


// =====================================================
// ALTERAR CARGO
// =====================================================

app.put(
    "/api/usuarios/:id",
    (req, res) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            const {
                cargo
            } = req.body;


            const cargosPermitidos = [

                "Administrador",

                "Técnico",

                "Funcionário",

                "Usuário"

            ];


            if (
                !cargosPermitidos.includes(
                    cargo
                )
            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "Cargo inválido."

                });

            }


            const usuario =
                db.prepare(`

                    SELECT

                        id,
                        nome,
                        email,
                        cargo

                    FROM usuarios

                    WHERE id = ?

                `).get(id);


            if (!usuario) {

                return res.status(404).json({

                    sucesso: false,

                    mensagem:
                        "Usuário não encontrado."

                });

            }


            db.prepare(`

                UPDATE usuarios

                SET cargo = ?

                WHERE id = ?

            `).run(
                cargo,
                id
            );


            res.json({

                sucesso: true,

                mensagem:
                    "Cargo atualizado com sucesso!",

                usuario: {

                    id:
                        usuario.id,

                    nome:
                        usuario.nome,

                    email:
                        usuario.email,

                    cargo:
                        cargo

                }

            });


        } catch (erro) {

            console.error(
                "Erro ao atualizar cargo:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao atualizar cargo."

            });

        }

    }
);


// =====================================================
// EXCLUIR USUÁRIO
// =====================================================

app.delete(
    "/api/usuarios/:id",
    (req, res) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            const usuario =
                db.prepare(`

                    SELECT

                        id,
                        nome,
                        email

                    FROM usuarios

                    WHERE id = ?

                `).get(id);


            if (!usuario) {

                return res.status(404).json({

                    sucesso: false,

                    mensagem:
                        "Usuário não encontrado."

                });

            }


            db.prepare(`

                DELETE FROM usuarios

                WHERE id = ?

            `).run(id);


            res.json({

                sucesso: true,

                mensagem:
                    "Usuário excluído com sucesso!"

            });


        } catch (erro) {

            console.error(
                "Erro ao excluir usuário:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao excluir usuário."

            });

        }

    }
);


// =====================================================
// CRIAR CHAMADO
// =====================================================

app.post(
    "/api/chamados",
    (req, res) => {

        try {

            const {

                titulo,

                categoria,

                prioridade,

                descricao,

                solicitante,

                email

            } = req.body;


            if (

                !titulo ||

                !categoria ||

                !prioridade ||

                !descricao ||

                !solicitante ||

                !email

            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "Preencha todos os campos do chamado."

                });

            }


            const setor =
                "Não informado";


            const data =
                new Date()
                    .toLocaleDateString(
                        "pt-BR"
                    );


            const inserir =
                db.prepare(`

                    INSERT INTO chamados

                    (

                        titulo,

                        categoria,

                        prioridade,

                        setor,

                        descricao,

                        solicitante,

                        email,

                        status,

                        data

                    )

                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

                `);


            const resultado =
                inserir.run(

                    titulo,

                    categoria,

                    prioridade,

                    setor,

                    descricao,

                    solicitante,

                    email,

                    "Aberto",

                    data

                );


            res.json({

                sucesso: true,

                mensagem:
                    "Chamado criado com sucesso!",

                id:
                    resultado.lastInsertRowid

            });


        } catch (erro) {

            console.error(
                "Erro ao criar chamado:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao criar chamado."

            });

        }

    }
);


// =====================================================
// LISTAR CHAMADOS
// =====================================================

app.get(
    "/api/chamados",
    (req, res) => {

        try {

            const chamados =
                db.prepare(`

                    SELECT

                        id,

                        titulo,

                        categoria,

                        prioridade,

                        setor,

                        descricao,

                        solicitante,

                        email,

                        status,

                        data

                    FROM chamados

                    ORDER BY id DESC

                `).all();


            const chamadosFormatados =
                chamados.map(
                    function (chamado) {

                        return {

                            ...chamado,

                            id:
                                "#" +
                                String(
                                    chamado.id
                                ).padStart(
                                    4,
                                    "0"
                                )

                        };

                    }
                );


            res.json(
                chamadosFormatados
            );


        } catch (erro) {

            console.error(
                "Erro ao buscar chamados:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao buscar chamados."

            });

        }

    }
);


// =====================================================
// ALTERAR STATUS DO CHAMADO
// =====================================================

app.put(
    "/api/chamados/:id/status",
    (req, res) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            const {
                status
            } = req.body;


            const statusPermitidos = [

                "Aberto",

                "Andamento",

                "Resolvido"

            ];


            if (
                !statusPermitidos.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "Status inválido."

                });

            }


            const chamado =
                db.prepare(`

                    SELECT id

                    FROM chamados

                    WHERE id = ?

                `).get(id);


            if (!chamado) {

                return res.status(404).json({

                    sucesso: false,

                    mensagem:
                        "Chamado não encontrado."

                });

            }


            db.prepare(`

                UPDATE chamados

                SET status = ?

                WHERE id = ?

            `).run(
                status,
                id
            );


            res.json({

                sucesso: true,

                mensagem:
                    "Status atualizado com sucesso!"

            });


        } catch (erro) {

            console.error(
                "Erro ao atualizar chamado:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao atualizar chamado."

            });

        }

    }
);


// =====================================================
// EXCLUIR CHAMADO
// =====================================================

app.delete(
    "/api/chamados/:id",
    (req, res) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            const chamado =
                db.prepare(`

                    SELECT id

                    FROM chamados

                    WHERE id = ?

                `).get(id);


            if (!chamado) {

                return res.status(404).json({

                    sucesso: false,

                    mensagem:
                        "Chamado não encontrado."

                });

            }


            db.prepare(`

                DELETE FROM chamados

                WHERE id = ?

            `).run(id);


            res.json({

                sucesso: true,

                mensagem:
                    "Chamado excluído com sucesso!"

            });


        } catch (erro) {

            console.error(
                "Erro ao excluir chamado:",
                erro
            );


            res.status(500).json({

                sucesso: false,

                mensagem:
                    "Erro ao excluir chamado."

            });

        }

    }
);

// =====================================================
// INICIAR SERVIDOR
// =====================================================

app.listen(
    PORTA,
    () => {

        console.log(
            `Servidor funcionando em http://localhost:${PORTA}`
        );

    }
);