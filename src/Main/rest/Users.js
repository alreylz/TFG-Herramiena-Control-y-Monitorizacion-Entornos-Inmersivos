const User = require("../model/User");
const router = require("express").Router();

/***
 * @api {get} /users Obtener usuario por id
 */
router.get("/users/:id", async function (req, res) {

    try {
        const ObjectId = require('mongoose').Types.ObjectId;
        let id = new ObjectId(req.params.id);
        // console.log(id);
        return res.status(200).json(await User.findById(id, {_id: 1, name: 1, surname: 1, email: 1}).exec());

    }
    catch (e) {
        return res.status(500).json({
            message: 'Error obteniendo el usuario'
        })
    }
});


/***
 * @api {get} /users Obtener todos los usuarios o buscar usando los queryparams
 */
router.get("/users", async function (req, res) {

    // Return all users
    if (Object.keys(req.query).length === 0) {
        return res.status(200).json(await User.find({}, {username: 1, name: 1, surname: 1}).exec());
    }
    // Return users matching query
    else {
        let mongoQuery = {};
        if (req.query.username)
            mongoQuery.username = req.query.username;
        if (req.query.email)
            mongoQuery.email = req.query.email;
        return res.status(200).json(await User.find(mongoQuery, {_id:1 ,username: 1, name: 1, surname: 1, email: 1}).exec())
    }
});


/***
 * @api {post} /users Crear nuevo usuario
 */
router.post("/users", async function (req, res) {
    console.log(req.body);

    try {
        const nuUser = await User.create({
            username: req.body.username,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        });
        console.log("Created new user", JSON.stringify(nuUser))
        delete nuUser.password;
        res.json(nuUser)

    } catch (e) {
        console.log("Error creating user", e)
        res.status(500).json(e);
    }

});




router.post("/usernames/available", async function (req, res) {


    console.log("Checking username availability", req.body.username);
    if (!req.body || !req.body.username)
        return res.status(400).json();
    const available = await IsUsernameAvailable(req.body.username);
    return res.status(200).json({
        available: available,
        msg: `${req.body.username} is ${available === true ? 'available' : 'taken'}`
    })
});


// Helper functions
async function IsUsernameAvailable(username) {
    const match = await User.findOne({username: username});
    return (!match) ? true : false;
}


module.exports = router;