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
    var fetchUsers = HtnUsers.find({
        token: session_token
    });
    
    // If there are no users
    if(fetchUsers.length === 0) {
        
        // Return a null value
        return null;
        
    }
    alert(JSON.stringify(fetchUsers.collection));
    // Return the user object
    return fetchUsers[0];
    
}

alert(JSON.stringify(getLocalUser()));