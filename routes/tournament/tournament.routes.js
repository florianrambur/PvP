/*
Imports
*/
    // Node
    const express = require('express');
    const tournamentRouter = express.Router();

    // Inner
    const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require ('../../services/server.response');
    const { checkFields } = require('../../services/request.checker');
    const { createItem, readItems, readOneItem } = require('./tournament.controller');
//

/*
Routes definition
*/
    class TournamentRouterClass {

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
            tournamentRouter.get('/', (req, res) => {
                readItems()
                .then( apiResponse => sendApiSuccessResponse(res, 'Tournaments received', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'Error during fetch', apiResponse) );
            });

            tournamentRouter.get('/:id', (req, res) => {
                if (!req.params || !req.params.id) {
                    sendBodyError(res, 'No param provided');
                }
                
                readOneItem(req.params.id)
                .then( apiRes => sendApiSuccessResponse(res, 'Tournament received', apiRes))
                .catch( apiErr => sendApiErrorResponse(res, 'Error during get the item', apiErr));
            });

            // Create tournament
            tournamentRouter.post('/', this.passport.authenticate('jwt', { session: false }) ,(req, res) => {
                if (typeof req.body === 'undefined' || req.body === null) { 
                    sendBodyError(res, 'No body data provided'); 
                }

                const { miss, extra, ok } = checkFields(['game', 'name', 'description', 'mode', 'rule', 'online', 'isPrivate', 'nbPlayers', 'startDate', 'place'], req.body);

                if (!ok) {
                    sendFieldsError(res, 'Bad fields provided', miss, extra);
                } else {
                    createItem(req.body, req.user._id)
                    .then( apiResponse => sendApiSuccessResponse(res, 'A new tournament is created', apiResponse) )
                    .catch( apiResponse => sendApiErrorResponse(res, 'Error during the tournament creation', apiResponse) );
                }
            });
        }

        init() {
            this.routes();
            return tournamentRouter;
        }
    }
//

/*
Export
*/
module.exports = TournamentRouterClass;