const mongoose = require('mongoose')
const Schema = mongoose.Schema


// Schema Dependencies
const Message = require('mongoose').model('messages');
const Service = require('mongoose').model('services');
const User = require('mongoose').model('users');


/***
 * @fileOverview
 * grpcPackage database model: encapsulates, as in a namespace, as set of Services, RPCs, Messages and MessageFields
 */
const grpcPackageSchema = new Schema({
    name: String,
    description: {type: String},
    createdAt: {type: Date, default: Date.now()},
    services: {type: [Service.schema], required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
}, {versionKey: false})


//Mongoose automatically looks for the plural, lowercased version of your model name.
//Compilo el modelo (luego podré hacer new
const GrpcPackage = mongoose.model('grpcPackages', grpcPackageSchema);


module.exports = GrpcPackage;