const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//TODO: refactor and support more types
// https://protobuf.dev/programming-guides/proto3/


// Schema Dependencies
const Message = require("./Message");
const SupportedTypes = ['int32', 'string', 'bool', Message]

/*
 Represents a variable (key-value pair) that is to be exchanged through the network
*/
const MessageFieldSchema = new Schema({
    dataName: {
        type: String,
        required: true
    },
    dataType: {
        type: mongoose.Schema.Types.Mixed,
        enum: SupportedTypes,
        default: 'string',
        required: true
    },
    fieldRule: {
        type: String,
        enum: ['', 'singular', 'repeated', 'optional'],
        default: ''
    }
}, {versionKey: false});


const MessageField = mongoose.model("MessageField", MessageFieldSchema);

module.exports = {
    Schema: MessageFieldSchema
}
