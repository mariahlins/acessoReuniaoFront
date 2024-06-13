$(function() {
    // Importa o conteúdo do cabeçalho
    $.get("/public/components/cabecalho.html", function(cabecalhoContent) {
        // Adiciona o conteúdo do cabeçalho ao começo do main
        $("main").append(cabecalhoContent); 
        //importa o conteudo do modal do cpf
        $.get("/public/components/modalcpf.html", function(modalcpfContent){
            $("main").append(modalcpfContent);
            //importa o conteudo do modal para reserva de empresas
            $.get("/public/components/modalcnpj.html",function(modalcnpjContent){
                $("main").append(modalcnpjContent);
                // Importa o conteúdo do corpo após o cabeçalho ser carregado
                $.get("/public/components/corpo.html", function(corpoContent) {
                    // Adiciona o conteúdo do corpo após o cabeçalho dentro do main
                    $("main").append(corpoContent); 
                // Importa o conteúdo do footer após o corpo ser carregado
                    $.get("/public/components/footer.html", function(footerContent) {
                        // Adiciona o conteúdo do footer após o corpo dentro do main
                        $("main").append(footerContent);
                    });
                });
            });
        });
    });
});
