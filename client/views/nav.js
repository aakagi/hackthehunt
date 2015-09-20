Template.nav.helpers({
    team: function () {
        var currentUserToken = getCookie("session_token");
        var user = HtnUsers.findOne({token: currentUserToken});
        return user.team;
    }
});