/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//

/*
Definition
*/
    const ObjectId = mongoose.Schema.Types.ObjectId; 

    const matchesSchema = new Schema({
        playerA: ObjectId,
        scorePlayerA: Number,
        playerB: ObjectId,
        scorePlayerB: Number
    });

    const rankingSchema = new Schema({
        playerId: ObjectId,
        nbMatches: Number,
        points: Number,
        average: Number
    });

    const championshipSchema = new Schema({
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
        matches: [matchesSchema],
        ranking: [rankingSchema],
        author: String
    });
//

/*
Export
*/
    const ChampionshipModel = mongoose.model('championship', championshipSchema);
    module.exports = ChampionshipModel;
