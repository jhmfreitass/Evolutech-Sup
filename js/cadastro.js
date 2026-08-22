const cadastroForm = document.getElementById("cadastroForm");

if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ========================================
            // PEGAR CAMPOS
            // ========================================

            const nome = document
                .getElementById("nome")
                .value
                .trim();


            const sobrenome = document
                .getElementById("sobrenome")
                .value
                .trim();


            const email = document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();


            const senha = document
                .getElementById("senha")
                .value;


            const confirmarSenha = document
                .getElementById("confirmarSenha")
                .value;


            // ========================================
            // CAMPOS OBRIGATÓRIOS
            // ========================================

            if (
                nome === "" ||
                sobrenome === "" ||
                email === "" ||
                senha === "" ||
                confirmarSenha === ""
            ) {

                alert(
                    "Preencha todos os campos!"
                );

                return;
            }


            // ========================================
            // SENHA
            // ========================================

            if (senha.length < 6) {

                alert(
                    "A senha precisa ter pelo menos 6 caracteres!"
                );

                return;
            }


            if (senha !== confirmarSenha) {

                alert(
                    "As senhas não são iguais!"
                );

                return;
            }


            // ========================================
            // NÃO PERMITIR CADASTRAR ADMIN
            // ========================================

            if (
                email === "jhmourafreitas@gmail.com"
            ) {

                alert(
                    "Este e-mail já pertence ao administrador."
                );

                return;
            }


            // ========================================
            // ENVIAR PARA O NODE.JS
            // ========================================

            try {

                const resposta = await fetch(
                    "/api/usuarios",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            nome: nome,

                            sobrenome: sobrenome,

                            email: email,

                            senha: senha

                        })

                    }
                );


                const dados =
                    await resposta.json();


                // ========================================
                // ERRO
                // ========================================

                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Não foi possível realizar o cadastro."
                    );

                    return;
                }


                // ========================================
                // SUCESSO
                // ========================================

                alert(
                    "Cadastro realizado com sucesso!"
                );


                // Ir para login

                window.location.href =
                    "login.html";


            } catch (erro) {

                console.error(
                    "Erro ao cadastrar:",
                    erro
                );

                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }
    );

}

