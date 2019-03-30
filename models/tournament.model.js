/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
    const GameModel = require('../models/game.model');
//

/*
Definition
*/
    const ObjectId = mongoose.Schema.Types.ObjectId;

    const resultSchema = new Schema({
        playerId: ObjectId,
        score: Number
    });

    const progressSchema = new Schema({
        roundName: String,
        nbPlayers: Number,
        remainingPlayerList: [resultSchema]
    });

    const tournamentSchema = new Schema({
        game: ObjectId,
        name: String,
        description: String,
        mode: ObjectId,
        rules: ObjectId,
        platforms: ObjectId,
        online: Boolean,
        isPrivate: Boolean,
        nbPlayers: Number,
        startDate: Date,
        place: String,
        dateCreation: Date,
        registerList: [ObjectId],
        progression: [progressSchema],
        author: String     
    });
//

/*
Export
*/
    const TournamentModel = mongoose.model('tournament', tournamentSchema);
    module.exports = TournamentModel;
//