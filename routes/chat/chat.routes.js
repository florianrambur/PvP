/*
Imports
*/
    // Node
    const express = require('express');
    const chatRouter = express.Router();

    // Inner
    const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require('../../services/server.response');
    const { checkFields } = require('../../services/request.checker');
    const { createItem, readItem, deleteItem } = require('./chat.controller');
//

/*
Routes definition
*/
    class ChatRouterClass {
        
        /* 
        Injection de Passport dans la class du Router
        Passeport sera utiliser en middleware afin d'authentifier l'utilisateur avant se requête
        */
            constructor({ passport }) {
                this.passport = passport
            }
        //

        routes(){

            // Read : afficher la liste des messages du chat
            chatRouter.get( '/', (req, res) => {
                readItem()
                .then( apiResponse => sendApiSuccessResponse(res, 'Chat received', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'Error during fetch', apiResponse))
            });

            // Create : ajout de Passport en middleware
            chatRouter.post( '/', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Error: no body present
                if (typeof req.body === 'undefined' || req.body === null) { sendBodyError(res, 'No body data provided') }
                // Check fields in the body
                const { miss, extra, ok } = checkFields(['content'], req.body);
                //=> Error: bad fields provided
                if (!ok) { sendFieldsError(res, 'Bad fields provided', miss, extra) }
                //=> Request is valid: use controller
                else{
                    createItem(req.body, req.user._id)
                    .then( apiResponse => sendApiSuccessResponse(res, 'Chat message is created', apiResponse) )
                    .catch( apiResponse => sendApiErrorResponse(res, 'Error during chat message creation', apiResponse))
                }
            })

            // Delete : ajout de Passport en middleware
            chatRouter.delete( '/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Error: no param present
                if (!req.params || !req.params.id) { sendBodyError(res, 'No param provided') }

                // Request is OK
                deleteItem(req.params.id, req.user._id)
                .then( apiRes =>  sendApiSuccessResponse(res, 'Bookmark is deleted', apiRes))
                .catch( apiErr => sendApiErrorResponse(res, 'Error during deletion', apiErr));
            })
        }

        init(){
            this.routes();
            return chatRouter;
        }
    }
//

/*
Export
*/
    module.exports = ChatRouterClass;
//