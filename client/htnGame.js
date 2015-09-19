Session.setDefault('counter', 0);

Template.htnGame.helpers({
    counter: function () {
        return Session.get('counter');
    },
    test: function() {
        return qrScanner.imageData();
    }

});

Template.htnGame.events({
    'click button': function () {
        // increment the counter when button is clicked
        Session.set('counter', Session.get('counter') + 1);
    }
});

// Template.htnGame.qrCode({

// })