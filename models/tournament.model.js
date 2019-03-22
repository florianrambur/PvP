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

    const progressSchema = new Schema({
        roundName: String,
        nbPlayers: Number,
        remainingPlayerList: [ObjectId]
    });

    const tournamentSchema = new Schema({
        game: ObjectId,
        name: String,
        description: String,
        mode: ObjectId,
        rule: ObjectId,
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