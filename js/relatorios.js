// =====================================================
// CONFIGURAÇÃO
// =====================================================

// Usa automaticamente o endereço onde o site está aberto.
//
// No Render:
// https://evolutech-sup.onrender.com/api
//
// No computador:
// http://localhost:3000/api

const API_URL =
    `${window.location.origin}/api`;


let chamadosRelatorio = [];


// =====================================================
// INICIAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarRelatorio();

        const botao =
            document.getElementById(
                "btnAtualizar"
            );

        if (botao) {

            botao.addEventListener(
                "click",
                carregarRelatorio
            );

        }


        const busca =
            document.getElementById(
                "buscaRelatorio"
            );

        const filtro =
            document.getElementById(
                "filtroRelatorio"
            );


        if (busca) {

            busca.addEventListener(
                "input",
                mostrarTabelaRelatorio
            );

        }


        if (filtro) {

            filtro.addEventListener(
                "change",
                mostrarTabelaRelatorio
            );

        }

    }
);


// =====================================================
// CARREGAR DADOS DO SERVIDOR
// =====================================================

async function carregarRelatorio() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/chamados`
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível buscar os chamados."
            );

        }


        chamadosRelatorio =
            await resposta.json();


        atualizarIndicadores();

        mostrarTabelaRelatorio();


    } catch (erro) {

        console.error(
            "Erro ao carregar relatório:",
            erro
        );


        const lista =
            document.getElementById(
                "listaRelatorio"
            );


        if (lista) {

            lista.innerHTML = `

                <tr>

                    <td colspan="7">

                        ❌ Não foi possível conectar
                        ao servidor.

                        <br><br>

                        Verifique se o
                        <strong>servidor do sistema</strong>
                        está funcionando.

                    </td>

                </tr>

            `;

        }

    }

}


// =====================================================
// ATUALIZAR INDICADORES
// =====================================================

function atualizarIndicadores() {

    const total =
        chamadosRelatorio.length;


    const abertos =
        chamadosRelatorio.filter(
            chamado =>
                chamado.status === "Aberto"
        ).length;


    const andamento =
        chamadosRelatorio.filter(
            chamado =>
                chamado.status === "Andamento"
        ).length;


    const resolvidos =
        chamadosRelatorio.filter(
            chamado =>
                chamado.status === "Resolvido"
        ).length;


    const alta =
        chamadosRelatorio.filter(
            chamado =>
                normalizar(
                    chamado.prioridade
                ) === "alta"
        ).length;


    const media =
        chamadosRelatorio.filter(
            chamado =>
                normalizar(
                    chamado.prioridade
                ) === "media"
        ).length;


    const baixa =
        chamadosRelatorio.filter(
            chamado =>
                normalizar(
                    chamado.prioridade
                ) === "baixa"
        ).length;


    colocarTexto(
        "totalChamados",
        total
    );

    colocarTexto(
        "totalAbertos",
        abertos
    );

    colocarTexto(
        "totalAndamento",
        andamento
    );

    colocarTexto(
        "totalResolvidos",
        resolvidos
    );


    colocarTexto(
        "numeroAbertos",
        abertos
    );

    colocarTexto(
        "numeroAndamento",
        andamento
    );

    colocarTexto(
        "numeroResolvidos",
        resolvidos
    );


    colocarTexto(
        "prioridadeAlta",
        alta
    );

    colocarTexto(
        "prioridadeMedia",
        media
    );

    colocarTexto(
        "prioridadeBaixa",
        baixa
    );


    // =================================================
    // PORCENTAGENS DAS BARRAS
    // =================================================

    const porcentagemAberto =
        total > 0
            ? (abertos / total) * 100
            : 0;


    const porcentagemAndamento =
        total > 0
            ? (andamento / total) * 100
            : 0;


    const porcentagemResolvido =
        total > 0
            ? (resolvidos / total) * 100
            : 0;


    colocarLargura(
        "barraAberto",
        porcentagemAberto
    );

    colocarLargura(
        "barraAndamento",
        porcentagemAndamento
    );

    colocarLargura(
        "barraResolvido",
        porcentagemResolvido
    );

}


// =====================================================
// MOSTRAR TABELA
// =====================================================

function mostrarTabelaRelatorio() {

    const lista =
        document.getElementById(
            "listaRelatorio"
        );


    if (!lista) {
        return;
    }


    const busca =
        document.getElementById(
            "buscaRelatorio"
        );


    const filtro =
        document.getElementById(
            "filtroRelatorio"
        );


    const texto =
        busca
            ? busca.value
                .trim()
                .toLowerCase()
            : "";


    const status =
        filtro
            ? filtro.value
            : "";


    const filtrados =
        chamadosRelatorio.filter(
            function (chamado) {

                const conteudo = `

                    ${chamado.id}
                    ${chamado.titulo}
                    ${chamado.categoria}
                    ${chamado.prioridade}
                    ${chamado.solicitante}

                `.toLowerCase();


                const correspondeTexto =
                    conteudo.includes(
                        texto
                    );


                const correspondeStatus =
                    !status ||
                    chamado.status === status;


                return (
                    correspondeTexto &&
                    correspondeStatus
                );

            }
        );


    lista.innerHTML = "";


    if (filtrados.length === 0) {

        lista.innerHTML = `

            <tr>

                <td colspan="7">

                    Nenhum chamado encontrado.

                </td>

            </tr>

        `;

        return;

    }


    filtrados.forEach(
        function (chamado) {

            const linha =
                document.createElement(
                    "tr"
                );


            const classeStatus =
                obterClasseStatus(
                    chamado.status
                );


            linha.innerHTML = `

                <td>
                    ${chamado.id}
                </td>

                <td>
                    ${escaparHTML(
                        chamado.titulo
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        chamado.categoria
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        chamado.prioridade
                    )}
                </td>

                <td>
                    ${escaparHTML(
                        chamado.solicitante
                    )}
                </td>

                <td>

                    <span
                        class="status-relatorio ${classeStatus}"
                    >
                        ${escaparHTML(
                            chamado.status
                        )}
                    </span>

                </td>

                <td>
                    ${escaparHTML(
                        chamado.data
                    )}
                </td>

            `;


            lista.appendChild(
                linha
            );

        }
    );

}


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function colocarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            valor;

    }

}


function colocarLargura(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.style.width =
            `${valor}%`;

    }

}


function normalizar(texto) {

    return String(
        texto || ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase();

}


function obterClasseStatus(
    status
) {

    if (status === "Aberto") {

        return "status-aberto";

    }


    if (status === "Andamento") {

        return "status-andamento";

    }


    if (status === "Resolvido") {

        return "status-resolvido";

    }


    return "";

}


function escaparHTML(
    texto
) {

    return String(
        texto ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

