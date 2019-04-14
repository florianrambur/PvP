/*
Imports
*/
    // Node
    const express = require('express');
    const championshipRouter = express.Router();

    // Inner
    const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require ('../../services/server.response');
    const { checkFields } = require('../../services/request.checker');
    const { createItem, readItems, readOneItem, registerOrUnsubscribeToTheChampionship } = require('../../routes/championship/championship.controller');
//

/*
Routes definition
*/
    class ChampionshipRouterClass {

        /*
        Injection de Passport dans la class du Router
        Passport sera utilisé en middleware afin d'authentifier l'utilisateur avant sa requête
        */
            constructor({ passport }) {
                this.passport = passport;
            }
        //

        routes() {

            // Read : afficher la liste des tournois
            championshipRouter.get('/', (req, res) => {
                readItems()
                .then( apiResponse => sendApiSuccessResponse(res, 'Championships received', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'Error during fetch', apiResponse) );
            });

            championshipRouter.get('/:id', (req, res) => {
                if (!req.params || !req.params.id) {
                    sendBodyError(res, 'No param provided');
                }
                
                readOneItem(req.params.id)
                .then( apiRes => sendApiSuccessResponse(res, 'Championship received', apiRes))
                .catch( apiErr => sendApiErrorResponse(res, 'Error during get the item', apiErr));
            });

            // Create tournament
            championshipRouter.post('/', this.passport.authenticate('jwt', { session: false }) ,(req, res) => {
                if (typeof req.body === 'undefined' || req.body === null) { 
                    sendBodyError(res, 'No body data provided'); 
                }

                const { miss, extra, ok } = checkFields(['game', 'name', 'description', 'mode', 'rules', 'platforms', 'online', 'isPrivate', 'nbPlayers', 'startDate', 'place'], req.body);

                if (!ok) {
                    sendFieldsError(res, 'Bad fields provided', miss, extra);
                } else {
                    createItem(req.body, req.user._id)
                    .then( apiResponse => sendApiSuccessResponse(res, 'A new championship is created', apiResponse) )
                    .catch( apiResponse => sendApiErrorResponse(res, 'Error during the championship creation', apiResponse) );
                }
            });

            // Add a player to the championship
            championshipRouter.put('/subscribe/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                if (!req.params || !req.params.id) { sendBodyError(res, 'No param provided'); }
                
                registerOrUnsubscribeToTheChampionship(req.user._id, req.params.id)
                .then( apiRes => sendApiSuccessResponse(res, 'Player has been added to the championship', apiRes) )
                .catch( apiErr => sendApiErrorResponse(res, 'Error during adding', apiErr) )
            });

        }

        init() {
            this.routes();
            return championshipRouter;
        }
    }
//

/*
Export
*/
    module.exports = ChampionshipRouterClass;