Meteor.methods({
    newPing: function(message) {
        Pings.insert({'time':new Date(),'text': message})
    }
})