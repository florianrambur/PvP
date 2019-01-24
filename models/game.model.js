/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
    const jwt = require('jsonwebtoken');
//

/*
Definition
*/
    const rulesSchema = new Schema({
        name: String,
        description: String
    });

    const platformSchema = new Schema({
        name: String
    });
    
    const modesSchema = new Schema({
        name: String,
        description: String
    });

    const gameSchema = new Schema({
        name: String,
        platforms: [platformSchema],
        modes: [modesSchema],
        rules: [rulesSchema],
        isValidate: Boolean,
        author: String,
        date: Date
    });
//

/*
Export
*/
    const GameModel = mongoose.model('game', gameSchema);
    module.exports = GameModel;
//