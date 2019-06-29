(function () {
    angular.module('LShare')
        .controller('chatCtrl', ['$scope', 'socket', 'Auth', function ($scope, socket, Auth) {
            const app = this;
            app.title = "Chat";

            app.user = [];
            getUser = () => {
                if (Auth.isLoggedIn()) {
                    Auth.getUser().then((data) => {
                        app.userData = data.data.decoded
                        app.user.push(app.userData)
                    });
                }
            };
            getUser();

            angular.element(document.getElementById("chat-msg")).bind("keypress", () => {
                if (app.user) {
                    socket.emit('chat:typing', app.user[0].name);
                }
            });

            socket.on('chat:typing', (data) => {
                $('.typing')
                    .html(
                        '<p class="text-center">' + data + ' is typing </p>'
                    );
            });
            let inpudValue = angular.element(document.getElementById('chat-msg'));
            app.sendMsg = (decoded, data) => {

                if (inpudValue[0].value !== undefined && inpudValue[0].value !== '') {
                    socket.emit('chat:message', {
                        avatar: decoded,
                        message: app.data.msg
                    });
                    inpudValue[0].value = '';
                } else {}
            };

            socket.on('chat:message', (data) => {
                let chatClass;
                let time = new Date();
                if (data.avatar === app.user[0].avatar) {
                    chatClass = "chat-ls";
                } else {
                    chatClass = "chat-ls darker";
                }

                $('.typing').html('');
                $('.chat')
                    .append(
                        '<div class="' + chatClass + '"> <img src="' + data.avatar +
                        '" alt="Avatar" clsss="right" style="width:100%;"> <p>' +
                        data.message + '</p><span class="time-right">' +
                        time.getHours() + ':' + time.getMinutes() + '</span> </div>'
                    );
            });
        }]);
})();