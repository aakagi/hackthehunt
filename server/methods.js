
var teamPoints = function(team) {
    var teamUsers = HtnUsers.find({team: team});    

    var total = 0;

    for (var i = 0; i < teamUsers.length; i++) {
        var teamUser = teamUsers[i];
        total += teamUser.points;
    }
    return total;
}

Meteor.methods({
    newPing: function(message) {
        Pings.insert({'time':new Date(),'text': message})
    },
    newUser: function(htnId, email, token, first, last) {
        
        // var chooseTeam = function() {

        // }

        HtnUsers.insert({
            htnId: htnId,
            email: email,
            token: token,
            first: first,
            last: last,
            points: 10,
            team: "blue"
        });
    }
})