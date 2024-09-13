/**
 * @fileoverview This file is the database connection file.
 **/


const mongoose = require("mongoose");

/*
 * @param {string} ip : where the database is hosted
 * @param {string|number} port : the port of the database
 * @param {string} dbName : the name of the database to access
 * @returns {Promise<*|undefined>} : a connection (other than the default)
 */
async function dbConnect(ip, port, dbName) {

    const dbUri = `mongodb://${ip}:${port}/${dbName}`;

    const init = async () => {
        try {
            return await mongoose.createConnection(dbUri, {
                autoIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        } catch (error) {
            console.error(`ERROR connection to ${dbUri} : ${error}`);
        }
    };


    // DATABASE CONNECTION
    mongoose.set('strictQuery', true);

    const connection = await init();

    connection.once('open', () => console.log(`Mongoose connection 'open' ${dbUri} | id:${connection.id}`));
    connection.once("connected", () => console.log(`Mongoose 'connected' ${dbUri} | id:${connection.id}`));
    connection.on('error', console.error.bind(console, `Error connecting to ${dbUri} | id:${connection.id}`));
    connection.on('disconnected', () => console.log(`Mongoose 'disconnected' ${dbUri} | id:${connection.id}`));

    return connection;
}


/**
 * Returns the Mongoose instance (having established the default connection)
 * @param {string} ip : where the database is hosted
 * @param {string|number} port : the port of the database
 * @param {string} dbName : the name of the database to access
 * @returns {Promise<*|undefined>}
 */
function dbDefaultConnect(ip, port, dbName) {

    const dbUri = `mongodb://${ip}:${port}/${dbName}`;

    const init = async () => {
        try {
            return await mongoose.connect(dbUri, {
                autoIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        } catch (error) {
            console.error(`ERROR connection to ${dbUri} : ${error}`);
        }
    };
    
    return init();
}


/*

 */
function loadModelsForConnection(dbConnection) {

    // Requiring all schemas
    const User = require("./Main/model/User");
    const Device = require("./Main/model/Device");

    const Message = require("./Grpc/model/Message");
    const MessageField = require("./Grpc/model/MessageField");
    const RPC = require("./Grpc/model/RPC");
    const Service = require("./Grpc/model/Service");
    const GrpcPackage = require("./Grpc/model/GrpcPackage");

    // Applying model to connection
    return {
        User: dbConnection.model("User", User.Schema),
        Device: dbConnection.model("Device", Device.Schema),
        MessageField: dbConnection.model("MessageField", MessageField.Schema),
        Message: dbConnection.model("Message", Message.Schema),
        RPC: dbConnection.model("RPC", RPC.Schema),
        Service: dbConnection.model("Service", Service.Schema),
        GrpcPackage: dbConnection.model("GrpcPackage", GrpcPackage.Schema)
    }
}


module.exports = dbDefaultConnect;

//Export by default connection without different connections
//Then allow to export other

//
// (async () => {
//
//     const MyConnection = await dbConnect("localhost", 27017, "ixciGrpcDb");
//     loadModelsForConnection(MyConnection)
//
//     // console.log(MyConnection.modelNames());
//
//     await MyConnection.close();
//
//     await dbDefaultConnect("localhost", 27017, "ixciGrpcDb");
//     console.log(mongoose.modelNames());
//     const UserModel = mongoose.model("User");
//
//     console.log(await UserModel.find({}))
//
//     await mongoose.connection.close()
//
// })()