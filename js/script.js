/* =====================================================
   SUPORTE TI
   SISTEMA PRINCIPAL
===================================================== */


/* =====================================================
   OBTER USUÁRIO LOGADO
===================================================== */

function obterUsuarioLogado() {

    const usuarioSalvo =
        localStorage.getItem("usuarioLogado");

    if (!usuarioSalvo) {
        return null;
    }

    try {

        const usuario =
            JSON.parse(usuarioSalvo);

        if (
            !usuario ||
            !usuario.email ||
            !usuario.cargo
        ) {
            return null;
        }

        return usuario;

    } catch (erro) {

        console.error(
            "Erro ao ler usuário:",
            erro
        );

        return null;
    }
}


/* =====================================================
   VERIFICAR LOGIN
===================================================== */

function verificarLogin() {

    const usuario =
        obterUsuarioLogado();

    if (!usuario) {

        if (
            !window.location.pathname.endsWith(
                "login.html"
            )
        ) {

            window.location.replace(
                "login.html"
            );
        }

        return false;
    }

    return true;
}


/* =====================================================
   OBTER FOTO DO USUÁRIO
===================================================== */

function obterFotoUsuario() {

    const usuario =
        obterUsuarioLogado();

    if (
        !usuario ||
        !usuario.email
    ) {
        return null;
    }

    const chave =
        "fotoPerfil_" +
        usuario.email;

    return localStorage.getItem(
        chave
    );
}


/* =====================================================
   APLICAR FOTO NOS AVATARES
===================================================== */

function aplicarFotoNosAvatares() {

    const foto =
        obterFotoUsuario();

    const avatares = [

        document.getElementById(
            "avatarUsuario"
        ),

        document.getElementById(
            "avatarTopo"
        )

    ];

    const usuario =
        obterUsuarioLogado();

    const nome =
        usuario?.nome ||
        "Usuário";

    const inicial =
        nome
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "U";


    avatares.forEach(

        function (avatar) {

            if (!avatar) {
                return;
            }


            if (foto) {

                avatar.innerHTML = "";


                const imagem =
                    document.createElement(
                        "img"
                    );


                imagem.src =
                    foto;

                imagem.alt =
                    "Foto do usuário";

                imagem.style.width =
                    "100%";

                imagem.style.height =
                    "100%";

                imagem.style.objectFit =
                    "cover";

                imagem.style.borderRadius =
                    "50%";


                avatar.appendChild(
                    imagem
                );

            } else {

                avatar.innerHTML =
                    inicial;
            }
        }
    );
}


/* =====================================================
   PREENCHER DADOS DO USUÁRIO
===================================================== */

function preencherUsuario() {

    const usuario =
        obterUsuarioLogado();

    if (!usuario) {
        return;
    }


    const nome =
        usuario.nome ||
        "Usuário";


    const cargo =
        usuario.cargo ||
        "Usuário";


    /* NOMES */

    const elementosNome = [

        document.getElementById(
            "nomeUsuario"
        ),

        document.getElementById(
            "nomeTopo"
        ),

        document.getElementById(
            "nomeInicio"
        )

    ];


    elementosNome.forEach(

        function (elemento) {

            if (elemento) {

                elemento.textContent =
                    nome;
            }
        }
    );


    /* CARGOS */

    const elementosCargo = [

        document.getElementById(
            "cargoUsuario"
        ),

        document.getElementById(
            "cargoTopo"
        )

    ];


    elementosCargo.forEach(

        function (elemento) {

            if (elemento) {

                elemento.textContent =
                    cargo;
            }
        }
    );


    aplicarFotoNosAvatares();
}


/* =====================================================
   CONTROLAR MENU DE GERENCIAMENTO

   USUÁRIO:
   Técnicos

   TÉCNICO / FUNCIONÁRIO:
   Técnicos + Relatórios

   ADMINISTRADOR:
   Usuários + Técnicos + Relatórios
===================================================== */

function controlarMenu() {

    const usuario =
        obterUsuarioLogado();


    const linkUsuarios =
        document.querySelector(
            'a[href="usuarios.html"]'
        );


    const linkTecnicos =
        document.querySelector(
            'a[href="tecnicos.html"]'
        );


    const linkRelatorios =
        document.querySelector(
            'a[href="relatorios.html"]'
        );


    const titulos =
        document.querySelectorAll(
            ".menu-gerenciamento"
        );


    /* =================================================
       SEM LOGIN
    ================================================= */

    if (!usuario) {

        if (linkUsuarios) {

            linkUsuarios.style.setProperty(
                "display",
                "none",
                "important"
            );
        }


        if (linkTecnicos) {

            linkTecnicos.style.setProperty(
                "display",
                "none",
                "important"
            );
        }


        if (linkRelatorios) {

            linkRelatorios.style.setProperty(
                "display",
                "none",
                "important"
            );
        }


        titulos.forEach(

            function (titulo) {

                titulo.style.setProperty(
                    "display",
                    "none",
                    "important"
                );
            }
        );

        return;
    }


    const cargo =
        usuario.cargo ||
        "Usuário";


    /* =================================================
       USUÁRIO COMUM

       MOSTRA:
       Técnicos

       ESCONDE:
       Usuários
       Relatórios
    ================================================= */

    if (cargo === "Usuário") {

        if (linkUsuarios) {

            linkUsuarios.style.setProperty(
                "display",
                "none",
                "important"
            );
        }


        if (linkTecnicos) {

            linkTecnicos.style.setProperty(
                "display",
                "flex",
                "important"
            );
        }


        if (linkRelatorios) {

            linkRelatorios.style.setProperty(
                "display",
                "none",
                "important"
            );
        }


        titulos.forEach(

            function (titulo) {

                titulo.style.setProperty(
                    "display",
                    "block",
                    "important"
                );
            }
        );

        return;
    }


    /* =================================================
       ADMINISTRADOR

       MOSTRA:
       Usuários
       Técnicos
       Relatórios
    ================================================= */

    if (cargo === "Administrador") {

        if (linkUsuarios) {

            linkUsuarios.style.setProperty(
                "display",
                "flex",
                "important"
            );
        }


        if (linkTecnicos) {

            linkTecnicos.style.setProperty(
                "display",
                "flex",
                "important"
            );
        }


        if (linkRelatorios) {

            linkRelatorios.style.setProperty(
                "display",
                "flex",
                "important"
            );
        }


        titulos.forEach(

            function (titulo) {

                titulo.style.setProperty(
                    "display",
                    "block",
                    "important"
                );
            }
        );

        return;
    }


    /* =================================================
       TÉCNICO E FUNCIONÁRIO

       MOSTRA:
       Técnicos
       Relatórios

       ESCONDE:
       Usuários
    ================================================= */

    if (
        cargo === "Técnico" ||
        cargo === "Funcionário"
    ) {

        if (linkUsuarios) {

            linkUsuarios.style.setProperty(
                "display",
                "none",
                "important"
            );
        }


        if (linkTecnicos) {

            linkTecnicos.style.setProperty(
                "display",
                "flex",
                "important"
            );
        }


        if (linkRelatorios) {

            linkRelatorios.style.setProperty(
                "display",
                "flex",
                "important"
            );
        }


        titulos.forEach(

            function (titulo) {

                titulo.style.setProperty(
                    "display",
                    "block",
                    "important"
                );
            }
        );

        return;
    }
}


/* =====================================================
   BOTÃO SAIR
===================================================== */

function configurarLogout() {

    const botao =
        document.getElementById(
            "btnSair"
        );


    if (!botao) {
        return;
    }


    botao.addEventListener(

        "click",

        function () {

            const confirmar =
                confirm(
                    "Deseja sair do sistema?"
                );


            if (!confirmar) {
                return;
            }


            localStorage.removeItem(
                "usuarioLogado"
            );


            window.location.replace(
                "login.html"
            );
        }
    );
}


/* =====================================================
   PROTEÇÃO DE PÁGINAS
===================================================== */

function protegerPagina() {

    const pagina =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    if (
        pagina === "login.html" ||
        pagina === ""
    ) {
        return;
    }


    verificarLogin();
}


/* =====================================================
   BLOQUEIO DE PÁGINAS DE GERENCIAMENTO
===================================================== */

function protegerGerenciamento() {

    const pagina =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const paginasGerenciamento = [

        "usuarios.html",
        "tecnicos.html",
        "relatorios.html"

    ];


    if (
        !paginasGerenciamento.includes(
            pagina
        )
    ) {
        return;
    }


    const usuario =
        obterUsuarioLogado();


    if (!usuario) {

        window.location.replace(
            "login.html"
        );

        return;
    }


    const cargo =
        usuario.cargo ||
        "Usuário";


    /* =================================================
       USUÁRIO COMUM
    ================================================= */

    if (cargo === "Usuário") {

        if (
            pagina === "usuarios.html" ||
            pagina === "relatorios.html"
        ) {

            window.location.replace(
                "tecnicos.html"
            );

            return;
        }

        return;
    }


    /* =================================================
       TÉCNICO E FUNCIONÁRIO
    ================================================= */

    if (
        pagina === "usuarios.html" &&
        (
            cargo === "Técnico" ||
            cargo === "Funcionário"
        )
    ) {

        window.location.replace(
            "index.html"
        );

        return;
    }
}


/* =====================================================
   MODO ESCURO
===================================================== */

function carregarModoEscuro() {

    const modoEscuro =
        localStorage.getItem(
            "modoEscuro"
        );


    if (
        modoEscuro === "true"
    ) {

        document.body.classList.add(
            "modo-escuro"
        );
    }
}


/* =====================================================
   SWITCH DO MODO ESCURO
===================================================== */

function configurarModoEscuro() {

    const switchModo =
        document.getElementById(
            "modoEscuro"
        );


    if (!switchModo) {
        return;
    }


    const modoSalvo =
        localStorage.getItem(
            "modoEscuro"
        );


    switchModo.checked =
        modoSalvo === "true";


    switchModo.addEventListener(

        "change",

        function () {

            const ativado =
                switchModo.checked;


            document.body.classList.toggle(
                "modo-escuro",
                ativado
            );


            localStorage.setItem(
                "modoEscuro",
                ativado
            );
        }
    );
}


/* =====================================================
   MOSTRAR SISTEMA
===================================================== */

function mostrarSistema() {

    const sistema =
        document.querySelector(
            ".sistema"
        );


    if (!sistema) {
        return;
    }


    sistema.classList.add(
        "sistema-pronto"
    );
}


/* =====================================================
   EXECUÇÃO DO SISTEMA
===================================================== */

(function iniciarSistema() {

    const pagina =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /* LOGIN */

    if (
        pagina === "login.html"
    ) {
        return;
    }


    /* USUÁRIO LOGADO */

    const usuario =
        obterUsuarioLogado();


    /* SEM LOGIN */

    if (!usuario) {

        window.location.replace(
            "login.html"
        );

        return;
    }


    /* PROTEGER GERENCIAMENTO */

    protegerGerenciamento();


    /* PREENCHER USUÁRIO */

    preencherUsuario();


    /* CONTROLAR MENU */

    controlarMenu();


    /* LOGOUT */

    configurarLogout();


    /* MODO ESCURO */

    carregarModoEscuro();


    configurarModoEscuro();


    /* MOSTRAR SISTEMA */

    mostrarSistema();

})();

