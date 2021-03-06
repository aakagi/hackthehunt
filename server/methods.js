


Meteor.methods({
    newPing: function(message) {
        Pings.insert({'time':new Date(),'text': message})
    },
    changePoints: function(_id, amount) {
        var user = HtnUsers.findOne({_id: _id});

        HtnUsers.update({_id: _id}, {
            $set: {
                points: user.points + amount
            }
        });
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

        var newUserId = HtnUsers.insert({
            htnId: htnId,
            email: email,
            token: token,
            first: first,
            last: last,
            points: 0,
            team: chosenTeam,
            pending: [],
            used_ids: []
        });

        if (newUserId) {
            var newUserDoc = HtnUsers.findOne({_id: newUserId});
            var invitingUser = HtnUsers.findOne({
                pending: newUserDoc.htnId
            });
            console.log(invitingUser);
            HtnUsers.update({
                _id: invitingUser._id
            }, {
                $pull: {
                    pending: newUserDoc.htnId
                }
            });
            Meteor.call('changePoints', invitingUser._id, 50);
        }
    },
    updateUserToken: function(htnId, newToken) {
        HtnUsers.update({htnId: htnId}, {
            $set: {
                token: newToken
            }
        });
    },
    codeScanned: function(token, code) {
        var currentUser = HtnUsers.findOne({token: token});

        code = code.toString()
        var codeUser = HtnUsers.findOne({htnId: code});

        if (codeUser) {

            var scanningNewAccount = function() {
                if (currentUser.used_ids) {
                    for (var i = 0; i < currentUser.used_ids.length; i++) {
                        var current = currentUser.used_ids[i];
                        if (current == code) {
                            return false;
                        }
                    }
                }
                // Push user into array
                HtnUsers.update({_id: currentUser._id}, {
                    $push: {
                        used_ids: code
                    }
                });
                return true;
            }
            if (scanningNewAccount()) {
                if (codeUser.team == currentUser.team) {
                    Meteor.call('changePoints', currentUser._id, 25)
                } 
                else if (codeUser.team != currentUser.team) {
                    // give to them
                    // remove points from me
                    Meteor.call('changePoints', currentUser._id, -100);
                    Meteor.call('changePoints', codeUser._id, 100);
                    Meteor.setTimeout(function() {Router.go('/')}, 500);
                }
            } else {
                console.log("User has already been scanned");
            }

        } else {
            HtnUsers.update({_id: currentUser._id}, {
                $push: {
                    pending: code
                }
            }, function(err, res) {
                if (!err) {
                    Router.go('/');
                } else {console.log(err);}
            });
        }

        console.log(codeUser);
    }

})
