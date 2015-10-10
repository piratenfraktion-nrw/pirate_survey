var fs = require('fs');
var file = 'survey.db';
var exists = fs.existsSync(file);

if(!exists) {
    console.log('create db file');
    fs.openSync(file, 'w');
}

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);
db.run('PRAGMA foreign_keys = ON;');

db.serialize(function() {
    if(!exists) {
        //db.run('PRAGMA foreign_keys = ON;');
        db.run('CREATE TABLE surveys ( \
                    id INTEGER PRIMARY KEY ASC, \
                    name TEXT NOT NULL);');
        db.run('CREATE TABLE questions ( \
                    id INTEGER PRIMARY KEY ASC, \
                    survey_id INTEGER NOT NULL, \
                    question_text TEXT NOT NULL, \
                    sort_order INTEGER, \
                    question_type INTEGER NOT NULL DEFAULT 0, \
                    FOREIGN KEY(survey_id) REFERENCES surveys(id));');
        db.run('CREATE TABLE answers ( \
                    id INTEGER PRIMARY KEY ASC, \
                    question_id INTEGER NOT NULL, \
                    answer_text TEXT, \
                    FOREIGN KEY(question_id) REFERENCES questions(id));');
        db.run('CREATE TABLE responses ( \
                    id INTEGER PRIMARY KEY ASC, \
                    survey_id INTEGER NOT NULL, \
                    FOREIGN KEY(survey_id) REFERENCES surveys(id));');
        //db.run('CREATE TABLE response_answers ( \
        //            id INTEGER PRIMARY KEY ASC, \
        //            survey_id INTEGER NOT NULL, \
        //            response_id INTEGER NOT NULL, \
        //            question_id INTEGER NOT NULL, \
        //            answer_id INTEGER NOT NULL, \
        //            answer_text TEXT, \
        //            FOREIGN KEY(response_id) REFERENCES responses(id), \
        //            FOREIGN KEY(question_id) REFERENCES questions(id), \
        //            FOREIGN KEY(answer_id) REFERENCES answers(id), \
        //            FOREIGN KEY(survey_id) REFERENCES surveys(id));');
        db.run('CREATE TABLE response_answers ( \
                    id INTEGER PRIMARY KEY ASC, \
                    response_id INTEGER NOT NULL, \
                    question_id INTEGER NOT NULL, \
                    answer_id INTEGER NOT NULL, \
                    answer_text TEXT, \
                    FOREIGN KEY(response_id) REFERENCES responses(id), \
                    FOREIGN KEY(question_id) REFERENCES questions(id), \
                    FOREIGN KEY(answer_id) REFERENCES answers(id));');
    }
})

exports.get_questions = function(socket) {
    surveys = new Array();

    // TODO: Escape string!!!

    db.each('SELECT id, question_text \
            FROM questions \
            WHERE survey_id = ' + req.params.id, function(err, rows) {
        if(err || !rows) {
            console.log(err);
            console.log('No surveys found');
            //res.json({'error': 'No surveys found'});
        } else {
            surveys.push(rows);
        }
    }, function() {
        //res.json(surveys);
    });
};

//exports.get_surveys = function(req, res) {
exports.get_surveys = function(socket) {
    surveys = new Array();

    db.each('SELECT id, name FROM surveys', function(err, rows) {
        if(err || !rows) {
            console.log(err);
            //socket.emit({'error': 'No surveys found'}); // TODO: Nur an einen
            //Empfaenger!
        } else {
            surveys.push(rows);
        }
    }, function() {
            //res.json(surveys);
            console.dir('get_surveys');
            socket.emit('surveys', surveys);
    });
};

exports.add_surveys = function(surveys) {
};

exports.del_surveys = function(socket) {
};

exports.insert_response = function(response, socket) {
    response_id = response['response_id']; // TODO: escape!!!
    survey_id = response['survey_id']; // TODO: escape!!!
    question_id = response['question_id']; // TODO: escape!!!
    answer_id = response['answer_id']; // TODO: escape!!!

    db.each('SELECT COUNT(*) AS c FROM responses WHERE id = ' + response_id + ' AND survey_id = ' + survey_id, function(err, rows) {
        if(err || !rows) {
            console.log(err);
        } else {
            if(rows['c'] == 0 /* || (rows['c'] > 1)*/) {
                //socket.emit('error', 'TODO'); // Nur an einen Empfaenger!
                console.log('error: response_id not found!');
            } else {
                // TODO: SELECT COUNT(*) AS c FROM answers WHERE id = ' + answer_id
                // TODO: SELECT COUNT(*) AS c FROM questions WHERE id = ' + question_id
                db.each('SELECT COUNT(*) AS c FROM response_answers WHERE response_id = ' + response_id + ' AND question_id = ' + question_id, function(err, rows) {
                    if(err || !rows) {
                        console.log(err);
                    } else {
                        if(rows['c'] != 0) {
                            socket.emit('err', 'response_answer already exists!'); // TODO: Nur an einen Empfaenger!
                            console.log('error: response_answer already exists!');
                        } else {
                            db.run('INSERT INTO response_answers (response_id, question_id, answer_id) VALUES (?,?,?)', 
                                    response_id, question_id, answer_id);

                            socket.emit('info', 'response inserted'); // TODO: Nur an einen Empfaenger!
                            //socket.emit('survey_1_x_1', get_chart_data(1 /* survey_id */,
                            //                                           1 /* question_id */));
                        }
                    }
                });

            }
        }
    });

};

exports.new_subject = function(response, socket) {
    survey_id = response['survey_id']; // TODO: escape!!!


};

process.on('SIGINT', function() {
    db.close();
    console.log('SIGINT');
});

process.on('SIGTERM', function() {
    db.close();
    console.log('SIGTERM');
});

