Template.ping.helpers({
    pings: function() {
        return Pings.find();
    },
    test: function() {
        return "yes";
    }
})