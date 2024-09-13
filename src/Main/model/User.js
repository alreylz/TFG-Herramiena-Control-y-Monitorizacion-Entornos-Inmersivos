const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    surname: String,
    email: String,
    password: String,
    last_conn_time: Date,
    role: {type: String, enum: ['researcher', 'admin']}
}, {versionKey: false});


const User = mongoose.model('User', UserSchema)


module.exports = {
    Schema: UserSchema
}