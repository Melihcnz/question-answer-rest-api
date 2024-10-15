const mongoose = require('mongoose');
const { connect } = require('../../routers/question');

const connectDatebase = () => {

    mongoose.connect(process.env.MONGO_URI,)
    .then(() => {
        console.log("MongoDb Connection Successful");
    })
    .catch(err => {
        console.log(err);
    })
};

module.exports = connectDatebase;