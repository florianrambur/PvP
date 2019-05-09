/*
Imports
*/
    // Node
    const express = require('express');
    const searchRouter = express.Router();

    // Inner
    const { sendBodyError, sendFieldsError, sendApiSuccessResponse, sendApiErrorResponse } = require ('../../services/server.response');
    const { checkFields } = require('../../services/request.checker');
    const { searchCompetition } = require('../../routes/search/search.controller');
//

/*
Routes definition
*/
    class SearchRouterClass {

        routes() {

            searchRouter.post('/competition', (req, res) => {
                if (typeof req.body === 'undefined' || req.body === null) { 
                    sendBodyError(res, 'No body data provided'); 
                }
            
                const { miss, extra, ok } = checkFields(['searchFields'], req.body);
            
                if (!ok) {
                    sendFieldsError(res, 'Bad fields provided', miss, extra);
                } else {
                    searchCompetition(req.body.searchFields)
                    .then( apiResponse => sendApiSuccessResponse(res, 'Search OK', apiResponse) )
                    .catch( apiResponse => sendApiErrorResponse(res, 'Error during searching', apiResponse) );
                }
            });

        }

        init() {
            this.routes();
            return searchRouter;
        }
    }
//

/*
Export
*/
    module.exports = SearchRouterClass;