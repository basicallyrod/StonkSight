const path = require('path')
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware');
const port = process.env.PORT || 5000;

const connectDB = require('./config/db');

connectDB();

const app = express();



app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use('/api/lists', require('./routes/listRoutes'));
app.use('/api/users', require('./routes/userRoutes'))
// app.use('a')


if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    app.get('*', (req, res) =>
    res.sendFile(
        path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    ))
} else {
    app.get('/', (req, res) => res.send('Please set to production: ' + {data: { body: req.body}}))
}
    // app.get('/'), (req, res) => {
    //     res.status(200).json({data: { body: req.body}})
    // }


const description = 'Server started on port ';
// const properties = port;
// const logString = 'Description: ${port.pr'
const logString = (description + port);

app.use(errorHandler);

app.listen(port, () => console.log(logString));