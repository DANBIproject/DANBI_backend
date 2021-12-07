const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'jade');



const auth = require('./auth');
app.use('/auth', auth);

const member = require('./member');
app.use('/member', member);

const record = require('./record');
app.use('/record', record);

const notification = require('./notification');
app.use('/notification', notification);

const purifier = require('./purifier');
app.use('/purifier', purifier);


const NUGU = require('./NUGU');
app.use('/NUGU', NUGU);



app.listen(3000, () => {
    console.log('server connected');
});