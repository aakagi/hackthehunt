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
                
                // Save the token value locally
                setCookie("session_token", tokenValue, 100);
                
                // If the user has not logged in before
                if(getCookie("logged_in") === null) {
                    
                    // Get the users with the same token
                    var matchedUsers = HtnUsers.find({
                        token: tokenValue
                    });
                    
                    // If there is not already this user in the database
                    if(matchedUsers.length == 0) {
                    
                        // Get information to push to the database
                        var user_id = response.id;
                        var user_email = response.email;
                        var user_name = response.name;
                        var user_name_parts = user_name.split(" ");
                        var user_first_name = user_name_parts[0];
                        var user_last_name = user_name_parts[1];

                        // Query for all the users
                        var allUsers = HtnUsers.find();

                        // The scores for the teams
                        var teamScores = {
                            "Blue": 0,
                            "Red": 0,
                            "Green": 0
                        };

                        // Loop through each user
                        for(var i = 0; i < allUsers.length; i++) {

                            // Get this user
                            var thisUser = allUsers[i];

                            // Increment the team score
                            teamScores[thisUser.team] += thisUser.score;

                        }

                        // Get the team with the lowest score
                        var lowestTeamName = null;
                        for(var key in teamScores) {

                            // If this team has a lower score
                            if(teamScores[key] < teamScores[lowestTeamName] || lowestTeamName === null) lowestTeamName = key;

                        }


                        // Pick a team for the user
                        var teamName = lowestTeamName;

                        // Add the user to the database
                        HtnUsers.insert({
                            htnId: user_id,
                            email: user_email,
                            token: tokenValue,
                            first: user_first_name,
                            last: user_last_name,
                            points: 0,
                            team: teamName
                        });

                        // Set the cookie value
                        setCookie("logged_in", "true", 100);

                        // Redirect to the welcome page
                        Router.go("/welcome");
                        
                    } else {
                        
                        // Redirect to the main page
                        Router.go("/");
                        
                    }
                    
                } else {
                    
                    // Redirect to the main page
                    Router.go("/");
                    
                }
            }
            
        });
        
    }
});