const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserModel = require("../model/User");

router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    console.log("jwt - Login request".magenta())

    console.log(req.body)


    // Check that the user is present
    let dbResult = await UserModel.findOne({username: username, password: password}).select({username: 1, email: 1});


    // TODO: Change this to a database query
    //if (username === "alreylz" && password === "01241851") {
    if (dbResult) {
        const jwt_payload = {username};

        const token = jwt.sign(jwt_payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        });

        console.log("Successful login")
        return res.json({username, token, msg: "Login Success"});

    }

    return res.status(401).json({msg: "Invalid Credentials, won't return a token"});
});


module.exports = router;