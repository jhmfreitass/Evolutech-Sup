document.addEventListener("DOMContentLoaded", function () {

const formChamado =
    document.getElementById("formChamado");

if (!formChamado) {
    return;
}

formChamado.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        // ==========================================
        // PEGAR USUÁRIO LOGADO
        // ==========================================

        let usuario = null;

        const dados =
            localStorage.getItem("usuarioLogado");

        if (!dados) {

            alert(
                "Você precisa estar logado."
            );

            window.location.href =
                "login.html";

            return;
        }

        try {

            usuario = JSON.parse(dados);

        } catch (erro) {

            usuario = {
                email: dados,
                nome:
                    localStorage.getItem(
                        "nomeUsuario"
                    ) || dados,
                cargo: "Usuário"
            };
        }

        // ==========================================
        // PEGAR CAMPOS
        // ==========================================

        const titulo =
            document
                .getElementById("titulo")
                .value
                .trim();

        const categoria =
            document
                .getElementById("categoria")
                .value;

        const prioridade =
            document
                .getElementById("prioridade")
                .value;

        const descricao =
            document
                .getElementById("descricao")
                .value
                .trim();

        // ==========================================
        // VALIDAR
        // ==========================================

        if (
            !titulo ||
            !categoria ||
            !prioridade ||
            !descricao
        ) {

            alert(
                "Preencha todos os campos."
            );

            return;
        }

        // ==========================================
        // DADOS DO CHAMADO
        // ==========================================

        const dadosChamado = {

            titulo: titulo,

            categoria: categoria,

            prioridade: prioridade,

            descricao: descricao,

            solicitante:
                usuario.nome ||
                usuario.email,

            email:
                usuario.email
        };

        console.log(
            "Enviando chamado:",
            dadosChamado
        );

        // ==========================================
        // ENVIAR PARA O SERVIDOR
        // ==========================================

        try {

            const resposta =
                await fetch(
                    "/api/chamados",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                dadosChamado
                            )
                    }
                );

            const resultado =
                await resposta.json();

            console.log(
                "Resposta do servidor:",
                resultado
            );

            // ======================================
            // ERRO
            // ======================================

            if (!resposta.ok) {

                alert(
                    resultado.mensagem ||
                    "Erro ao criar chamado."
                );

                return;
            }

            // ======================================
            // SUCESSO
            // ======================================

            alert(
                "Chamado criado com sucesso!"
            );

            window.location.href =
                "chamados.html";

        } catch (erro) {

            console.error(
                "Erro na conexão:",
                erro
            );

            alert(
                "Não foi possível conectar ao servidor."
            );
        }
    }
);

});
