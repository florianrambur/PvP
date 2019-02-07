/*
Imports
*/
    const { Router } = require('express');
    const AuthRouterClass = require('./auth/auth.routes');
    const GameRouterClass = require('./game/game.routes');
    const TournamentRouterClass = require('./tournament/tournament.routes');
//

/* 
Passport Strategy
Passport est un module NPM qui permet de sécuriser les connexions utilisateur grâce à des stratégies spécifiques. Nous utilisons ici la startégie JWT (cf. setAuthentication)
*/
    const passport = require('passport');
    const { setAuthentication } = require('../services/authentication');
    setAuthentication(passport);
//

/*
Define routers
*/
    // Parent
    const mainRouter = Router();
    const apiRouter = Router();

    // Child
    const authRouter = new AuthRouterClass();
    const gameRouter = new GameRouterClass( { passport } );
    const tournamentRouter = new TournamentRouterClass( { passport } );
//

/*
Configure routes
*/
    mainRouter.use('/api', apiRouter);
    apiRouter.use('/auth', authRouter.init());
    apiRouter.use('/game', gameRouter.init());
    apiRouter.use('/tournament', tournamentRouter.init());
//

/*
Export
*/
    module.exports = { mainRouter };
//