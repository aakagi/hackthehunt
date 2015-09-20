var teamPoints = function(team) {
    var teamUsers = HtnUsers.find({team: team}).fetch();    

    var total = 0;

    for (var i = 0; i < teamUsers.length; i++) {
        var teamUser = teamUsers[i];
        total += teamUser.points;
    }

    return total;
}

Template.scoreboard.helpers({
    yellowPoints: function() {
        return teamPoints("yellow");
    },
    bluePoints: function() {
        return teamPoints("blue");
    },
    redPoints: function() {
        return teamPoints("red");
    },
    total: function() {
        return teamPoints("red") + teamPoints("blue") + teamPoints("yellow")
    }
});
