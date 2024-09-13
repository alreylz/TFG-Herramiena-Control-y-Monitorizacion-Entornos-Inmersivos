/**
 * @fileOverview: Defines & implements the REST API endpoints for Services (groups of GRPCs defined by the user via GUI)
 */


const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")


const ModelUser = require('../../Main/model/User');


const ModelService = require("../model/Service")
const ModelRPC = require('../model/RPC');
const {all} = require("axios");
const {verifyTokenMiddleware} = require("../../shared/middlewares/jwtUtils");


var servicio_delete = "";


//OBTENER SERVICIOS JSON ASOCIADOS SIEMPRE A UN USUARIO
router.get('/services', verifyTokenMiddleware, async function (req, res) {

        console.log("REST GET /services".yellow() + " user: " + JSON.stringify(req.user));


        const theUser = await ModelUser.find({username: req.user.username})


        const allServices = await ModelService.find({user_id: theUser});

        console.log(allServices);


        return res.status(200).json(allServices);
    }
);


/***
 * @description : Creates a service provided a name and a set of already defined rpc names
 */
router.post('/services', verifyTokenMiddleware, async function (req, res) {

        console.log("REST POST /services".yellow() + " user: " + JSON.stringify(req.user));


        //Get the full user info from the database
        const theUser = await ModelUser.findOne({username: req.user.username})
        console.log(req.body)
        debugger;

        //Get the RPCs from the request body data and find them in the database

        const grpcs = await ModelRPC.find({name: {$in: req.body.grpcs}, user_id: theUser._id});


        console.log(grpcs)

        debugger;
        // Create a new service from the request body data
        const newService = new ModelService({
            name: req.body.name,
            description: req.body.description || "",
            grpcs: grpcs,
            user_id: theUser._id
        });

        const addedService = await newService.save();

        //

        return res.status(200).json(addedService);
    }
);


/***
 * @description : Deletes an existing service from the database
 */
router.delete('/services/:id', verifyTokenMiddleware, async function (req, res) {

    console.log(`REST DELETE /services ${req.params.id}`.yellow() + " user: " + JSON.stringify(req.user));

    try {
        const user = await ModelUser.findOne({username: req.user.username});
        console.log(user);
        let removed = await ModelService.findOneAndRemove({_id: req.params.id, user_id: user});
        if (!removed)
            return res.status(404).json({
                error: "Not found",
                details: `A service with the provided id '${req.params.id}' does not exist`
            });
        return res.status(200).json(removed);

    } catch (e) {
        return res.status(500).json({msg: "Something went wrong " + e})
    }


});


//OBTENER SERVICIOS JSON
router.get('/get/allServices', function (req, res) {

    ModelService.find({}, (err, servicios) => {
        if (err) {
            return res.status(500).json({
                message: 'Error mostrando los servicios'
            })
        }
        res.send(servicios);
    })
});


//ELIMINAR SERVICIO
router.get('/delete_service/:id/:name', function (req, res) {
    const id = req.params.id;
    ModelService.findByIdAndRemove(id, (err, service) => {
        if (err) {
            return res.status(500).json({
                message: 'Error eliminando al message'
            })
        }
        servicio_delete = req.params.name;
        res.redirect('/services');
    })

});


module.exports = router;