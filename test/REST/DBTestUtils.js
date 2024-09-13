const MessageModel = require("../../src/Grpc/model/Message");
const RPCModel = require("../../src/Grpc/model/RPC");
const ServiceModel = require("../../src/Grpc/model/Service");
const PackageModel = require("../../src/Grpc/model/GrpcPackage");

const UserModel = require("../../src/Main/model/User");
const DeviceModel = require("../../src/Main/model/Device");

const path = require("path");
const Basics = require("../../src/shared/Basics");
const mongoose = require("mongoose");


const EnvParsed = require("dotenv").config({path: path.join(Basics.getApplicationRoot(), ".env")}).parsed;

console.log(EnvParsed)

const db = require("../../src/db")(EnvParsed.MONGO_HOST, EnvParsed.MONGO_PORT, EnvParsed.MONGO_DB_NAME + "Test");


/**
 * Deletes all documents the database
 * @param dbConnection
 * @returns {Promise<void>}
 */
async function emptyDatabase(dbConnection) {
    const collections = dbConnection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

async function emptyDbCollection(dbConnection, name) {
    const collections = dbConnection.collections;
    if (!Object.hasOwn(collections, name)) {
        throw new Error("trying to access a non existent db collection for deletion")
    }
    const collection = dbConnection.collections[name];
    return await collection.deleteMany({}); // Deletes all documents in the collection

}


async function testUserDB() {

    const testUserObj = new UserModel({
        username: "testUser1",
        name: "test",
        surname: "userIXCI",
        email: "userIXCI1@gmail.com",
        password: "123456789",
        last_conn_time: new Date(),
        role: "researcher"
    });


    return await testUserObj.save()

}


async function testDevicesDB(user) {


    return await DeviceModel.create({
            macAddress: "5e:1c:4f:80:f6:85",
            alias: "alreylz-phone",
            user: user.username,
            last_conn_time: new Date(),
            user_id: user._id
        }, {
            macAddress: "3C:22:A2:85:AA:8D",
            alias: "laptop",
            user: user.username,
            last_conn_time: new Date(),
            user_id: user._id
        }
    );


}

//
async function testMessagesDB(user) {


    const testMessages = await MessageModel.create(
        {
            messageName: "testMessage",
            messageFields: [
                {
                    dataName: "arg1",
                    dataType: "string"
                }
                ,
                {
                    dataName: "arg2",
                    dataType2: "int32"
                }
            ],
            user_id: user._id

        },

        {
            messageName: "testMessage2",
            messageFields: [
                {
                    dataName: "arg3",
                    dataType: "string"
                }
                ,
                {
                    dataName: "arg4",
                    dataType2: "int32"
                }
            ],
            user_id: user._id

        }
    )
    return testMessages;
}


async function testRpcInsert(user, messageRet, messageArgs) {


    const nuRpc1 = new RPCModel({
        rpcName: "TestRPC",
        description: " Here you should put proper information to understand what this RPC is supposed to be used for",
        returnType: messageRet,
        argsType: messageArgs,
        user_id: user._id
    });


    const nuRpc2 = new RPCModel({
        rpcName: "TestRPC2",
        description: " Here you should put proper information to understand what this RPC is supposed to be used for",
        returnType: messageRet,
        argsType: messageArgs,
        user_id: user._id
    });

    await Promise.all([nuRpc1.save(), nuRpc2.save()])
    return [nuRpc1, nuRpc2]
}


async function testServiceCreate(user, ...rpcs) {


    const nuService = new ServiceModel({
        name: "testService",
        description: "Lorem ipsum 1",
        grpcs: rpcs,
        user_id: user._id
    })


    const nuService2 = new ServiceModel({
        name: "testService2",
        description: "Lorem ipsum 2",
        grpcs: rpcs,
        user_id: user._id
    })

    await Promise.all([nuService.save(), nuService2.save()]);


    return [nuService, nuService2];

}


async function testPackageCreate(user, service, ...otherServices) {


    let servicesOfPackage = [service, ...otherServices];

    if (otherServices.length > 0) {
        console.log(" THE CREATED PACKAGE WILL HAVE MORE THAN ONE SERVICE")
    }
    // if(otherServices.length>0){
    //     servicesOfPackage =
    // }
    console.log(servicesOfPackage)

    const package = new PackageModel({

        name: "testPackage",
        description: "its optional",
        services: servicesOfPackage,
        user_id: user._id
    })

    return await package.save();


}


async function quickDBStats(dbConnection) {

    // mongoose.connection.models

    const collections = dbConnection.models;

    for (let [name, model] of Object.entries(collections)) {

        console.log(`${name}`, model)
        console.log(await model.countDocuments({}))
    }


}


//Executing all
async function createSampleDatabaseContent() {


    //Empty database and then insert stuff
    await emptyDatabase(db);

    const testUser = await testUserDB();
    const messages = await testMessagesDB(testUser);
    // console.log(messages)
    const rpcs = await testRpcInsert(testUser, ...messages);
    // console.log(rpcs)
    const servicesOrService = await testServiceCreate(testUser, ...rpcs);
    // console.log(servicesOrService)
    const pack = await testPackageCreate(testUser, ...servicesOrService)
    // console.log(pack)


    const devices = await testDevicesDB(testUser);
    // console.log(devices)


    quickDBStats(db)

    // testRpcSchema(user,)
    //await emptyDbCollection(mongoose.connection, "users")
    // console.log(db)
    // await mongoose.connection.close();
    //db.disconnect();
}


(async () => {
    await createSampleDatabaseContent();
})();


module.exports = {}