/*
Import
*/

    // Node
    const express = require('express');
    const gameRouter = express.Router();

    // Inner
    const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require('../../services/server.response');
    const { checkFields } = require('../../services/request.checker');
    const { createItem, readItems, readOneItem, deleteItem, updateItem } = require('./game.controller');
//

/*
Routes definition
*/
    class GameRouterClass {

        /*
        Injection de Passport dans la class du Router
        Passport sera utilisé en middleware afin d'authentifier l'utilisateur avant sa requête
        */
            constructor({ passport }) {
                this.passport = passport;
            }
        //

        routes() {

            // Read : afficher la liste des jeux
            gameRouter.get( '/', (req, res) => {
                readItems()
                .then( apiResponse => sendApiSuccessResponse(res, 'Games received', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'Error during fetch', apiResponse) );
            });
            
            gameRouter.get('/:id', (req, res) => {
                // Error : no param present
                if (!req.params || !req.params.id) { sendBodyError(res, 'No param provided'); }

                readOneItem(req.params.id)
                .then( apiRes => sendApiSuccessResponse(res, 'Game received', apiRes))
                .catch( apiErr => sendApiErrorResponse(res, 'Error during get the item', apiErr));
            });

            // Create: ajout de passport dans le middleware
            gameRouter.post('/', this.passport.authenticate('jwt', { session: false}), (req, res) => {
                // Error: no body present
                if (typeof req.body === 'undefined' || req.body === null) { sendBodyError(res, 'No body data provided') }
                // Check fields in the body
                const { miss, extra, ok } = checkFields(['name', 'platforms', 'modes', 'rules'], req.body);
                //=> Error: bad fields provided
                if (!ok) { sendFieldsError(res, 'Bad fields provided', miss, extra) }
                //=> Request is valid: use controller
                else {
                    createItem(req.body, req.user._id)
                    .then( apiResponse => sendApiSuccessResponse(res, 'A new game is created', apiResponse) )
                    .catch( apiResponse => sendApiErrorResponse(res, 'Error during the game creation', apiResponse) );
                }
            });

            gameRouter.delete('/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Error : no param present
                if (!req.params || !req.params.id) { sendBodyError(res, 'No param provided'); }

                // Request is ok
                deleteItem(req.params.id, req.user._id)
                .then( apiRes => sendApiSuccessResponse(res, 'Game is deleted', apiRes))
                .catch( apiErr => sendApiErrorResponse(res, 'Error during deleting', apiErr));
            });

            gameRouter.put('/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                // Error : no param present
                if (!req.params || !req.params.id) { sendBodyError(res, 'No param provided'); }

                // Check fields in the body
                const { miss, extra, ok } = checkFields(['name', 'platforms', 'modes', 'rules'], req.body);
                //=> Error : bad fields
                if (!ok) { sendFieldsError(res, 'Bad fields provided', miss, extra) }
                //=> Request is valid
                else {
                    updateItem(req.body, req.params.id, req.user._id)
                    .then( apiRes => sendApiSuccessResponse(res, 'Game is updated', apiRes))
                    .catch( apiErr => sendApiErrorResponse(res, 'Error during updating', apiErr));
                }
            });
        }

        init() {
            this.routes();
            return gameRouter;
        }
    }
//

/*
Export
*/
    module.exports = GameRouterClass;