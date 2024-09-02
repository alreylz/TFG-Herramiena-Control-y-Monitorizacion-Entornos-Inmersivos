const mongoose = require('mongoose');


const Schema = mongoose.Schema;


// Schema Dependencies
const Message = require('./Message');
const SupportedTypes = ['int32', 'string', 'bool', Message]


//TODO: refactor and support more types
// https://protobuf.dev/programming-guides/proto3/


/*
   Represents a variable (key-value pair) that is to be exchanged through the network
 */
const MessageFieldSchema = new Schema({
    //
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


const MessageField = mongoose.model('messageField', MessageFieldSchema)
module.exports = MessageField;


/*
**********************************************
                QUICK TESTING
***********************************************
 */


// let msgField = new MessageField(
//     {});
//
//
// msgField.save().then((a) => console.log(a));