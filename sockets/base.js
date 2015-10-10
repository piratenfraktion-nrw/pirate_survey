var surveys = require('../surveys/base');
//var all_sockets = [];

// http://stackoverflow.com/questions/9137877/socket-io-send-to-specified-user-id

module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log('a user connected');
        //var user_id = all_sockets.push(socket);
        //console.dir(user_id);

        surveys.get_surveys(socket);

        socket.on('add_survey', function(survey, socket) {
            surveys.add_survey(survey);
            console.log(survey);
        }, function(){
            surveys.get_surveys(socket);
        });

        socket.on('insert_response', function(response) {
            surveys.insert_response(response, this);
        });

        socket.on('new_subject', function(response) {
            surveys.new_subject(response, this);
        });

        socket.on('disconnect', function() {
            console.log('user disconnected');
            //all_sockets.splice(all_sockets.findIndex(user_id), 1);
        });
    });
};
