/*
Import
*/
const UserModel = require('../../models/user.model')
const bcrypt = require('bcryptjs');
//

/*
Methods
*/
const register = (body, res) => {
    return new Promise( (resolve, reject) => {

        UserModel.findOne( { email: body.email }, (error, user) => {
            if(error) return reject(error) // Mongo Error
            else if(user) return reject('User already exist')
            else{
                // Hash user password
                bcrypt.hash( body.password, 10 )
                .then( hashedPassword => {  
                    // Change user pasword
                    body.password = hashedPassword;

                    // Register new user
                    UserModel.create(body)
                    .then( mongoResponse => resolve(mongoResponse) )
                    .catch( mongoResponse => reject(mongoResponse) )
                })
                .catch( hashError => reject(hashError) );
            };
        });
        
    });
};

const login = (body, req, res) => {
    return new Promise( (resolve, reject) => {
        UserModel.findOne( {email: body.email}, (error, user) =>{
            if(error) reject(error)
            else if(!user) reject('Unknow user')
            else{
                // Check password
                const validPassword = bcrypt.compareSync(body.password, user.password);
                if( !validPassword ) reject('Password not valid')
                else {
                    // Set cookie
                    res.cookie("OTPBDtoken", user.generateJwt(), { httpOnly: true });

                    // Resolve user data
                    resolve(user)
                }
            }
        } )
    })
}

const read = body => {
    return new Promise( (resolve, reject) => {
        console.log('test',body)
        UserModel.findOne( { email: body.email }, (error, user) => {
            if(error) reject(error) // Mongo Error
            else {
                return resolve(user)
            };
        });
        
    });
};
//

/*
Export
*/
module.exports = {
    register,
    login,
    read
}
//