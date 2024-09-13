const axios = require("axios");
const supertest = require("supertest");
const mongoose = require("mongoose");

// Require http server from the applications
const {server, app} = require("../../src/index");


const SERVER_DATA = {
    hostname: process.env.HOSTNAME, port: process.env.PORT,
}

const DB_DATA = {
    hostname: process.env.MONGO_HOST, port: process.env.MONGO_PORT, dbName: process.env.MONGO_DB_NAME
}

const Authorization = {
    loginEndpoint: `http://${SERVER_DATA.hostname}:${SERVER_DATA.port}/api/v1/login`,
}


const api = supertest(app);

beforeAll(() => {


})


describe("Authorization (via JWT) REST API Test", () => {

    it('Registered user (jwt returned successfully)', async () => {

        const validUser = {
            username: "alreylz",
            password: "01241851"
        }

        await api.post('/api/v1/login').send({
            username: validUser.username, password: validUser.password,
        }).expect(200);
    });

    it("Non-existing user (unauthorized)", async () => {

        const invalidUser = {
            username: "pepe",
            password: "cazzo"
        }

        await api.post('/api/v1/login').send({
            username: invalidUser.username, password: invalidUser.password,
        }).expect(401);
    });


})


afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
})
