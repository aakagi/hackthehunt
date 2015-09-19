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
    }
});

HtnUsers.attachSchema(UserSchema);