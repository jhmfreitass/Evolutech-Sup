/* =====================================================
   LOGIN - EVOLUTECH SUP
===================================================== */


/* =====================================================
   MOSTRAR / OCULTAR SENHA
===================================================== */

function configurarMostrarSenha() {

    const senha =
        document.getElementById("senha");

    const mostrarSenha =
        document.getElementById("mostrarSenha");


    if (!senha || !mostrarSenha) {
        return;
    }


    mostrarSenha.addEventListener(
        "change",
        function () {

            if (mostrarSenha.checked) {

                senha.type = "text";

            } else {

                senha.type = "password";

            }

        }
    );
}


/* =====================================================
   LEMBRAR DE MIM
===================================================== */

function carregarEmailLembrado() {

    const emailSalvo =
        localStorage.getItem(
            "emailLembrado"
        );


    const email =
        document.getElementById("email");

    const lembrar =
        document.getElementById("lembrar");


    if (!email || !lembrar) {
        return;
    }


    if (emailSalvo) {

        email.value =
            emailSalvo;

        lembrar.checked =
            true;
    }
}


/* =====================================================
   MOSTRAR MENSAGEM
===================================================== */

function mostrarMensagem(
    texto,
    tipo
) {

    const mensagem =
        document.getElementById(
            "mensagemLogin"
        );


    if (!mensagem) {
        return;
    }


    mensagem.textContent =
        texto;

    mensagem.style.display =
        "block";


    if (tipo === "erro") {

        mensagem.style.color =
            "#dc2626";

    } else {

        mensagem.style.color =
            "#16a34a";
    }
}


/* =====================================================
   FAZER LOGIN
===================================================== */

async function fazerLogin(evento) {

    evento.preventDefault();


    const email =
        document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();


    const senha =
        document
            .getElementById("senha")
            .value;


    const lembrar =
        document
            .getElementById("lembrar")
            .checked;


    /* =================================================
       VALIDAR CAMPOS
    ================================================= */

    if (!email || !senha) {

        mostrarMensagem(
            "Preencha o e-mail e a senha.",
            "erro"
        );

        return;
    }


    /* =================================================
       LOGIN PELO SERVIDOR / SQLITE
    ================================================= */

    try {

        const resposta =
            await fetch(
                "/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                }
            );


        const dados =
            await resposta.json();


        /* =================================================
           LOGIN INCORRETO
        ================================================= */

        if (
            !resposta.ok ||
            !dados.sucesso ||
            !dados.usuario
        ) {

            mostrarMensagem(
                dados.mensagem ||
                "E-mail ou senha incorretos.",
                "erro"
            );

            return;
        }


        /* =================================================
           LEMBRAR E-MAIL
        ================================================= */

        if (lembrar) {

            localStorage.setItem(
                "emailLembrado",
                email
            );

        } else {

            localStorage.removeItem(
                "emailLembrado"
            );
        }


        /* =================================================
           PEGAR USUÁRIO DO BANCO
        ================================================= */

        const usuario =
            dados.usuario;


        /* =================================================
           GARANTIR CARGO
        ================================================= */

        const cargo =
            usuario.cargo ||
            "Usuário";


        /* =================================================
           SALVAR USUÁRIO LOGADO
        ================================================= */

        const usuarioLogado = {

            id:
                usuario.id,

            nome:
                usuario.nome,

            email:
                usuario.email,

            cargo:
                cargo,

            status:
                usuario.status ||
                "Ativo"
        };


        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(
                usuarioLogado
            )
        );


        /* =================================================
           ENTRAR NO SISTEMA
        ================================================= */

        window.location.replace(
            "index.html"
        );

    } catch (erro) {

        console.error(
            "Erro ao realizar login:",
            erro
        );


        mostrarMensagem(
            "Não foi possível conectar ao servidor.",
            "erro"
        );
    }
}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        configurarMostrarSenha();

        carregarEmailLembrado();


        const formulario =
            document.getElementById(
                "loginForm"
            );


        if (formulario) {

            formulario.addEventListener(
                "submit",
                fazerLogin
            );
        }

    }
);

