/*
Imports
*/
    // Node
    const express = require('express');
    const authRouter = express.Router();

    // Inner
    const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require('../../services/server.response');
    const { checkFields } = require('../../services/request.checker');
    const { register, login, read } = require('./auth.controller');
//

/*
Routes definition
*/
    class AuthRouterClass {
        routes(){

            // HATEOAS
            authRouter.get( '/', (req, res) => {
                res.json('HATEOAS for auth')
            })

            // Register
            authRouter.post( '/register', (req, res) => {

                // Error: no body present
                if (typeof req.body === 'undefined' || req.body === null) { sendBodyError(res, 'No body data provided') }
                // Check fields in the body
                const { miss, extra, ok } = checkFields(['email', 'password', 'first_name', 'last_name'], req.body);
                //=> Error: bad fields provided
                if (!ok) { sendFieldsError(res, 'Bad fields provided', miss, extra) }
                //=> Request is valid: use controller
                else{
                    register(req.body, res)
                    .then( apiResponse => sendApiSuccessResponse(res, 'User is registrated', apiResponse) )
                    .catch( apiResponse => sendApiErrorResponse(res, 'Error during user registration', apiResponse))
                }
            })

            // login
            authRouter.post( '/login', (req, res) => {

                // Error: no body present
                if (typeof req.body === 'undefined' || req.body === null) { sendBodyError(res, 'No body data provided') }
                // Check fields in the body
                const { miss, extra, ok } = checkFields(['email', 'password'], req.body);
                //=> Error: bad fields provided
                if (!ok) { sendFieldsError(res, 'Bad fields provided', miss, extra) }
                //=> Request is valid: use controller
                else{
                    login(req.body, req, res)
                    .then( apiResponse => sendApiSuccessResponse(res, 'User is logged', apiResponse) )
                    .catch( apiResponse => sendApiErrorResponse(res, 'Error during user login', apiResponse))
                }
            })

            authRouter.get( '/me', (req, res) => {

                req.cookies['OTPBDtoken']

                read(req.body)
                .then( apiResponse => sendApiSuccessResponse(res, 'User is logged', apiResponse) )
                .catch( apiResponse => sendApiErrorResponse(res, 'Error during user login', apiResponse))
            })
        }

        init(){
            this.routes();
            return authRouter;
        }
    }
//

/*
Export
*/
    module.exports = AuthRouterClass;
//