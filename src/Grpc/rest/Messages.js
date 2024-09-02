/***
 *  Implementa la API de Mensajes
 */

const express = require('express');
const router = express.Router();

const ModelUser = require('../../Main/model/User');
const MessageModel = require("../model/Message");

const {verifyTokenMiddleware} = require("../../shared/middlewares/jwtUtils");


router.get('/messages', function (req, res) {

    MessageModel.find({}, (err, messages) => {
        if (err) {
            return res.status(500).json({
                message: 'Error mostrando los messages'
            })
        }
        res.send(messages);

    })

});

// GET
router.get('/messages', verifyTokenMiddleware, async function (req, res) {

    console.log("🟢 GET MESSAGE (JWT)")
    const user_id = await ModelUser.findOne({username: req.user.username});
    const messages = await MessageModel.find({user_id: user_id});

    return res.status(200).json(messages);
});

// POST
router.post("/messages", verifyTokenMiddleware, async function (req, res) {

    console.log("🟢 POST MESSAGE (JWT)")

    const user_id = await ModelUser.findOne({username: req.user.username});


    //@todo: Restringir lo que puede ser messageFields :
    // It must be a supported type (simple) or another custom Message ;

    const nuMessage = new MessageModel({
        messageName: req.body.messageName,
        messageFields: req.body.messageFields,
        user_id: user_id
    });
    await nuMessage.save();

    return res.status(200).json(nuMessage)

});


router.put("/messages/:id", verifyTokenMiddleware, async function (req, res) {

    console.log("🟢 PUT MESSAGE (JWT)")

    const user_id = await ModelUser.findOne({username: req.user.username});

    const messageToUpdate = await MessageModel.updateOne({_id: req.params.id},
        {
            messageName: req.body.messageName,
            messageFields: req.body.messageFields
        }, {upsert: true});


    await messageToUpdate.save();


    return res.status(200).json(messageToUpdate)


});


router.delete('/messages/:id', function (req, res) {

    console.log("🟢 DELETE MESSAGE (JWT)")


    const id = req.params.id;
    MessageModel.findByIdAndRemove(id, (err, message) => {
        if (err) {
            return res.status(500).json({
                message: 'Error eliminando al message'
            })
        }
        message_delete = req.params.name;
        res.redirect('/messages');
    })
});

module.exports = router;