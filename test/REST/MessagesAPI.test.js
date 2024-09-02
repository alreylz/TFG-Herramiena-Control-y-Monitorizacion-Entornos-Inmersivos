const axios = require("axios");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const User = require("../../src/Main/model/User");
const Message = require("../../src/Grpc/model/Message");
const MessageField = require("../../src/Grpc/model/MessageField");

describe("Messages ✉️ REST API Test", () => {


    const SERVER_DATA = {
        hostname: process.env.HOSTNAME, port: process.env.PORT,
    }

    const DB_DATA = {
        hostname: process.env.MONGO_HOST, port: process.env.MONGO_PORT, dbName: process.env.MONGO_DB_NAME
    }

    const REST_API = {
        baseURi: `http://${SERVER_DATA.hostname}:${SERVER_DATA.port}/api/v1`,
    }

    const Authorization = {
        loginEndpoint: `http://${SERVER_DATA.hostname}:${SERVER_DATA.port}/api/v1/login`,
        user: "alreylz",
        password: "01241851",

    }


// 1. Create message data in BBDD
    // 2. Create a test user (admin)

    let ADMIN_USER;
    // 3. Link JWT

    /* Test setup */
    beforeAll(async () => {
        console.log("Opening connection with mongoose")
        await mongoose.connect(`mongodb://${DB_DATA.hostname}:${DB_DATA.port}/${DB_DATA.dbName}`);
        ADMIN_USER = await createAdminUser();
        Authorization.token = await getJWTToken(Authorization.user, Authorization.password);
        console.log("TOKEN", Authorization.token)

        await createTestMessagesModel(ADMIN_USER);

    })
    /* Tests cleanup */
    afterAll(async () => {
        await resetBBDD();
        console.log("Closing connection with mongoose")
        return mongoose.connection.close()
    });


    async function getJWTToken(user, password) {


        let token = null;

        try {

            token = await axios.post(Authorization.loginEndpoint, {
                username: user, password: password,
            });

        } catch (error) {
            console.error("Token could not be obtained", error);
        }

        return token;


    }

    async function createAdminUser() {

        const nuUser = await User.create({
            username: "admin", name: 'perry', surname: 'platypus', email: 'perry@platypus.com', password: 'agentp'
        });
        return nuUser;
    }

    async function createTestMessagesModel(user) {


        const retType = {
            dataName: "@TestReturnType", dataType: 'bool'
        };
        const paramType = {
            dataName: "@ArgType", dataType: 'string'
        };

        const nuMessage = Message.create({
            messageName: "@testMessage", messageFields: [retType, paramType], user_id: user._id
        });


        return {msg: nuMessage, types: [retType, paramType]}
    }

    async function createTestMessages_RESTAPI() {
//todo
    }


    //TEST ALSO JWT Access


    async function resetBBDD() {
        return User.findOneAndDelete({"email": 'perry@platypus.com'})

    }


    test("GET message ", async () => {

        const jwtKey = process.env.JWT_SECRET_KEY;
        
        const token = jwt.sign({username: "admin"}, jwtKey, {
            expiresIn: '1h'
        });


        console.log(SERVER_DATA)

        const result = await axios.get(`${REST_API.baseURi}/messages`, {headers: {"Authorization": `Bearer ${token}`}});


        console.dir(result)
        expect(result.data.length).toBe(4)
        // axios.get("")

    }, 20000)


})

