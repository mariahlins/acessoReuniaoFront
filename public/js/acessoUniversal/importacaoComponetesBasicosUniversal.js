$(function() {
    $.get("/public/components/asiderBars/asideBarUniversal.html", function(asideContent) {
        $("body").append(asideContent); 
          $.get("/public/components/main/mainUniversal.html", function(mainContent) {
            $("body").append(mainContent);
          });
      });
  });
  