'use strict';

angular.module('directive.chat', ['firebase', 'ngStorage'])
        .service('$chat', function ($log, $q, $firebaseObject, $firebaseArray, $users, $localStorage) {
            var chat = this;
            chat.$storage = $localStorage;
    
            var usersArray, childRooms = null;
            
            chat.setRoom = function (roomName) {
                var deferred = $q.defer();
                deferred.notify('About to get ' + roomName + '.');
                var ref = new Firebase('https://uverse-social.firebaseio.com/chat/rooms/' + roomName);
                chat.room = chat.$storage[roomName];
                
                $firebaseObject(ref).$loaded().then(function (room) {
                    chat.room = room;
                    if (room.name === undefined) {
                        room.name = roomName;
                        room.messages = {};
                        room.users = {};
                        room.childRooms = {};
                        room.$save().then(function () {
                            chat.messages = $firebaseArray(ref.child('messages'));
                            usersArray = $firebaseArray(ref.child('users'));
                            childRooms = $firebaseArray(ref.child('childRooms'));
                            deferred.resolve(chat);
                        }, function (reason) {
                            deferred.reject('Failed new room: ' + roomName + ' for reason: ' + reason);
                        });
                    } else {
                        chat.messages = $firebaseArray(ref.child('messages'));
                        usersArray = $firebaseArray(ref.child('users'));
                        childRooms = $firebaseArray(ref.child('childRooms'));
                        deferred.resolve(chat);
                    }
                    
                }, function (reason) {
                    deferred.reject('Failed getting existing room: ' + roomName + ' for reason: ' + reason);
                });
                return deferred.promise;
            };
            chat.sendMessage = function (msg) {
                if (msg.substring(0, 1) === '/') {
                    if (msg.substring(0, 6) === '/video') {
                        msg = '';
                        return {video: msg.substring(7)};
                    }
                } else {
                    var d = new Date().toLocaleTimeString().replace(/:\d+ /, ' ');

                    //SETING MESSAGE
                    var message = {message: msg, usericon: $users.user.icon, date: d, userid: $users.user.name};
                    $log.log('addMessage:' + message);

                    chat.messages.$add(message).then(function (m) {
                        $log.log('addedMessage:' + m);
                        msg = '';
                    }, function (reason) {
                        $log.warn('Failed save new user: ' + $users.user.name + ' for reason: ' + reason);
                    });
                }
            };
        })
        .directive('chatlist', function () {
            return {
                restrict: 'E',
                priority: -100,
                templateUrl: 'components/chat/message-list.html',
                scope: {
                    msg: '=messages'
                }
            };
        })
        .directive('people-list', function () {
            return {
                restrict: 'E',
                priority: -100,
                templateUrl: 'components/chat/people-list.html',
            };
        });