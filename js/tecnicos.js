/* =====================================================
   EVOLUTECH SUP
   GERENCIAMENTO DE TÉCNICOS
===================================================== */

let tecnicosAtuais = [];
let usuariosAtuais = [];
let carregamentoConcluido = false;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarTecnicos();

        configurarNovoTecnico();

    }
);


/* =====================================================
   VERIFICAR ADMINISTRADOR
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
   CARREGAR TÉCNICOS
===================================================== */

async function carregarTecnicos() {

    const lista =
        document.getElementById(
            "listaTecnicos"
        );


    const nenhumTecnico =
        document.getElementById(
            "nenhumTecnico"
        );


    if (!lista) {

        return;

    }


    carregamentoConcluido = false;


    if (nenhumTecnico) {

        nenhumTecnico.style.display =
            "none";

    }


    try {

        const resposta =
            await fetch(
                "/api/tecnicos"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar técnicos."
            );

        }


        const dados =
            await resposta.json();


        tecnicosAtuais =
            Array.isArray(dados)
                ? dados
                : [];


        carregamentoConcluido = true;


        mostrarTecnicos(
            tecnicosAtuais
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar técnicos:",
            erro
        );


        carregamentoConcluido = true;


        if (nenhumTecnico) {

            nenhumTecnico.style.display =
                "block";


            nenhumTecnico.innerHTML = `

                <div
                    style="
                        font-size: 42px;
                        margin-bottom: 10px;
                    "
                >
                    ⚠️
                </div>


                <h3
                    style="
                        margin-bottom: 8px;
                        color: #374151;
                    "
                >
                    Não foi possível carregar os técnicos
                </h3>


                <p>
                    Verifique se o servidor está funcionando.
                </p>

            `;

        }

    }

}


/* =====================================================
   MOSTRAR TÉCNICOS
===================================================== */

function mostrarTecnicos(tecnicos) {

    const lista =
        document.getElementById(
            "listaTecnicos"
        );


    const nenhumTecnico =
        document.getElementById(
            "nenhumTecnico"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    if (!carregamentoConcluido) {

        if (nenhumTecnico) {

            nenhumTecnico.style.display =
                "none";

        }

        return;

    }


    if (
        !tecnicos ||
        tecnicos.length === 0
    ) {

        if (nenhumTecnico) {

            nenhumTecnico.style.display =
                "block";

        }

        return;

    }


    if (nenhumTecnico) {

        nenhumTecnico.style.display =
            "none";

    }


    const administrador =
        usuarioEhAdministrador();


    tecnicos.forEach(

        function (tecnico) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "tecnico-card";


            const primeiraLetra =
                (
                    tecnico.nome ||
                    "T"
                )
                    .charAt(0)
                    .toUpperCase();


            /*
             * Botão de remover só existe
             * para Administradores.
             */

            let botaoRemover = "";


            if (administrador) {

                botaoRemover = `

                    <button

                        type="button"

                        class="btn-remover-tecnico"

                        onclick="removerTecnico(${tecnico.id})"

                    >

                        Remover técnico

                    </button>

                `;

            }


            card.innerHTML = `

                <div
                    class="avatar tecnico-avatar"
                >

                    ${escaparHTML(
                        primeiraLetra
                    )}

                </div>


                <div class="tecnico-info">

                    <h4>

                        ${escaparHTML(
                            tecnico.nome ||
                            "Sem nome"
                        )}

                    </h4>


                    <p>

                        Técnico de Suporte

                    </p>


                    <span
                        class="status resolvido"
                    >

                        Disponível

                    </span>


                    ${
                        administrador
                            ? `
                                <div
                                    class="tecnico-acoes"
                                >

                                    ${botaoRemover}

                                </div>
                            `
                            : ""
                    }

                </div>

            `;


            lista.appendChild(
                card
            );

        }

    );

}


/* =====================================================
   BOTÃO NOVO TÉCNICO
===================================================== */

function configurarNovoTecnico() {

    const botao =
        document.getElementById(
            "btnNovoTecnico"
        );


    if (!botao) {

        return;

    }


    /*
     * Somente administrador pode
     * adicionar técnico.
     */

    if (!usuarioEhAdministrador()) {

        botao.style.display =
            "none";

        return;

    }


    botao.addEventListener(
        "click",
        abrirSelecaoTecnico
    );

}


/* =====================================================
   ESCOLHER NOVO TÉCNICO
===================================================== */

async function abrirSelecaoTecnico() {

    if (!usuarioEhAdministrador()) {

        alert(
            "Apenas administradores podem adicionar técnicos."
        );

        return;

    }


    try {

        const resposta =
            await fetch(
                "/api/usuarios"
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar os usuários."
            );

        }


        usuariosAtuais =
            await resposta.json();


        const usuariosDisponiveis =
            usuariosAtuais.filter(

                function (usuario) {

                    return (

                        usuario.cargo !==
                            "Técnico" &&

                        usuario.cargo !==
                            "Administrador"

                    );

                }

            );


        if (
            usuariosDisponiveis.length ===
            0
        ) {

            alert(
                "Não existem usuários disponíveis para serem técnicos."
            );

            return;

        }


        let mensagem =
            "Escolha o usuário que será técnico:\n\n";


        usuariosDisponiveis.forEach(

            function (
                usuario,
                indice
            ) {

                mensagem +=
                    `${indice + 1} - ${usuario.nome} (${usuario.email})\n`;

            }

        );


        const escolha =
            prompt(

                mensagem +
                "\nDigite o número do usuário:"

            );


        if (escolha === null) {

            return;

        }


        const numero =
            Number(
                escolha.trim()
            );


        if (
            !Number.isInteger(numero) ||
            numero < 1 ||
            numero >
                usuariosDisponiveis.length
        ) {

            alert(
                "Escolha inválida."
            );

            return;

        }


        const usuarioEscolhido =
            usuariosDisponiveis[
                numero - 1
            ];


        const confirmar =
            confirm(

                "Deseja transformar este usuário em técnico?\n\n" +

                "Nome: " +
                usuarioEscolhido.nome +

                "\n" +

                "E-mail: " +
                usuarioEscolhido.email

            );


        if (!confirmar) {

            return;

        }


        await tornarTecnico(
            usuarioEscolhido.id
        );

    } catch (erro) {

        console.error(
            "Erro ao escolher técnico:",
            erro
        );


        alert(
            "Não foi possível carregar os usuários."
        );

    }

}


/* =====================================================
   TORNAR USUÁRIO TÉCNICO
===================================================== */

async function tornarTecnico(id) {

    if (!usuarioEhAdministrador()) {

        alert(
            "Apenas administradores podem adicionar técnicos."
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

                            cargo: "Técnico"

                        })

                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível transformar o usuário em técnico."
            );

        }


        alert(
            "Técnico adicionado com sucesso!"
        );


        await carregarTecnicos();


    } catch (erro) {

        console.error(
            "Erro ao tornar técnico:",
            erro
        );


        alert(
            erro.message ||
            "Não foi possível adicionar o técnico."
        );

    }

}


/* =====================================================
   REMOVER TÉCNICO
===================================================== */

async function removerTecnico(id) {

    if (!usuarioEhAdministrador()) {

        alert(
            "Apenas administradores podem remover técnicos."
        );

        return;

    }


    const tecnico =
        tecnicosAtuais.find(

            function (item) {

                return (
                    Number(item.id) ===
                    Number(id)
                );

            }

        );


    if (!tecnico) {

        alert(
            "Técnico não encontrado."
        );

        return;

    }


    const confirmar =
        confirm(

            "Deseja remover este usuário da equipe de técnicos?\n\n" +

            "Nome: " +
            tecnico.nome +

            "\n\n" +

            "Ele continuará cadastrado no sistema como usuário."

        );


    if (!confirmar) {

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

                            cargo: "Usuário"

                        })

                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível remover o técnico."
            );

        }


        alert(
            "Técnico removido com sucesso!"
        );


        await carregarTecnicos();


    } catch (erro) {

        console.error(
            "Erro ao remover técnico:",
            erro
        );


        alert(
            erro.message ||
            "Não foi possível remover o técnico."
        );

    }

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

