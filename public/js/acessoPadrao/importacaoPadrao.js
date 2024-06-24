$(function() {
    function loadPageComponents(title) {
        const pagina = window.location.pathname.split("/").pop();

        // Importa o conteúdo do cabeçalho
        $.get("/public/components/cabecalho/cabecalho.html", function(cabecalhoContent) {
            $("main").prepend(cabecalhoContent);
            $("#main-title").text(title);

            // Importa o conteúdo dos modais
            $.get("/public/components/modais/modalcpf.html", function(modalcpfContent) {
                $("main").append(modalcpfContent);

                $.get("/public/components/modais/modalcnpj.html", function(modalcnpjContent) {
                    $("main").append(modalcnpjContent);

                    // Determina o URL do conteúdo do corpo da página
                    let url;
                    switch (pagina) {
                        case "homeRecepcionista.html":
                            url = "/public/components/body/corpo.html";
                            break;
                        case "reservas.html":
                            url = "/public/components/body/corpoReservas.html";
                            break;
                        case "salas.html":
                            url = "/public/components/body/corpoSalas.html";
                            break;
                        case "usuarios.html":
                            $.get("/public/components/botoes/botaoListaNegraPadrao.html", function(universalContent) {
                                $("main").append(universalContent);
                                loadModalsAndBody("/public/components/body/corpoUsuarios.html");
                            });
                            return; // Finaliza a função, pois o corpo será carregado dentro do callback
                        case "listaNegraPadrao.html":
                            $.get("/public/components/botoes/botoaUsuarioPadtao.html", function(universalContent) {
                                $("main").append(universalContent);
                                loadModalsAndBody("/public/components/body/corpoListaNegra.html");
                            });
                            return; // Finaliza a função, pois o corpo será carregado dentro do callback
                        default:
                            console.error("Página não encontrada: " + pagina);
                            return;
                    }

                    if (url) {
                        $.get(url, function(bodyContent) {
                            $("main").append(bodyContent);
                            loadFooter();
                        });
                    }
                });
            });
        });
    }

    function loadModalsAndBody(bodyUrl) {
        $.get(bodyUrl, function(bodyContent) {
            $("main").append(bodyContent);
            loadFooter();
        });
    }

    function loadFooter() {
        $.get("/public/components/footer/footer.html", function(footerContent) {
            $("main").append(footerContent);
        });
    }

    loadPageComponents(window.pageTitle);
});
