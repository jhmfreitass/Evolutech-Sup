/* =====================================================
   SUPORTE TI
   GERENCIAMENTO DE USUÁRIOS
===================================================== */


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarUsuarios();

        configurarPesquisa();

        configurarFiltroCargo();

    }
);


/* =====================================================
   VARIÁVEIS
===================================================== */

let usuariosAtuais = [];


/* =====================================================
   VERIFICAR SE É ADMINISTRADOR
===================================================== */

function usuarioEhAdministrador() {

    try {

        const usuarioLogado =
            JSON.parse(
                localStorage.getItem(
                    "usuarioLogado"
                )
            );

        return (
            usuarioLogado &&
            usuarioLogado.cargo ===
                "Administrador"
        );

    } catch (erro) {

        console.error(
            "Erro ao verificar administrador:",
            erro
        );

        return false;
    }
}


/* =====================================================
   PEGAR USUÁRIO LOGADO
===================================================== */

function pegarUsuarioLogado() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "usuarioLogado"
            )
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar usuário logado:",
            erro
        );

        return null;
    }
}


/* =====================================================
   CARREGAR USUÁRIOS
===================================================== */

async function carregarUsuarios() {

    const lista =
        document.getElementById(
            "listaUsuarios"
        );

    const nenhumUsuario =
        document.getElementById(
            "nenhumUsuario"
        );

    if (!lista) {
        return;
    }

    try {

        const resposta =
            await fetch(
                "/api/usuarios"
            );

        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar usuários."
            );
        }

        const usuarios =
            await resposta.json();

        usuariosAtuais =
            usuarios;

        mostrarUsuarios(
            usuariosAtuais
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar usuários:",
            erro
        );

        if (nenhumUsuario) {

            nenhumUsuario.style.display =
                "block";

            nenhumUsuario.innerHTML = `
                <p>
                    Não foi possível carregar os usuários.
                </p>
            `;
        }

        alert(
            "Não foi possível carregar os usuários."
        );
    }
}


/* =====================================================
   MOSTRAR USUÁRIOS
===================================================== */

function mostrarUsuarios(usuarios) {

    const lista =
        document.getElementById(
            "listaUsuarios"
        );

    const nenhumUsuario =
        document.getElementById(
            "nenhumUsuario"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML = "";


    if (
        !usuarios ||
        usuarios.length === 0
    ) {

        if (nenhumUsuario) {

            nenhumUsuario.style.display =
                "block";
        }

        return;
    }


    if (nenhumUsuario) {

        nenhumUsuario.style.display =
            "none";
    }


    const ehAdministrador =
        usuarioEhAdministrador();

    const usuarioLogado =
        pegarUsuarioLogado();


    usuarios.forEach(
        function (usuario) {

            const linha =
                document.createElement(
                    "tr"
                );

            const cargo =
                usuario.cargo ||
                "Usuário";


            /* =================================================
               BOTÕES DE AÇÃO
            ================================================= */

            let botoesAcao = `
                <span
                    style="
                        color: #6b7280;
                        font-size: 14px;
                    "
                >
                    —
                </span>
            `;


            if (ehAdministrador) {

                /*
                    Não deixamos o administrador excluir
                    a própria conta pela lista.
                */

                const ehProprioUsuario =
                    usuarioLogado &&
                    Number(
                        usuarioLogado.id
                    ) ===
                    Number(
                        usuario.id
                    );


                let botaoExcluir = "";


                if (!ehProprioUsuario) {

                    botaoExcluir = `
                        <button
                            type="button"
                            class="btn-acao"
                            title="Excluir usuário"
                            onclick="excluirUsuario(${usuario.id})"
                            style="margin-left: 5px;"
                        >
                            🗑️
                        </button>
                    `;
                }


                botoesAcao = `
                    <button
                        type="button"
                        class="btn-acao"
                        title="Editar cargo"
                        onclick="abrirEdicaoCargo(${usuario.id})"
                    >
                        ⚪
                    </button>

                    ${botaoExcluir}
                `;
            }


            /* =================================================
               LINHA DA TABELA
            ================================================= */

            linha.innerHTML = `

                <td>
                    #${String(
                        usuario.id
                    ).padStart(
                        4,
                        "0"
                    )}
                </td>


                <td>
                    ${escaparHTML(
                        usuario.nome ||
                        "—"
                    )}
                </td>


                <td>
                    ${escaparHTML(
                        usuario.email ||
                        "—"
                    )}
                </td>


                <td>

                    <span
                        class="senha-mascarada"
                        title="A senha não é exibida por segurança"
                    >
                        ••••••••
                    </span>

                </td>


                <td>

                    <span
                        class="cargo-tabela"
                    >
                        ${escaparHTML(
                            cargo
                        )}
                    </span>

                </td>


                <td>

                    <span
                        class="status ativo"
                    >
                        Ativo
                    </span>

                </td>


                <td>

                    ${botoesAcao}

                </td>

            `;


            lista.appendChild(
                linha
            );

        }
    );
}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparHTML(texto) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto;

    return div.innerHTML;
}


/* =====================================================
   EDITAR CARGO
===================================================== */

function abrirEdicaoCargo(id) {

    if (!usuarioEhAdministrador()) {

        alert(
            "Apenas administradores podem alterar cargos."
        );

        return;
    }


    const usuario =
        usuariosAtuais.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(id)
                );

            }
        );


    if (!usuario) {

        alert(
            "Usuário não encontrado."
        );

        return;
    }


    const cargoAtual =
        usuario.cargo ||
        "Usuário";


    const novoCargo =
        prompt(

            "Digite o novo cargo:\n\n" +

            "Administrador\n" +

            "Técnico\n" +

            "Funcionário\n" +

            "Usuário\n\n" +

            "Cargo atual: " +

            cargoAtual,

            cargoAtual
        );


    if (novoCargo === null) {
        return;
    }


    const cargo =
        novoCargo.trim();


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

        alert(

            "Cargo inválido.\n\n" +

            "Escolha entre:\n" +

            "Administrador, Técnico, Funcionário ou Usuário."

        );

        return;
    }


    salvarCargo(
        usuario.id,
        cargo
    );
}


/* =====================================================
   SALVAR CARGO
===================================================== */

async function salvarCargo(
    id,
    cargo
) {

    if (!usuarioEhAdministrador()) {

        alert(
            "Apenas administradores podem alterar cargos."
        );

        return;
    }


    try {

        const resposta =
            await fetch(
                `/api/usuarios/${id}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            cargo:
                                cargo

                        })

                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(

                resultado.mensagem ||

                "Não foi possível atualizar o cargo."

            );
        }


        alert(
            "Cargo atualizado com sucesso!"
        );


        await carregarUsuarios();

    } catch (erro) {

        console.error(
            "Erro ao atualizar cargo:",
            erro
        );

        alert(

            erro.message ||

            "Não foi possível atualizar o cargo."

        );
    }
}


/* =====================================================
   EXCLUIR USUÁRIO
===================================================== */

async function excluirUsuario(id) {

    if (!usuarioEhAdministrador()) {

        alert(
            "Apenas administradores podem excluir usuários."
        );

        return;
    }


    const usuarioLogado =
        pegarUsuarioLogado();


    /* =================================================
       IMPEDIR EXCLUSÃO DA PRÓPRIA CONTA
    ================================================= */

    if (
        usuarioLogado &&
        Number(
            usuarioLogado.id
        ) ===
        Number(id)
    ) {

        alert(
            "Você não pode excluir sua própria conta."
        );

        return;
    }


    const usuario =
        usuariosAtuais.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(id)
                );

            }
        );


    if (!usuario) {

        alert(
            "Usuário não encontrado."
        );

        return;
    }


    const confirmar =
        confirm(

            "Tem certeza que deseja excluir este usuário?\n\n" +

            "Nome: " +

            usuario.nome +

            "\n" +

            "E-mail: " +

            usuario.email +

            "\n\n" +

            "Essa ação não poderá ser desfeita."

        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `/api/usuarios/${id}`,
                {

                    method: "DELETE"

                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(

                resultado.mensagem ||

                "Não foi possível excluir o usuário."

            );
        }


        alert(
            "Usuário excluído com sucesso!"
        );


        await carregarUsuarios();

    } catch (erro) {

        console.error(
            "Erro ao excluir usuário:",
            erro
        );

        alert(

            erro.message ||

            "Não foi possível excluir o usuário."

        );
    }
}


/* =====================================================
   PESQUISA
===================================================== */

function configurarPesquisa() {

    const pesquisa =
        document.getElementById(
            "pesquisaUsuario"
        );


    if (!pesquisa) {
        return;
    }


    pesquisa.addEventListener(
        "input",
        aplicarFiltros
    );
}


/* =====================================================
   FILTRO DE CARGO
===================================================== */

function configurarFiltroCargo() {

    const filtro =
        document.getElementById(
            "filtroCargo"
        );


    if (!filtro) {
        return;
    }


    filtro.addEventListener(
        "change",
        aplicarFiltros
    );
}


/* =====================================================
   APLICAR FILTROS
===================================================== */

function aplicarFiltros() {

    const pesquisa =
        document.getElementById(
            "pesquisaUsuario"
        );

    const filtro =
        document.getElementById(
            "filtroCargo"
        );


    const texto =
        pesquisa
            ? pesquisa.value
                .trim()
                .toLowerCase()
            : "";


    const cargoSelecionado =
        filtro
            ? filtro.value
            : "";


    const usuariosFiltrados =
        usuariosAtuais.filter(
            function (usuario) {

                const nome =
                    (
                        usuario.nome ||
                        ""
                    ).toLowerCase();


                const email =
                    (
                        usuario.email ||
                        ""
                    ).toLowerCase();


                const cargo =
                    usuario.cargo ||
                    "Usuário";


                const correspondeTexto =
                    nome.includes(texto) ||
                    email.includes(texto);


                const correspondeCargo =
                    !cargoSelecionado ||
                    cargo ===
                        cargoSelecionado;


                return (
                    correspondeTexto &&
                    correspondeCargo
                );

            }
        );


    mostrarUsuarios(
        usuariosFiltrados
    );
}

