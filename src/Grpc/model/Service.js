/*
     Service database model:  Represents a set of grpc definition (a set of functions to call) to allow grouping them in the same 'namespace'
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema Dependencies
const Grpc = require("./RPC");
const User = require("../../Main/model/User");

// Model definition
const serviceSchema = new Schema({
    name: {type: String, required: true},
    description: String,
    grpcs: {type: [Grpc.schema], required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {versionKey: false})


const Service = mongoose.model('services', serviceSchema);

module.exports = Service;