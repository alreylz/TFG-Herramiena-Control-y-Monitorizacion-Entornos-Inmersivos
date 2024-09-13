const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// Dependencies
const MessageField = require("./MessageField");
const User = require("../../Main/model/User");

// Schema definition (Represents the structure of the document)
const MessageSchema = new Schema({
    messageName: {type: String, required: true},
    // messageFields: [MessageField.Schema],
    messageFields: [MessageField.Schema],
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {versionKey: false});


const Message = mongoose.model("Message", MessageSchema);

module.exports = {
    Schema: MessageSchema
}