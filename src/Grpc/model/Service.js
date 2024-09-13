/*
     Service database model:  Represents a set of grpc definition (a set of functions to call) to allow grouping them in the same 'namespace'
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema Dependencies
const RPC = require("./RPC")
const User = require("../../Main/model/User")

// Model definition
const ServiceSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    grpcs: {type: [RPC.Schema], required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {versionKey: false})


const Service = mongoose.model('Service', ServiceSchema);

module.exports = {
    Schema: ServiceSchema
};