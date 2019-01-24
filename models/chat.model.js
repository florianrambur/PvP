/*
Import
*/
    const mongoose = require('mongoose')
    const { Schema } = mongoose;
//

/*
Definition
*/
    const chatSchema = new Schema({
        content: String,
        author: String,
        date: Date
    })
//

/*
Export
*/
    const ChatModel = mongoose.model('chat', chatSchema);
    module.exports = ChatModel;
//