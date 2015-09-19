Router.route('/', function () {
    // if user logged in
    this.layout('layout');
    this.render('main');
    // else go to login
    // Router.go('/login');
});

Router.route('/login', function () {
    this.layout('layout');
    this.render('login');
});

Router.route('/welcome', function () {
    this.layout('layout');
    this.render('welcome');
});

Router.route('/fail', function () {
    this.layout('layout');
    this.render('fail');
});

Router.route('/ping', function() {
    this.layout('layout');
    this.render('ping');
});

