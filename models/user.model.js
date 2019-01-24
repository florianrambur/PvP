/*
Import
*/
    const mongoose = require('mongoose')
    const { Schema } = mongoose;
    const jwt = require('jsonwebtoken');
//

/*
Definition
*/
    const userSchema = new Schema({
        first_name: String,
        last_name: String,
        email: String,
        password: String
    });
//

/*
Methode
*/
    userSchema.methods.generateJwt = function  generateJwt(){
        // set expiration
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 59);

        // JWT creation
        return jwt.sign({
            _id: this._id,
            email: this.email,
            password: this.password,
            expireIn: '10s',
            exp: parseInt(expiry.getTime() / 100, 10)
        }, process.env.JWT_SECRET )
    }
//

/*
Export
*/
    const UserModel = mongoose.model('user', userSchema);
    module.exports = UserModel;
//