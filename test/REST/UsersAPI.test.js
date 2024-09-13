const supertest = require("supertest");
const mongoose = require("mongoose");

// Require http server from the applications
const {server, app} = require("../../src/index");
const api = supertest(app);

describe("Users 👀 REST API Test", () => {


    const API_ENDPOINT = '/api/v1/users/';


    beforeAll(async () => {


    })

    it("GET all users", async () => {
        const response = await api.get(API_ENDPOINT).send();
        //Check if response is OK
        expect(response.statusCode).toEqual(200);
        //Check if response if returns an array of objects
        expect(Object.isArray(response.body)).toBeTruthy();
    });
    it("Find a specific user (GET filters)", async () => {
        const response = await api.get('/api/v1/users').query({username: 'alreylz'}).send();
        expect(response.statusCode).toBe(200);

        console.log(response.body)
        expect(response.body[0].username).toBe("alreylz")
    })
    it("POST a user", async () => {

        const testUser = {
            username: "testUser",
            name: "testUser",
            surname: "testSurname",
            email: "test@test",
            password: "password"
        }

        const response = await api.post(API_ENDPOINT).send(testUser);
        expect(response.statusCode).toBe(200);

        console.log(response.body);
        //Partial match of object
        expect(response.body).toEqual(expect.objectContaining(testUser))
    });
    it("PUT (Updating  a user)", async () => {

        const userToUpdate = {
            id: "66db485b142b02acb184b7e0",
            name: "updatedName" + Date.now().toString(),
            surname: "updateSurname" + Date.now().toString(),
            username: "updatedUsername" + Date.now().toString()
        }

        try {
            const response = await api.put(`${API_ENDPOINT}${userToUpdate.id}`).send(userToUpdate);
            expect(response.statusCode).toBe(200);
            console.log(response.body);
            //Partial match of object
            delete userToUpdate.id;
            expect(response.body).toEqual(expect.objectContaining(userToUpdate))

        } catch (e) {
            console.log(e)
        }


    });
    it.only("DELETE a user", async () => {

        const userToDelete = {
            _id: "66db485b142b02acb184b7e0"
        }


        const response = await api.delete(`${API_ENDPOINT}${userToDelete._id}`).send(userToDelete);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(userToDelete));


    });


    afterAll(async () => {
        await mongoose.connection.close();
        await server.close();
    })
})

