
getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return null;
};

presentNotification = function(message) {
    
    // Create a view for it
    var container = $("<div>");
    container.css({
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        color: "#FFF",
        padding: "20px",
        textAlign: "center",
        fontSize: "12px",
        position: "fixed",
        width: $(document).width()
    });
    container.css("top", "-80px");
    container.text(message);
    container.appendTo("body");
    container.animate({
        top: 0
    }, 'slow', function() {
        
        setTimeout(function() {
            
            container.animate({
                top: "-80px"
            }, 'slow');
            
        }, 5000);
        
    });
    
};