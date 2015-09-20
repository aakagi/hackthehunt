
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

presentNotification = function(message, color) {
    
    // Create a view for it
    var container = $("<div>");
    
    var bgColor = (typeof color == 'undefined') ? 'rgba(0, 0, 0, 0.9)' : color;
    
    container.css({
        backgroundColor: bgColor,
        color: "#FFF",
        padding: "20px",
        textAlign: "center",
        fontSize: "12px",
        position: "fixed",
        width: $(window).width(),
        zIndex: 100,
        left: 0
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

showLoading = function() {
    
    $("<div>").addClass("loading-box").css({
        position: "absolute",
        left: "50%",
        marginLeft: "-70px",
        width: "140px",
        height: "80px",
        marginTop: "-40px",
        top: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "#FFF",
        lineHeight: "80px",
        textAlign: "center",
        fontSize: "20px"
    }).text("Loading...").appendTo("body");
    
};

hideLoading = function() {
    
    $(".loading-box").remove();
    
};