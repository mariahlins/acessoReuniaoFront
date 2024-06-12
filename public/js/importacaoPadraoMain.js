$(function() {
    // Importa o conteúdo do cabeçalho
    $.get("/public/components/cabecalho.html", function(cabecalhoContent) {
        // Adiciona o conteúdo do cabeçalho ao começo do main
        $("main").append(cabecalhoContent); 

        // Importa o conteúdo do corpo após o cabeçalho ser carregado
        $.get("/public/components/corpo.html", function(corpoContent) {
            // Adiciona o conteúdo do corpo após o cabeçalho dentro do main
            $("main").append(corpoContent); 

            // Importa o conteúdo do footer após o corpo ser carregado
            $.get("/public/components/footer.html", function(footerContent) {
                // Adiciona o conteúdo do footer após o corpo dentro do main
                $("main").append(footerContent);

                //os if que na minha cabeça fazem sentido
                const page = window.location.pathname.split("/").pop();
                
            });
        });
    });

    function loadHomeContent(){
        
    }


});
