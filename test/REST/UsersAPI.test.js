const axios = require("axios");
const supertest = require("supertest");
const mongoose = require("mongoose");

// Require http server from the applications
const {server, app} = require("../../src/index");
const api = supertest(app);


afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
})


describe("Users 👀 REST API Test", () => {

    it.todo("GET all users");
    it.todo("Find a specific user (GET filter)")
    it.todo("POST a user");
    it.todo("UPDATE  a user")
    it.todo("DELETE a user")

})

