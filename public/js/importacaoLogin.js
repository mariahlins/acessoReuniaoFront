$(function() {
    $.get("/public/components/login.html", function(loginContent) {
        $("body").append(loginContent); // Adiciona o conteúdo da main no body
        Controller.fazerLogin();
    });
});