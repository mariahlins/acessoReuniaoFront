$(function() {
  $.get("/public/components/asideBar.html", function(asideContent) {
      $("body").append(asideContent); // Adiciona o conteúdo do asideBar ao final do body
        $.get("/public/components/main.html", function(mainContent) {
          $("body").append(mainContent); // Adiciona o conteúdo da main no body
        });
    });
});

