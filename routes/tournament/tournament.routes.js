/*
Imports
*/
    // Node
    const express = require('express');
    const tournamentRouter = express.Router();

    // Inner
    const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require ('../../services/server.response');
    const { checkFields } = require('../../services/request.checker');
    const { createItem, readItems, readOneItem, registerOrUnsubscribeToTheTournament, randomDrawing, updateScore, nextRound } = require('./tournament.controller');
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

                const { miss, extra, ok } = checkFields(['game', 'name', 'description', 'mode', 'rules', 'platforms', 'online', 'isPrivate', 'nbPlayers', 'startDate', 'place'], req.body);

                if (!ok) {
                    sendFieldsError(res, 'Bad fields provided', miss, extra);
                } else {
                    createItem(req.body, req.user._id)
                    .then( apiResponse => sendApiSuccessResponse(res, 'A new tournament is created', apiResponse) )
                    .catch( apiResponse => sendApiErrorResponse(res, 'Error during the tournament creation', apiResponse) );
                }
            });

            // Add a player to the tournament
            tournamentRouter.put('/subscribe/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                if (!req.params || !req.params.id) { sendBodyError(res, 'No param provided'); }
                
                registerOrUnsubscribeToTheTournament(req.user._id, req.params.id)
                .then( apiRes => sendApiSuccessResponse(res, 'Player has been added to the tournament', apiRes) )
                .catch( apiErr => sendApiErrorResponse(res, 'Error during adding', apiErr) )
            });
            
            // Drawing first round of the tournament
            tournamentRouter.put('/drawing/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                if (!req.params || !req.params.id) { sendBodyError(res, 'No param provided'); }

                randomDrawing(req.params.id)
                .then( apiRes => sendApiSuccessResponse(res, 'First round has been drawing', apiRes) )
                .catch( apiErr => sendApiErrorResponse(res, 'Error during drawing', apiErr) )
            });

            // Update score for a game
            tournamentRouter.put('/updateScore/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                if (!req.params || !req.params.id) { sendBodyError(res, 'No param provided'); }

                const { miss, extra, ok } = checkFields(['scorePlayer1', 'scorePlayer2', "roundId"], req.body);

                if (!ok) {
                    sendFieldsError(res, 'Bad fields provided', miss, extra);
                } else {
                    updateScore(req.params.id, req.user._id, req.body)
                    .then( apiRes => sendApiSuccessResponse(res, 'Score has been updated', apiRes) )
                    .catch( apiErr => sendApiErrorResponse(res, 'Error during updating', apiErr) )
                }
            });

            // Testing next round
            tournamentRouter.put('/nextRound/:id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
                if (!req.params || !req.params.id) { sendBodyError(res, 'No param provided'); }

                nextRound(req.params.id)
                .then( apiRes => sendApiSuccessResponse(res, 'Next round has been drawing', apiRes) )
                .catch( apiErr => sendApiErrorResponse(res, 'Error during drawing', apiErr) )
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