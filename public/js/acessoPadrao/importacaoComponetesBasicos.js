$(function() {
  $.get("/public/components/asiderBars/asideBar.html", function(asideContent) {
      $("body").append(asideContent); 
        $.get("/public/components/main/main.html", function(mainContent) {
          $("body").append(mainContent);
        });
    });
});
