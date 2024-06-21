$(function() {
    function loadPageComponents(title) {
        const pagina = window.location.pathname.split("/").pop();

        // Importa o conteúdo do cabeçalho
        $.get("/public/components/cabecalho/cabecalho.html", function(cabecalhoContent) {
            $("main").prepend(cabecalhoContent); 
            // Atualiza referenciando o id no título
            $("#main-title").text(title);

            // Importa o conteúdo específico para cada página
            switch (pagina) {
                case "salasUniversal.html":
                    $.get("/public/components/botoes/modalCadastrarSala.html", function(modalCadastroSalaContent) {
                        $("main").append(modalCadastroSalaContent);
                        $.get("/public/components/botoes/modalEditarSala.html", function(modalEditarSalaContent) {
                            $("main").append(modalEditarSalaContent);
                            loadModalsAndBody(pagina);
                        });
                    });
                    break;
                case "usuariosUniversal.html":
                    $.get("/public/components/botoes/botaoListaNegra.html", function(universalContent) {
                        $("main").append(universalContent);
                        $.get("/public/components/botoes/modalEditarUsuario.html", function(modalEditarUsuarioContent) {
                            $("main").append(modalEditarUsuarioContent);
                            loadModalsAndBody(pagina);
                        });
                    });
                    break;
                case "listaNegra.html":
                    $.get("/public/components/botoes/botaoUsuario.html", function(universalContent) {
                        $("main").append(universalContent);
                        loadModalsAndBody(pagina);
                    });
                    break;
                case "recepcionista.html":
                    $.get("/public/components/botoes/modalCadastrarRecepcionista.html", function(modalCadastroRecepcionistaContent) {
                        $("main").append(modalCadastroRecepcionistaContent);
                        $.get("/public/components/botoes/modalEditarRecepcionista.html", function(modalEditarRecepcionistaContent) {
                            $("main").append(modalEditarRecepcionistaContent);
                            loadModalsAndBody(pagina);
                        });
                    });
                    break;
                default:
                    loadModalsAndBody(pagina);
                    break;
            }
        });
    }

    function loadModalsAndBody(pagina) {
        // Importa o conteúdo do modal do CPF
        $.get("/public/components/botoes/modalcpf.html", function(modalcpfContent) {
            $("main").append(modalcpfContent);
            // Importa o conteúdo do modal para reserva de empresas
            $.get("/public/components/botoes/modalcnpj.html", function(modalcnpjContent) {
                $("main").append(modalcnpjContent);

                let url;
                switch (pagina) {
                    case "homeUniversal.html":
                        url = "/public/components/body/corpoUniversal.html";
                        break;
                    case "reservasUniversal.html":
                        url = "/public/components/body/corpoReservas.html";
                        break;
                    case "salasUniversal.html":
                        url = "/public/components/body/corpoSalasUniversal.html";
                        break;
                    case "usuariosUniversal.html":
                        url = "/public/components/body/corpoUsuarios.html";
                        break;
                    case "cadastroUsuarios.html":
                        url = "/public/components/body/corpoCadastroUsuarios.html";
                        break;
                    case "listaNegra.html":
                        url = "/public/components/body/corpoListaNegra.html";
                        break;
                    case "recepcionista.html":
                        url = "/public/components/body/corpoRecepcionista.html";
                        break;
                    default:
                        console.error("Página não encontrada: " + pagina);
                        return;
                }

                if (url) {
                    $.get(url, function(content) {
                        $("main").append(content);
                        // Importa o conteúdo do footer após o corpo ser carregado
                        $.get("/public/components/footer/footer.html", function(footerContent) {
                            // Adiciona o conteúdo do footer após o corpo dentro do main
                            $("main").append(footerContent);
                        });
                    });
                }
            });
        });
    }

    loadPageComponents(window.pageTitle);
});
