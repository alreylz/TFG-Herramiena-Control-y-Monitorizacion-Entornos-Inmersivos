/**
 This file is the model for the Device collection in the database.
 A device represents a physical device that has ever at some point to the server.
 Users can set an alias to the device, so they can identify it more easily.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    macAddress: String,
    alias: String,
    user: String /* username of the user that owns this device */,
    last_conn_time: Date /* last time this device connected to the server */,
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {versionKey: false});

const Device = mongoose.model('devices', DeviceSchema);

module.exports = Device;