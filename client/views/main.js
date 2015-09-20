function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return null;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getLocalUser() {
    
    // Get the session token
    var session_token = getCookie("session_token");
    
    // If the session token is undefined
    if(session_token == null) {
        
        // Return a null user value
        return null;
        
    }
    
    // Create a query for the user with this token
    return HtnUsers.findOne({
        token: session_token
    });
    
}

var inQRDisplayMode = false;

Template.main.events({
    'click #my-qr': function() {
        
        inQRDisplayMode = !inQRDisplayMode;
        
        // Are we in QR display mode
        if(inQRDisplayMode) {
            
            $("#upload-button").fadeOut('fast');
            $("#nav-master").fadeOut('fast');
            $(".score, .score_sub").fadeOut('fast');
            
            $("#my-qr").fadeOut('fast', function() {
                
                $("#my-qr-title").css("font-size", "20px");
                
                $("#my-qr").css({
                
                    left: $("#my-qr").position().left,
                    top: $("#my-qr").position().top,
                    width: 280,
                    height: 280,
                    position: "absolute",
                    left: $(document).width() / 2 - 280 / 2,
                    top: $(document).height() / 2 - 280 / 2

                }).fadeIn('slow');
                
            });
            
        } else {
            
            $("#upload-button").fadeIn('fast');
            $("#nav-master").fadeIn('fast');
            $(".score, .score_sub").fadeIn('fast');
            
            $("#my-qr").fadeOut('fast', function() {
                
                $("#my-qr-title").css("font-size", "14px");
                
                $("#my-qr").css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    width: 160,
                    height: 160
                }).fadeIn('slow');
                
            });
            
        }
        
    }
});

Template.main.helpers({
    score: function() {
        if (getLocalUser()) {
            return getLocalUser().points
        }
    },
    user_id: function() {
        if (getLocalUser()) {
            return getLocalUser().htnId;
        }
    }
});