const http = require('http');

//app 
const app = require('./app');

//settings
app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);
const io = require('socket.io')(server);
require('./sockets')(io);

//Start the Server
server.listen(app.get('port'), () => {
    console.log('Running the server on port: ', app.get('port'));
    console.log((new Date).toUTCString());
    console.log('Environment: ', process.env.NODE_ENV);
});