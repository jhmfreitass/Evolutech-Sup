    document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarChamados();


        const busca =
            document.getElementById(
                "buscaChamado"
            );


        const filtroStatus =
            document.getElementById(
                "filtroStatus"
            );


        if (busca) {

            busca.addEventListener(
                "input",
                carregarChamados
            );

        }


        if (filtroStatus) {

            filtroStatus.addEventListener(
                "change",
                carregarChamados
            );

        }

    }
);


/* =====================================================
   USUÁRIO LOGADO
===================================================== */

function obterUsuarioChamados() {

    const dados =
        localStorage.getItem(
            "usuarioLogado"
        );


    if (!dados) {
        return null;
    }


    try {

        return JSON.parse(
            dados
        );

    } catch (erro) {

        console.error(
            "Erro ao ler usuário:",
            erro
        );

        return null;

    }

}


/* =====================================================
   CARREGAR CHAMADOS
===================================================== */

async function carregarChamados() {

    try {

        const resposta =
            await fetch(
                "/api/chamados"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar chamados."
            );

        }


        let chamados =
            await resposta.json();


        const usuario =
            obterUsuarioChamados();


        /* =============================================
           USUÁRIO COMUM
        ============================================= */

        if (
            usuario &&
            usuario.cargo === "Usuário"
        ) {

            chamados =
                chamados.filter(
                    function (chamado) {

                        return (
                            chamado.email ===
                            usuario.email
                        );

                    }
                );

        }


        mostrarChamados(
            chamados
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar chamados:",
            erro
        );


        const lista =
            document.getElementById(
                "listaChamados"
            );


        if (lista) {

            lista.innerHTML = `

                <tr>

                    <td colspan="8">

                        Não foi possível carregar os chamados.

                    </td>

                </tr>

            `;

        }

    }

}


/* =====================================================
   CONVERTER ID
===================================================== */

function obterIdNumerico(id) {

    return Number(
        String(id)
            .replace("#", "")
    );

}


/* =====================================================
   MOSTRAR CHAMADOS
===================================================== */

function mostrarChamados(
    chamados
) {

    const lista =
        document.getElementById(
            "listaChamados"
        );


    if (!lista) {

        console.error(
            "Elemento listaChamados não encontrado."
        );

        return;

    }


    const busca =
        document.getElementById(
            "buscaChamado"
        );


    const filtroStatus =
        document.getElementById(
            "filtroStatus"
        );


    const textoBusca =
        busca
            ? busca.value
                .trim()
                .toLowerCase()
            : "";


    const statusSelecionado =
        filtroStatus
            ? filtroStatus.value
            : "";


    const filtrados =
        chamados.filter(
            function (chamado) {

                const texto = (

                    chamado.id +
                    " " +
                    chamado.titulo +
                    " " +
                    chamado.categoria +
                    " " +
                    chamado.solicitante

                )
                .toLowerCase();


                const correspondeBusca =
                    texto.includes(
                        textoBusca
                    );


                const correspondeStatus =
                    !statusSelecionado ||
                    chamado.status ===
                    statusSelecionado;


                return (
                    correspondeBusca &&
                    correspondeStatus
                );

            }
        );


    lista.innerHTML = "";


    /* =================================================
       NENHUM CHAMADO
    ================================================= */

    if (
        filtrados.length === 0
    ) {

        lista.innerHTML = `

            <tr>

                <td colspan="8">

                    Nenhum chamado encontrado.

                </td>

            </tr>

        `;

        return;

    }


    const usuario =
        obterUsuarioChamados();


    const ehAdministrador =
        usuario &&
        usuario.cargo ===
        "Administrador";


    /* =================================================
       ADICIONAR CHAMADOS
    ================================================= */

    filtrados.forEach(
        function (chamado) {

            const linha =
                document.createElement(
                    "tr"
                );


            const idNumerico =
                obterIdNumerico(
                    chamado.id
                );


            let acao = "";


            /* =========================================
               STATUS
            ========================================= */

            if (ehAdministrador) {

                acao += `

                    <select
                        class="status-chamado"
                        data-id="${idNumerico}"
                    >

                        <option
                            value="Aberto"
                            ${chamado.status === "Aberto" ? "selected" : ""}
                        >
                            Aberto
                        </option>

                        <option
                            value="Andamento"
                            ${chamado.status === "Andamento" ? "selected" : ""}
                        >
                            Em andamento
                        </option>

                        <option
                            value="Resolvido"
                            ${chamado.status === "Resolvido" ? "selected" : ""}
                        >
                            Resolvido
                        </option>

                    </select>

                `;

            } else {

                acao += `

                    <span>

                        ${chamado.status}

                    </span>

                `;

            }


            /* =========================================
               EXCLUIR
            ========================================= */

            if (ehAdministrador) {

                acao += `

                    <button
                        class="btn-excluir-chamado"
                        data-id="${idNumerico}"
                        title="Excluir chamado"
                    >
                        🗑️
                    </button>

                `;

            }


            linha.innerHTML = `

                <td>

                    ${chamado.id}

                </td>


                <td>

                    ${chamado.titulo}

                </td>


                <td>

                    ${chamado.categoria}

                </td>


                <td>

                    ${chamado.prioridade}

                </td>


                <td>

                    ${chamado.solicitante}

                </td>


                <td>

                    ${chamado.status}

                </td>


                <td>

                    ${chamado.data}

                </td>


                <td>

                    <div
                        style="
                            display:flex;
                            gap:8px;
                            align-items:center;
                            justify-content:center;
                        "
                    >

                        ${acao}

                    </div>

                </td>

            `;


            lista.appendChild(
                linha
            );

        }
    );


    configurarAcoesChamados();

}


/* =====================================================
   CONFIGURAR AÇÕES
===================================================== */

function configurarAcoesChamados() {

    const selects =
        document.querySelectorAll(
            ".status-chamado"
        );


    selects.forEach(
        function (select) {

            select.addEventListener(
                "change",
                function () {

                    alterarStatusChamado(
                        select.dataset.id,
                        select.value
                    );

                }
            );

        }
    );


    const botoes =
        document.querySelectorAll(
            ".btn-excluir-chamado"
        );


    botoes.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    excluirChamado(
                        botao.dataset.id
                    );

                }
            );

        }
    );

}


/* =====================================================
   ALTERAR STATUS
===================================================== */

async function alterarStatusChamado(
    id,
    status
) {

    try {

        const resposta =
            await fetch(
                `/api/chamados/${id}/status`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({
                            status: status
                        })

                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                resultado.mensagem ||
                "Não foi possível alterar o status."
            );

            return;

        }


        carregarChamados();


    } catch (erro) {

        console.error(
            "Erro ao alterar status:",
            erro
        );


        alert(
            "Não foi possível conectar ao servidor."
        );

    }

}


/* =====================================================
   EXCLUIR CHAMADO
===================================================== */

async function excluirChamado(
    id
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este chamado?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `/api/chamados/${id}`,
                {

                    method: "DELETE"

                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                resultado.mensagem ||
                "Não foi possível excluir o chamado."
            );

            return;

        }


        alert(
            "Chamado excluído com sucesso!"
        );


        carregarChamados();


    } catch (erro) {

        console.error(
            "Erro ao excluir chamado:",
            erro
        );


        alert(
            "Não foi possível conectar ao servidor."
        );

    }

}

