var UserSchema = new SimpleSchema({
    htnId: {
        type: String
    },
    email: {
        type: String
    },
    token: {
        type: String
    },
    first: {
        type: String
    },
    last: {
        type: String
    },
    points: {
        type: Number
    },
    team: {
        type: String
    },
    pending: {
        type: [String],
        optional: true
    }
});

HtnUsers.attachSchema(UserSchema);

var PingSchema = new SimpleSchema({
    time: {
        type: Date
    },
    text: {
        type: String
    }
});

Pings.attachSchema(PingSchema);