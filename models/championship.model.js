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

    /*
        status:
        0 = non commencé
        1 = commencé
        2 = fini
    */
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
        author: String,
        status: Number
    });
//

/*
Export
*/
    const ChampionshipModel = mongoose.model('championship', championshipSchema);
    module.exports = ChampionshipModel;
