/*
Import
*/
const UserModel = require('../../models/user.model');
const ChampionshipModel = require('../../models/championship.model');
const GameModel = require('../../models/game.model');
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
                    const newUser = {
                        pseudo: body.pseudo,
                        email: body.email,
                        password: body.password,
                        countConnection: 0,
                        countWin: 0,
                        parameters: body.parameters
                    }
                    UserModel.create(newUser)
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
                    const token = user.generateJwt();

                    // Set cookie
                    // res.cookie("PvPToken", user.generateJwt(), { httpOnly: false });

                    updateCountConnection(body);

                    resolve({ user, token })
                }
            }
        } )
    })
}

const updateCountConnection = (body) => {
    return new Promise( (resolve, reject) => {
        UserModel.findOne( { email: body.email }, (error, user) => {
            if(error) reject(error)
            else {
                UserModel.updateOne({ email: body.email }, {
                    $set: {
                        countConnection: user.countConnection + 1
                    }
                })
                .then( mongoResponse => resolve(mongoResponse) )
                .catch( mongoResponse => reject(mongoResponse) )
            }
        });
    });
}

const readOneItem = (itemId) => {
    return new Promise( (resolve, reject) => {
        UserModel.findById(itemId, (error, user) => {
            if (error) return reject(error)
            else if (!user) return reject('Utilisateur non trouvé');
            else {
                ChampionshipModel.find({ registerList: itemId }, (error, championships) => {
                    if (error) reject(error)
                    else {
                        let championshipArray = [];
                        ((async function loop() {
                            for (let i = 0; i < championships.length; i++) {
                                const infos = await getChampionshipInfos(championships[i].game);
                                championshipArray.push({ infos: infos, championship: championships[i]})
                            }
        
                            return resolve({ 
                                championshipArray: championshipArray, 
                                pseudo: user.pseudo, 
                                email: user.email,
                                parameters: user.parameters,
                                countWin: user.countWin,

                            });
                        })());
                        // getChampionshipInfos(championship.author, championship.game, championship.platforms, championship.rules, championship.mode, championship.registerList)
                        // .then(infos => resolve({ MVP: MVP, infos: infos, championship: championship }));;

                        // resolve({ 
                        //     pseudo: user.pseudo, 
                        //     email: user.email,
                        //     parameters: user.parameters,
                        //     countWin: user.countWin,
                        //     championships: championships
                        // });
                    }
                });
            }
        });
    });
}

const read = body => {
    return new Promise( (resolve, reject) => {
        console.log('test', body)
        UserModel.findOne( { email: body.email }, (error, user) => {
            if(error) reject(error) // Mongo Error
            else {
                return resolve(user)
            };
        });
        
    });
};

const getChampionshipInfos = (gameId) => {
    return new Promise( (resolve, reject) => {

        GameModel.findById( gameId, { name: 1, image: 1, _id: 0 }, (error, game) => {
            if (error) return reject(error)
            else {
                let result = {};

                result.game = game.name;
                result.image = game.image;
                
                resolve(result);
            }
        });
    });
} 
//

/*
Export
*/
module.exports = {
    register,
    login,
    read,
    readOneItem
}
//