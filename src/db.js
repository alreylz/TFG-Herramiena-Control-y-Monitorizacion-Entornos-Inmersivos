/**
 * @fileoverview This file is the database connection file.
 **/

/*
 * @param ip : where the database is hosted
 * @param port : the port of the database
 * @param dbName: the name of the database to access
 * @returns {*} : the mongoose instance
 * todo: revisit, may be better to return not only the mongoose instance but also the connection (?)
 */
module.exports = async function (ip, port, dbName) {

    const dbUri = `mongodb://${ip}:${port}/${dbName}`;
    console.log(`Attempting connection to DB_URI ${dbUri}`);

    // DATABASE CONNECTION
    const mongoose = require('mongoose');
    const dbConnection = mongoose.connection;
    mongoose.set('strictQuery', true);


    dbConnection.once('open', function callback() {
        console.log('\n\t[Mongoose] Connected to MongoDB\n')
    })
    dbConnection.once("connected",
        () => {
            console.log(`\n\t[Mongoose] Connected to MongoDB at ${dbUri}`);
        });
    dbConnection.on('error', console.error.bind(console, 'Error connecting to mongodb'));
    dbConnection.on('disconnected', () => console.log("[Mongoose] Disconnected"));
    /*
    Initial mongoose connection
     */
    const init = async () => {
        try {
            return await mongoose.connect(dbUri, {
                autoIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        } catch (initError) {
            console.error("[Mongoose] ERROR on initial connection  to MongoDB " + initError);
        }
    }


    const mongooseInstance = await init();

    return mongooseInstance;


    // return dbConnection;
}