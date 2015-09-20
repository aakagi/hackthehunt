


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
        var user = HtnUsers.findOne({token: token});

        code = code.toString()
        var codeUser = HtnUsers.findOne({htnId: code});

        if (codeUser) {

            var scanningNewAccount = function() {
                if (user.used_ids) {
                    for (var i = 0; i < user.used_ids.length; i++) {
                        var current = user.used_ids[i];
                        if (current == code) {
                            return false;
                        }
                    }
                }
                // Push user into array
                HtnUsers.update({_id: user._id}, {
                    $push: {
                        used_ids: code
                    }
                });
                return true;
            }
            if (scanningNewAccount()) {
                if (codeUser.team == user.team) {
                    Meteor.call('changePoints', user._id, 25)
                } 
                else if (codeUser.team != user.team) {
                    // give to them
                    // remove points from me
                    Meteor.call('changePoints', user._id, 100);
                    Meteor.call('changePoints', codeUser._id, -100);
                }
            } else {
                console.log("User has already been scanned");
            }

        } else {
            HtnUsers.update({_id: user._id}, {
                $push: {
                    pending: code
                }
            }, function(err) {
                if (err) console.log(err);
            });
        }

        console.log(codeUser);
    }

})
