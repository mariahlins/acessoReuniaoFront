$(function() {
    function loadPageComponents(title,subtitle){
        const pagina = window.location.pathname.split("/").pop();
        // Importa o conteúdo do cabeçalho
        $.get("/public/components/cabecalho.html", function(cabecalhoContent) {
            $("main").prepend(cabecalhoContent); 
            //atualiza referenciando o id no titulo
            $("#main-title").text(title);
            $("#sub-title").text(subtitle);

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
                            case "reservas.html":
                                url = "/public/components/corpoReservas.html";
                                break;
                            case "salas.html":
                                url = "/public/components/corpoSalas.html";
                                break;
                            case "usuarios.html":
                                url = "/public/components/corpoUsuarios.html";
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
