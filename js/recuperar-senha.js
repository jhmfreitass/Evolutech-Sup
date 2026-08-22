// =====================================================
// RECUPERAÇÃO DE SENHA
// =====================================================

const ADMIN_EMAIL = "jhmourafreitas@gmail.com";


const recuperarSenhaForm =
    document.getElementById("recuperarSenhaForm");


if (recuperarSenhaForm) {

    recuperarSenhaForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const novaSenha =
                document
                    .getElementById("novaSenha")
                    .value;


            const confirmarSenha =
                document
                    .getElementById("confirmarSenha")
                    .value;


            // =================================================
            // SENHA MÍNIMA
            // =================================================

            if (novaSenha.length < 6) {

                alert(
                    "A senha precisa ter pelo menos 6 caracteres."
                );

                return;
            }


            // =================================================
            // CONFIRMAR SENHA
            // =================================================

            if (novaSenha !== confirmarSenha) {

                alert(
                    "As senhas não são iguais."
                );

                return;
            }


            // =================================================
            // NÃO ALTERAR SENHA DO ADMINISTRADOR POR AQUI
            // =================================================

            if (email === ADMIN_EMAIL) {

                alert(
                    "A senha do administrador principal não pode ser alterada por esta tela."
                );

                return;
            }


            // =================================================
            // PEGAR USUÁRIOS
            // =================================================

            const usuarios =
                JSON.parse(
                    localStorage.getItem("usuarios")
                ) || [];


            // =================================================
            // PROCURAR E-MAIL
            // =================================================

            const indice =
                usuarios.findIndex(function (usuario) {

                    return usuario.email === email;

                });


            // =================================================
            // E-MAIL NÃO ENCONTRADO
            // =================================================

            if (indice === -1) {

                alert(
                    "Este e-mail não está cadastrado."
                );

                return;
            }


            // =================================================
            // ALTERAR SENHA
            // =================================================

            usuarios[indice].senha = novaSenha;


            // =================================================
            // SALVAR
            // =================================================

            localStorage.setItem(
                "usuarios",
                JSON.stringify(usuarios)
            );


            alert(
                "Senha redefinida com sucesso!"
            );


            // =================================================
            // VOLTAR PARA LOGIN
            // =================================================

            window.location.href = "login.html";

        }
    );

}