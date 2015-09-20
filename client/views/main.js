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
    if(session_token === null) {
        
        // Return a null user value
        return null;
        
    }
    
    // Create a query for the user with this token
    return HtnUsers.findOne({
        token: session_token
    });
    
}

var inQRDisplayMode = false;

/*
Template.main.events({
    'click #my-qr': function() {
        
        inQRDisplayMode = !inQRDisplayMode;
        
        // Are we in QR display mode
        if(inQRDisplayMode) {
            
            $("#my-qr").css({
                
                left: $("#my-qr").position().left,
                top: $("#my-qr").position().top,
                position: "absolute"
                
            }).animate({
                
                left: $(document).width() / 2 - $("#my-qr").width() / 2,
                top: $(document).height() / 2 - $("#my-qr").height() / 2
                
            }, 'slow');
            
        } else {
            
            $("#my-qr").animate({
                
                opacity: 0
                
            }, 'slow', function() {
                
                
                
            });
            
        }
        
    }
});
*/

Template.main.helpers({
    score: function() {
        return getLocalUser().points;
    },
    user_id: function() {
        return getLocalUser().htnId;
    }
});