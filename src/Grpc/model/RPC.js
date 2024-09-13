/*
     RPC database model:  Represents a grpc remote procedure call definition
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Other model dependencies
const Message = require("./Message")
const User = require("../../Main/model/User")

// Model definition
const RpcSchema = new Schema({
        //The name of the function
        rpcName: String,
        //The type of rpc (see grpc specification)
        rpcType: {
            type: String,
            enum: ['UNARY', 'SERVER_STREAMING', 'CLIENT_STREAMING', 'BIDIRECTIONAL'],
            default: 'UNARY'
        },
        description: String, // Optional
        //The return type of the function
        returnType: Message.Schema,
        //The data that is sent along with the function (parameters)
        argsType: Message.Schema,
        // The user that created this RPC
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
    }
);


const Rpc = mongoose.model('RPC', RpcSchema)
module.exports = {
    Schema: RpcSchema
};

