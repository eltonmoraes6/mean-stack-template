const fs = require('fs');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../app');
const User = require('../src/models/user');
const Task = require('../src/models/task');

const login_details = {
    'email': process.env.MAIL_USER,
    'password': process.env.MAIL_PASS
};

const register_details = {
    'email': process.env.MAIL_USER,
    'name': process.env.MAIL_USERNAME,
    'password': process.env.MAIL_PASS,
    'confirmPassword': process.env.MAIL_PASS,
};

const userInfo = {};

const newTask = ({
    title: 'test',
    description: 'test ',
    number: 2,
    author: 'test',
    genres: 'test'
});

describe('Create Account and Activate User', () => {
    beforeEach((done) => {
        // Reset user mode before each test
        User.deleteMany({}, (err) => {
            console.log(err);
            done();
        })
    });

    describe('/POST Register', () => {
        it('it should Register and activate user account', (done) => {
            chai.request(app)
                .post('/api/users/signup')
                .send(register_details) // Sending $http.post or this.http.post
                .end((err, res) => { // Get a response from the endpoint
                    // in other words,
                    // the res object should have a status of 201
                    res.status.should.eql(201);
                    // the property, res.body.succss, we expect it to be true.
                    res.body.success.should.eql(true);
                    const activationToken = res.body.user.temporaryToken;
                    console.log('activationToken', activationToken)
                    // user activation account 
                    chai.request(app)
                        .patch('/api/users/activation/' + activationToken)
                        .send()
                        .end((err, res) => {
                            should.not.exist(err);
                            should.exist(res.body.message);
                            res.body.success.should.eql(true);
                            done();
                        });
                });
        });
    });
});

describe('POST /api/user/signin', () => {
    it('should signin a user and get current user profile', (done) => {
        chai.request(app)
            .post('/api/users/signin')
            .send(login_details)
            .end((err, res) => {
                should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(200);
                res.type.should.eql('application/json');
                res.body.should.include.keys('auth', 'message', 'data', 'token');
                res.body.auth.should.eql(true);
                should.exist(res.body.data);
                should.exist(res.body.message);
                should.exist(res.body.token);
                const token = res.body.token;
                userInfo.token = token;
                done();
            });
    });
});

describe('POST /api/users/me', () => {
    it('should get the current user profile', (done) => {
        chai.request(app)
            .post('/api/users/me')
            // set the auth x-access-token
            .set('x-access-token', userInfo.token)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql('application/json');
                res.body.auth.should.eql(true);
                should.exist(res.body.decoded);
                done();
            });
    })
});

describe('POST /api/task', () => {
    it('should create a tasks', (done) => {
        chai.request(app)
            .post('/api/task/')
            .field(newTask)
            .attach('avatar', __dirname + '/icon-logo-96-xhdpi.png')
            // set the auth x-access-token
            .set('x-access-token', userInfo.token)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(201);
                res.type.should.eql('application/json');
                res.body.should.include.keys('success', 'message', 'data');
                res.body.success.should.eql(true);
                should.exist(res.body.message);
                should.exist(res.body.data);
                const message = res.body.message;
                console.log(message)
                done();
            });
    });
});

describe('GET /api/task', () => {
    it('should get all tasks', (done) => {
        chai.request(app)
            .get('/api/task')
            // set the auth x-access-token
            .set('x-access-token', userInfo.token)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql('application/json');
                res.body.should.include.keys('count', 'data');
                should.exist(res.body.count);
                should.exist(res.body.data);
                const data = res.body.data;
                userInfo.singleTask = data[0]._id;
                done();
            });
    });
});

describe('GET /api/task/:id', () => {
    it('should get a single tasks', (done) => {
        chai.request(app)
            .get('/api/task/' + userInfo.singleTask)
            // set the auth x-access-token
            .set('x-access-token', userInfo.token)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql('application/json');
                res.body.should.include.keys('task', 'date', 'request');
                should.exist(res.body.task);
                should.exist(res.body.date);
                should.exist(res.body.request);
                const task = res.body.task;
                console.log(task)
                done();
            });
    });
});

describe('DELETE /api/task:id', () => {
    it('should remove a single tasks', (done) => {
        chai.request(app)
            .delete('/api/task/' + userInfo.singleTask)
            // set the auth x-access-token
            .set('x-access-token', userInfo.token)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql('application/json');
                res.body.should.include.keys('success', 'message');
                should.exist(res.body.message);
                res.body.success.should.eql(true);
                done();
            });
    });
});