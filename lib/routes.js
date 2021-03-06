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

/*
 *  Determines whether or not the local user is current logged in
 */
function isLoggedIn() {
    
    // If the user is not logged in
    return (getCookie("session_token") !== null);
    
}

Router.route('/', function () {
    
    // If the user is logged in
    if(!isLoggedIn()) {
        Router.go("/login");
    }
    else {
    
        var code = this.params.query.code;

        this.layout('layout');
        this.render('main');

        if (code == "") {
            presentNotification("That QR was invalid!", "red");
        }

        if (code) {
            Meteor.call('codeScanned', getCookie("session_token"), code, function(err) {
                if (!err) {presentNotification("Success!", "blue")}
            });
            // Router.go("/");
        }
        
    }
    
});

Router.route('/login', function () {
    
    // If the user IS logged in
    if(isLoggedIn()) {
        
        // Go to the main page
        Router.go("/");
        
    } else {
        
        this.layout('layout');
        this.render('login');
        
    }
});

Router.route('/welcome', function () {
    
    // If the user is NOT logged in
    if(!isLoggedIn()) {
        
        // Go to the login page
        Router.go("/login");
        
    } else {
        
        this.layout('layout');
        this.render('welcome');
        
    }
});

Router.route('/fail', function () {
    this.layout('layout');
    this.render('fail');
});

Router.route('/ping', function() {
    
    this.layout('layout');
    this.render('ping');
});

Router.route('/scoreboard', function() {
    this.layout('layout');
    this.render('scoreboard');
});

Router.route('/logout', function() {
   
    setCookie('session_token', '', -100);
    setCookie('logged_in', '', -100);
    Router.go('/');
    
});

