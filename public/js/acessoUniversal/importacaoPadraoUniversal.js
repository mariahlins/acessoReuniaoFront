$(function() {
    function loadPageComponents(title,subtitle){
        const pagina = window.location.pathname.split("/").pop();
        // Importa o conteúdo do cabeçalho
        $.get("/public/components/botoes/dropDawnUniversal.html", function(universalContent){
            $("main").append(universalContent);
            $("#main-title").text(title);

            //importa o conteudo do modal do cpf
            $.get("/public/components/botoes/modalcpf.html", function(modalcpfContent){
                $("main").append(modalcpfContent);

                //importa o conteudo do modal para reserva de empresas
                $.get("/public/components/botoes/modalcnpj.html",function(modalcnpjContent){
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
                                url = "public/components/body/corpoCadastroUsuarios.html";
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
                                //ta dentro da função pois preciso que o querido seja o último a ser carregado
                                $.get("/public/components/footer/footer.html", function(footerContent) {
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
