$(function() {
    function loadPageComponents(title,subtitle){
        const pagina = window.location.pathname.split("/").pop();
        // Importa o conteúdo do cabeçalho
        $.get("/public/components/universal.html", function(universalContent){
            $("main").append(universalContent);
            $("#main-title").text(title);

            //importa o conteudo do modal do cpf
            $.get("/public/components/modalcpf.html", function(modalcpfContent){
                $("main").append(modalcpfContent);

                //importa o conteudo do modal para reserva de empresas
                $.get("/public/components/modalcnpj.html",function(modalcnpjContent){
                    $("main").append(modalcnpjContent);

                    let url;
                        switch (pagina) {
                            case "home.html":
                                url = "/public/components/corpo.html";
                                break;
                            case "homeUniversal.html":
                                url = "/public/components/corpo.html";
                                break;
                            case "reservas.html":
                                url = "/public/components/corpoReservas.html";
                                break;
                            case "salas.html":
                                url = "/public/components/corpoSalas.html";
                                break;
                            case "usuarios.html":
                                url = "/public/components/corpoUsuarios.html";
                                break;
                            case "cadastroUsuarios.html":
                                url = "public/components/corpoCadastroUsuarios.html";
                                break;
                            case "cadastroSalas.html":
                                url = "/public/components/corpoCadastroSalas.html";
                                break;
                            case "edicaoSalas.html":
                                url = "/public/components/corpoEdicaoSalas.html";
                                break;
                            case "listaNegra.html":
                                url = "/public/components/listaNegra.html";
                                break;
                            default:
                                console.error("Página não encontrada: " + pagina);
                                return; 
                        }

                        if (url) {
                            $.get(url, function(content) {
                                $("main").append(content); 
                                // Importa o conteúdo do footer após o corpo ser carregado
                                //ta dentro da função pois preciso que o querido seja o último a ser carregado
                                $.get("/public/components/footer.html", function(footerContent) {
                                    // Adiciona o conteúdo do footer após o corpo dentro do main
                                    $("main").append(footerContent);
                                });
                            });
                        }
                });
            });
        });
    }
    loadPageComponents(window.pageTitle, window.pageSubtitle);
});
