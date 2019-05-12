/*
Import
*/
    const GameModel = require('../../models/game.model');
    const ChampionshipModel = require('../../models/championship.model');
    const TournamentModel = require('../../models/tournament.model');
    const UserModel = require('../../models/user.model');
//

/*
Methods
*/
    const createItem = (body, userId) => {
        return new Promise( (resolve, reject) => {
            // Définition de l'objet à enregistrer
            const newGame = {
                name: body.name,
                platforms: body.platforms,
                modes: body.modes,
                rules: body.rules,
                isValidate: false,
                image: body.image,
                author: userId,
                date: new Date()
            }

            // create new game
            GameModel.create(newGame)
            .then( mongoResponse => resolve(mongoResponse) )
            .catch( mongoResponse => reject(mongoResponse) )
        });
    }

    const readItems = (body, userId) => {
        return new Promise( (resolve, reject) => {
            GameModel.find((error, game) => {
                if(error) reject(error) // Mongo Error
                else {
                    // resolve(game)
                    let gameArray = [];
                    ((async function loop() {
                        for (let i = 0; i < game.length; ++i) {
                            const user = await getGameUser(game[i].author);
                            gameArray.push({user: user, game: game[i]})
                        }
                        // return all posts
                        return resolve(gameArray);
                    })());
                }
            });
        });
    };

    const readOneItem = (itemId) => {
        return new Promise( (resolve, reject) => {
            GameModel.findById(itemId, (error, game) => {
                if(error) reject(error)
                else if(!game) return reject('Jeu non trouvé')
                else {
                    
                    getGameUser(game.author)
                    .then(author => resolve({ author: author, game: game }));
                    
                    return;
                }
            });
        });
    }

    const readOneItemByName = (itemName) => {
        return new Promise( (resolve, reject) => {
            GameModel.findOne( { name: itemName.toString() }, (error, game) => {
                if(error) reject(error)
                else if(!game) return reject('Jeu non trouvé')
                else {
                    const user = getGameUser(game.author);
                    return resolve({ user: user, game: game });
                }
            });
        });
    }

    const deleteItem = (itemId, userId) => {
        return new Promise( (resolve, reject) => {
            GameModel.findById(itemId, (error, game) => {
                if (error) return reject(error)
                else if(!game) return reject('Jeu non trouvé')
                else {
                    if (game.author == userId) {
                        ChampionshipModel.find({ "game": game._id }, (error, championships) => {
                            if (championships) {
                                championships.forEach(function(championship) {
                                    championship.remove();
                                });
                            }
                        });
                        TournamentModel.find({ "game": game._id }, (error, tournaments) => {
                            if (tournaments) {
                                tournaments.forEach(function(tournament) {
                                    tournament.remove();
                                });
                            }
                        });
                        game.remove();
                        return resolve('Game deleted with success');
                    } else {
                        return reject('Not allowed');
                    }
                }
            });
        });
    }

    const updateItem = (body, itemId, userId) => {
        return new Promise( (resolve, reject) => {
            GameModel.findById(itemId, (error, game) => {
                if (error) return reject(error)
                else if(!game) return reject('Jeu non trouvé')
                else {
                    if (game.author == userId) {
                        const updateGame = {
                            name: body.name,
                            platforms: body.platforms,
                            modes: body.modes,
                            rules: body.rules,
                            image: body.image
                        }

                        GameModel.update(updateGame)
                        .then( mongoResponse => resolve(mongoResponse) )
                        .catch( mongoResponse => reject(mongoResponse) )
                    } else {
                        return reject('Not allowed');
                    }
                }
            });
        });
    }

    const getGameUser = id => {
        console.log(id)
        return new Promise( (resolve, reject) => {
            UserModel.findById( id, { pseudo: 2, email: 1, _id: 0 }, (error, user) => {
                if(error) return reject(error) // Mongo Error
                else {
                    console.log(user)
                    return resolve(user)
                }
            });
        })
    }

/*
Export
*/
module.exports = {
    createItem,
    readItems,
    readOneItem,
    readOneItemByName,
    deleteItem,
    updateItem
}
//