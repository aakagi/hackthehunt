


Meteor.methods({
    newPing: function(message) {
        Pings.insert({'time':new Date(),'text': message})
    },
    newUser: function(htnId, email, token, first, last) {
        
        var teamPoints = function(team) {
            var teamUsers = HtnUsers.find({team: team});    

            var total = 0;

            for (var i = 0; i < teamUsers.length; i++) {
                var teamUser = teamUsers[i];
                total += teamUser.points;
            }
            return total;
        }

        var chooseTeam = function() {
            var redPoints = teamPoints("red");
            var bluePoints = teamPoints("blue");
            var yellowPoints = teamPoints("yellow");

            if (redPoints > bluePoints && redPoints > yellowPoints) {
                return "red";
            }
            if (bluePoints > redPoints && bluePoints > yellowPoints) {
                return "blue";
            }
            if (yellowPoints > bluePoints && yellowPoints > redPoints) {
                return "yellow";
            }
            else {
                var random = Math.random()
                if (random > 0.666666) return "blue";
                else if (random < 0.333333) return "yellow";
                else return "red";
            }
        }
        var chosenTeam = chooseTeam();

        console.log(chosenTeam);

        HtnUsers.insert({
            htnId: htnId,
            email: email,
            token: token,
            first: first,
            last: last,
            points: 10,
            team: chosenTeam
        });
    },
    updateUserToken: function(htnId, newToken) {
        HtnUsers.update({htnId: htnId}, {
            $set: {
                token: newToken
            }
        });
    }

})