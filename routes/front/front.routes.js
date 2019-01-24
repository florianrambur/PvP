/*
Imports
*/
const express = require('express');
const frontRouter = express.Router();
//

/*
Routes definition
*/
class FrontRouterClass {
    routes(){
        // Main route
        frontRouter.get( ['/'], (req, res) => {
            res.render('index')
        });
    };

    init(){
        this.routes();
        return frontRouter;
    };
};
//

/*
Export
*/
module.exports = FrontRouterClass;
//