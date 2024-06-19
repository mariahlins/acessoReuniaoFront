$(function() {
    function loadPageComponents(title){
        const pagina = window.location.pathname.split("/").pop();
        // Importa o conteúdo do cabeçalho
        $.get("/public/components/cabecalho/cabecalho.html", function(cabecalhoContent) {
            $("main").prepend(cabecalhoContent); 
            //atualiza referenciando o id no titulo
            $("#main-title").text(title);
            // Importa o conteúdo do cabeçalho específico para a página
            switch (pagina) {
                case "salasUniversal.html":
                    $.get("/public/components/botoes/modalCadastrarSala.html", function(modalCadastroSalaContent) {
                        $("main").append(modalCadastroSalaContent);
                        loadModalsAndBody(pagina);
                    });
                    break;
                case "usuariosUniversal.html":
                    $.get("/public/components/botoes/botoaListaNegra.html", function(universalContent) {
                        $("main").append(universalContent);
                        loadModalsAndBody(pagina);
                    });
                    break;
                case "listaNegra.html":
                    $.get("/public/components/botoes/botoaUsuario.html", function(universalContent) {
                        $("main").append(universalContent);
                        loadModalsAndBody(pagina);
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
                        url = "/public/components/body/corpoSalas.html";
                        break;
                    case "usuariosUniversal.html":
                        url = "/public/components/body/corpoUsuarios.html";
                        break;
                    case "cadastroUsuarios.html":
                        url = "/public/components/body/corpoCadastroUsuarios.html";
                        break;
                    case "cadastroSalas.html":
                        url = "/public/components/body/corpoCadastroSalas.html";
                        break;
                    case "edicaoSalas.html":
                        url = "/public/components/body/corpoEditarSalas.html";
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
