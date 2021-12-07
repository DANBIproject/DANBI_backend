const router = require('express').Router();
const mysql = require('mysql');

// DB 연결
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'danbidanbi',
    database: 'danbi'
});
con.connect();

//post query to water purifier
router.post('/reaction', function(req, res){
    var member_id = req.body.member_id;
    var reaction = req.body.reaction;
    if (reaction == 1){
        con.query(`SELECT * FROM member WHERE id = ${member_id};`, (err, row) => {
            if(err) res.send('SELECT error getting member info');
            else {
                var _date = new Date();
                var utcNow = _date.getTime() + (_date.getTimezoneOffset() * 60 * 1000);
                var koreaTimeDiff = 9 * 60 * 60 * 1000;
                var date = new Date(utcNow + koreaTimeDiff).toISOString().slice(0,19).replace('T', ' ');
                if(row[0].member_type == 1){
                    con.query(`INSERT INTO record (date, actual_intake, member_id) VALUES ('${date}', ${row[0].intake_once}, ${member_id});`, (err) =>{
                        if (err) res.send('INSERT error');
                        else{
                            res.json({success: true, result : JSON.parse(JSON.stringify({"nickname": row[0].nickname, "actual_intake": row[0].intake_once, "water_type": row[0].temperature}))});
                        }
                    });
                }else{
                    con.query(`INSERT INTO record (date, actual_intake, member_id) VALUES ('${date}', ${row[0].intake_once}, ${member_id});`, (err) =>{
                        if (err) res.send('INSERT error');
                        else{
                            res.json({success: true, result : JSON.parse(JSON.stringify({"nickname": row[0].nickname, "actual_intake": row[0].intake_once, "water_type": "정수"}))});
                        }
                    });
                }
            }
        });
    }
    else if(reaction == 2){
        con.query(`SELECT * FROM member WHERE id = ${member_id};`, (err, row) => {
            if(err) res.send('SELECT error getting member info');
            else {
                var _date = new Date();
                var utcNow = _date.getTime() + (_date.getTimezoneOffset() * 60 * 1000);
                var koreaTimeDiff = 9 * 60 * 60 * 1000;
                var date = new Date(utcNow + koreaTimeDiff).toISOString().slice(0,19).replace('T', ' ');
                if(row[0].member_type == 1){
                    con.query(`INSERT INTO record (date, actual_intake, member_id) VALUES ('${date}', ${row[0].intake_once}, ${member_id});`, (err) =>{
                        if (err) res.send('INSERT error');
                        else{
                            res.json({success: true});
                        }
                    });
                }else{
                    con.query(`INSERT INTO record (date, actual_intake, member_id) VALUES ('${date}', ${row[0].intake_once}, ${member_id});`, (err) =>{
                        if (err) res.send('INSERT error');
                        else{
                            res.json({success: true});
                        }
                    });
                }
            }
        });
    }
    else if(reaction == 3){
        res.json({success: true});
    }
    else{
        res.send('reaction error');
    }
});


module.exports = router;