/* =====================================================
   CONFIGURAÇÕES DO USUÁRIO
===================================================== */


/* =====================================================
   OBTER USUÁRIO LOGADO
===================================================== */

function obterUsuarioParaFoto() {

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
            !usuario.email
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
   PREENCHER DADOS DO PERFIL
===================================================== */

function preencherDadosPerfil() {

    const usuario =
        obterUsuarioParaFoto();

    if (!usuario) {
        return;
    }

    const nome =
        usuario.nome ||
        "Usuário";

    const sobrenome =
        usuario.sobrenome ||
        "";

    const nomeCompleto =
        `${nome} ${sobrenome}`.trim();

    const email =
        usuario.email ||
        "—";

    const cargo =
        usuario.cargo ||
        "Usuário";


    /* NOME */

    const perfilNome =
        document.getElementById(
            "perfilNome"
        );

    if (perfilNome) {

        perfilNome.textContent =
            nomeCompleto;
    }


    /* E-MAIL */

    const perfilEmail =
        document.getElementById(
            "perfilEmail"
        );

    if (perfilEmail) {

        perfilEmail.textContent =
            email;
    }


    /* CARGO */

    const perfilCargo =
        document.getElementById(
            "perfilCargo"
        );

    if (perfilCargo) {

        perfilCargo.textContent =
            cargo;
    }
}


/* =====================================================
   CHAVE DA FOTO
===================================================== */

function obterChaveFoto() {

    const usuario =
        obterUsuarioParaFoto();

    if (!usuario) {
        return null;
    }

    return (
        "fotoPerfil_" +
        usuario.email
    );
}


/* =====================================================
   APLICAR FOTO NOS AVATARES
===================================================== */

function aplicarFotoPerfil(foto) {

    const avatares = [

        document.getElementById(
            "avatarPerfil"
        ),

        document.getElementById(
            "avatarUsuario"
        ),

        document.getElementById(
            "avatarTopo"
        )
    ];


    avatares.forEach(

        function (avatar) {

            if (!avatar) {
                return;
            }


            /* FOTO */

            if (foto) {

                avatar.innerHTML = "";


                const imagem =
                    document.createElement(
                        "img"
                    );


                imagem.src = foto;

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


                return;
            }


            /* INICIAL */

            const usuario =
                obterUsuarioParaFoto();


            const nome =
                usuario?.nome ||
                "Usuário";


            const inicial =
                nome
                    .trim()
                    .charAt(0)
                    .toUpperCase();


            avatar.innerHTML =
                inicial || "U";
        }
    );
}


/* =====================================================
   CARREGAR FOTO SALVA
===================================================== */

function carregarFotoPerfil() {

    const chave =
        obterChaveFoto();

    if (!chave) {
        return;
    }


    const foto =
        localStorage.getItem(
            chave
        );


    if (foto) {

        aplicarFotoPerfil(
            foto
        );
    }
}


/* =====================================================
   REDUZIR TAMANHO DA FOTO
===================================================== */

function reduzirFoto(
    arquivo,
    callback
) {

    const leitor =
        new FileReader();


    leitor.onload =
        function (evento) {

            const imagem =
                new Image();


            imagem.onload =
                function () {

                    const tamanhoMaximo =
                        500;


                    let largura =
                        imagem.width;

                    let altura =
                        imagem.height;


                    if (
                        largura >
                        tamanhoMaximo ||
                        altura >
                        tamanhoMaximo
                    ) {

                        if (
                            largura >
                            altura
                        ) {

                            altura =
                                altura *
                                (
                                    tamanhoMaximo /
                                    largura
                                );

                            largura =
                                tamanhoMaximo;

                        } else {

                            largura =
                                largura *
                                (
                                    tamanhoMaximo /
                                    altura
                                );

                            altura =
                                tamanhoMaximo;
                        }
                    }


                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width =
                        largura;

                    canvas.height =
                        altura;


                    const contexto =
                        canvas.getContext(
                            "2d"
                        );


                    contexto.drawImage(
                        imagem,
                        0,
                        0,
                        largura,
                        altura
                    );


                    const foto =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.8
                        );


                    callback(
                        foto
                    );
                };


            imagem.src =
                evento.target.result;
        };


    leitor.readAsDataURL(
        arquivo
    );
}


/* =====================================================
   ALTERAR FOTO
===================================================== */

function configurarAlterarFoto() {

    const input =
        document.getElementById(
            "fotoPerfil"
        );


    if (!input) {
        return;
    }


    input.addEventListener(

        "change",

        function () {

            const arquivo =
                input.files[0];


            if (!arquivo) {
                return;
            }


            if (
                !arquivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Selecione uma imagem válida."
                );

                input.value = "";

                return;
            }


            reduzirFoto(

                arquivo,

                function (foto) {

                    const chave =
                        obterChaveFoto();


                    if (!chave) {

                        alert(
                            "Usuário não encontrado."
                        );

                        return;
                    }


                    try {

                        localStorage.setItem(
                            chave,
                            foto
                        );


                        aplicarFotoPerfil(
                            foto
                        );


                        alert(
                            "Foto alterada com sucesso!"
                        );


                    } catch (erro) {

                        console.error(
                            "Erro ao salvar foto:",
                            erro
                        );


                        alert(
                            "Não foi possível salvar a foto."
                        );
                    }
                }
            );
        }
    );
}


/* =====================================================
   REMOVER FOTO
===================================================== */

function configurarRemoverFoto() {

    const botao =
        document.getElementById(
            "removerFoto"
        );


    if (!botao) {
        return;
    }


    botao.addEventListener(

        "click",

        function () {

            const confirmar =
                confirm(
                    "Deseja remover sua foto?"
                );


            if (!confirmar) {
                return;
            }


            const chave =
                obterChaveFoto();


            if (!chave) {
                return;
            }


            localStorage.removeItem(
                chave
            );


            const input =
                document.getElementById(
                    "fotoPerfil"
                );


            if (input) {
                input.value = "";
            }


            aplicarFotoPerfil(
                null
            );


            alert(
                "Foto removida com sucesso!"
            );
        }
    );
}


/* =====================================================
   INICIAR
===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        preencherDadosPerfil();

        carregarFotoPerfil();

        configurarAlterarFoto();

        configurarRemoverFoto();
    }
);

