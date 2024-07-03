$(function() {
    function loadPageComponents(title) {
        const pagina = window.location.pathname.split("/").pop();

        // Importa o conteúdo do cabeçalho
        $.get("/public/components/cabecalho/cabecalho.html", function(cabecalhoContent) {
            $("main").prepend(cabecalhoContent); 
            $("#main-title").text(title);

            // Importa o conteúdo específico para cada página
            switch (pagina) {
                case "homeRecepcionista.html":
                    loadModalsAndBody(
                        [
                            "/public/components/modais/modalcpf.html",
                            "/public/components/modais/modalcnpj.html"
                        ],
                        "/public/components/body/corpo.html"
                    );
                    break;
                case "reservas.html":
                    loadModalsAndBody(
                        [],
                        "/public/components/body/corpoReservas.html"
                    );
                    break;
                case "salas.html":
                    loadModalsAndBody(
                        [
                            "/public/components/modais/modalEditarSala.html",
                         ],
                        "/public/components/body/corpoSalas.html"
                    );
                    break;
                case "usuarios.html":
                    loadModalsAndBody(
                        [
                            "/public/components/botoes/botaoListaNegraPadrao.html",
                            "/public/components/modais/modalEditarUsuario.html"
                        ],
                        "/public/components/body/corpoUsuarios.html"
                    );
                    break;
                case "listaNegraPadrao.html":
                    loadModalsAndBody(
                        [
                            "/public/components/botoes/botoaUsuarioPadtao.html"
                        ],
                        "/public/components/body/corpoListaNegra.html"
                    );
                    break;
                default:
                    console.error("Página não encontrada: " + pagina);
                    break;
            }
        });
    }

    function loadModalsAndBody(modalUrls, bodyUrl) {
        const promises = modalUrls.map(url => $.get(url).then(content => $("main").append(content)));

        $.when(...promises).done(function() {
            $.get(bodyUrl, function(bodyContent) {
                $("main").append(bodyContent);
                loadFooter();
            });
        });
    }

    function loadFooter() {
        $.get("/public/components/footer/footer.html", function(footerContent) {
            $("main").append(footerContent);
        });
    }

    loadPageComponents(window.pageTitle);
});
