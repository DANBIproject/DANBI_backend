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

router.post('/record', function(req, res) {
    var member_id = req.body.member_id;

    var _date = new Date(req.body.date);

    var actual_intake = req.body.actual_intake;

    if (_date == null){
        _date = new Date();
        var utcNow = _date.getTime() + (_date.getTimezoneOffset() * 60 * 1000);
        var koreaTimeDiff = 9 * 60 * 60 * 1000;
        var date = new Date(utcNow + koreaTimeDiff).toISOString().slice(0,19).replace('T', ' ');
        con.query(`INSERT INTO record (date, actual_intake, member_id) VALUES ('${date}', ${actual_intake}, ${member_id});`, (err) => {
            if(err) res.json({success: false, msg: 'INSERT recording fail'});
            else res.json({success: true, msg: 'INSERT recording success'});
        });
    } else{
        var utcNow = _date.getTime() + (_date.getTimezoneOffset() * 60 * 1000);
        var koreaTimeDiff = 9 * 60 * 60 * 1000;
        var date = new Date(utcNow + koreaTimeDiff).toISOString().slice(0,19).replace('T', ' ');
        con.query(`INSERT INTO record (date, actual_intake, member_id) VALUES ('${date}', ${actual_intake}, ${member_id});`, (err) => {
            if(err) res.json({success: false, msg: 'INSERT recording fail'});
            else res.json({success: true, msg: 'INSERT recording success'});
        });
    } 
});

//stamp
router.post('/stamp', function(req, res) {
    var member_id = req.body.member_id;
    con.query(`INSERT INTO stamp (day, member_id) VALUES (NOW(), ${member_id});`, (err) =>{
        if(err) res.json({success: false, msg: 'INSERT stamp fail'});
        else res.json({success: true, msg: 'INSERT stamp success'});
    });
});


module.exports = router;