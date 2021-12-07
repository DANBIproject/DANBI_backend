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


router.post('/signup', function (req, res) {
    var email = req.body.email; var pw = req.body.pw;
    var name = req.body.name; var mobile = req.body.mobile;

    con.query(`INSERT INTO user (email, pw, name, mobile) VALUES (\'${email}\', \'${pw}\', \'${name}\', \'${mobile}\');`, (err) => {
        if (err) res.json({ success: false, msg: 'signup fail' });
        else res.json({ success: true, msg: 'signup success' });
    });
});


//login
router.post('/login', function (req, res) {
    var email = req.body.email; var pw = req.body.pw;

    con.query(`SELECT * FROM user WHERE email='${email}' AND pw='${pw}';`, (err, row) => {
        if (err) {
            res.json({ success: false, msg: 'login fail' });
        }
        else if (row.length == 0) {
            res.json({ success: false, msg: 'login fail' });
        }
        else {
            con.query(`SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'nickname', nickname, 'member_type', member_type)) AS result FROM member WHERE user_id = ${row[0].id} ;`, (err, row) => {
                if (err) res.send('SELECT error getting memberlist');
                else {
                    res.json({ success: true, result: JSON.parse(row[0].result) });
                }
            });
        }
    });
});

router.post('/accountdelete', function (req, res) {
    var email = req.body.email; var pw = req.body.pw;

    con.query(`DELETE FROM user WHERE email='${email}\' AND pw=\'${pw}\';`, (err, result) => {
        if (err) res.json({ success: false, msg: 'account delete fail' });
        else if (result.affectedRows == 0) res.json({ success: false, msg: 'account delete fail' });
        else {
            res.json({ success: true, msg: 'account delete success' });
        }
    });
});


//changepw
router.post('/changepw', function (req, res) {
    var email = req.body.email; var pw = req.body.pw;
    var newpw = req.body.newpw;

    con.query(`UPDATE user SET pw =  \'${newpw}\' WHERE email = \'${email}\' AND pw=\'${pw}\';`, (err) => {
        if (err) res.json({ success: false, msg: 'change password fail' });
        else res.json({ success: true, msg: 'change password success' });
    });
});


//아이디찾기
router.post('/forgotID', function (req, res) {
    var name = req.body.name;
    var mobile = req.body.mobile;

    con.query(`SELECT email FROM user WHERE name='${name}\' AND mobile=\'${mobile}\';`, (err, row) => {
        if (err) {
            res.json({ success: false, msg: 'forgotID error' });
        }
        else if (row.length == 0) {
            res.json({ success: false, msg: '해당 아이디는 존재하지 않습니다.' });
        }
        else {
            var result = row[0].email;
            res.json({ success: true, email: result });
        }
    });
});


//비밀번호찾기
router.post('/forgotPW', function (req, res) {
    var email = req.body.email;
    var name = req.body.name;

    con.query(`SELECT pw FROM user WHERE email='${email}\' AND name=\'${name}\';`, (err, row) => {
        if (err) {
            res.json({ success: false, msg: 'forgotPW error' });
        }
        else if (row.length == 0) {
            res.json({ success: false, msg: '정보를 다시 입력해주세요.' });
        }
        else {
            var result = row[0].pw;
            res.json({ success: true, pw: result });
        }
    });
});

module.exports = router;