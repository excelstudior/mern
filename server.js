const express = require('express');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const passport =require('passport');

const keys = require('./config/keys');
const users=require('./routes/api/users');
const profile=require('./routes/api/profile');
const posts=require('./routes/api/posts');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB config
mongoose
    .connect(keys.url + keys.Name)
    .then(() => console.log(`MongoDB connected!`))
    .catch(err=>console.log);
//Body parser middleware

//Passport middleware
app.use(passport.initialize());
//Passport config
require('./config/passport')(passport);


app.get('/', (req, res) => res.send('hello!'))
// Use Routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts)


const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));