/***
 * @fileOverview
 * Message database model:  Represents a grpc shared datatype definition
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Schema Dependencies
const MessageField = require("./MessageField");
const User = require("../../Main/model/User");


// Schema definition (Represents the structure of the document)
const MessageSchema = new Schema({
    messageName: {type: String, required: true},
    messageFields: [MessageField.schema],
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {versionKey: false});

// Model (DAO)
const Message = mongoose.model('messages', MessageSchema);

module.exports = Message;
