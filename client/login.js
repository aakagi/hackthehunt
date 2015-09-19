var API_HOST = "https://hackerapi.com/v1";
var API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MzM5MTUyOTgsImlkIjoyLCJldnQiOlsxXSwidHlwIjoidXNyIn0.USfHFAJ_AYw4hP-wAjiVSWiXbwxPwWLjzzC5oXhVCws";


function getToken(username, password, callback) {
    var req = {};
    req.method = 'POST';
    req.endpoint = '/auth/user';
    req.callback = callback;
    req.payload = {
        username: username,
        password: password
    };

    return makeRequest(req);
};

function makeRequest(req) {
    var callback = req.callback;
    console.log(req);
    $.ajax({
        url: API_HOST + req.endpoint + '?token=' + API_TOKEN,
        method: req.method,
        data: JSON.stringify(req.payload),
        success: function(data) {
            if (callback === undefined) {
                console.log(data);
                return
            };

            callback(data);
        }
    });
}

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

Template.login.events({
    
    // When the form is submitted
    'submit #login-form': function(e) {
        
        // Prevent the submission of the form
        e.preventDefault();
        
        // Get the values for the email and password
        var email = $("#email").val();
        var password = $("#password").val();
        
        // Get the token for the login
        getToken(email, password, function(response) {
            
            // If the query was unsuccessful
            if(response.success == false) {
                
                // Get the message from the backend
                var message = response.message;
                
                // Alert that shit
                alert(message);
                
            } else {
            
                // Get the value for the token 
                var tokenValue = response.token;
                alert(JSON.stringify(response));
                
                // Save the token value locally
                setCookie("session_token", tokenValue, 100);
                
                // If the user has not logged in before
                if(getCookie("logged_in") === null) {
                    
                    // Get information to push to the database
                    var user_id = response.id;
                    var user_email = response.email;
                    var user_name = response.name;
                    
                    // Set the cookie value
                    setCookie("logged_in", "true", 100);
                    
                    // Redirect to the welcome page
                    Router.go("/welcome");
                    
                } else {
                    
                    // Redirect to the main page
                    Router.go("/main");
                    
                }
            }
            
        });
        
    }
});