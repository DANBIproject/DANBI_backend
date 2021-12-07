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

router.post('/notification', function(req, res) {
    var member_id = req.body.member_id; 
    con.query(`SELECT JSON_ARRAYAGG(JSON_OBJECT('nickname', nickname, 'intake_once', intake_once)) AS result FROM member WHERE id = ${member_id};`, (err, row) => {
        if(err) res.send('SELECT error getting memberlist');
        else {
            res.json({success: true, result : JSON.parse(row[0].result)});
        }
    });
});




module.exports = router;