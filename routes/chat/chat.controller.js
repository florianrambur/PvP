/*
Import
*/
    const ChatModel = require('../../models/chat.model')
    const UserModel = require('../../models/user.model')
//



/*
Methods
*/
    const createItem = (body, userId) => {
        return new Promise( (resolve, reject) => {
            // Définition de l'objet à enregistrer
            const newChat = {
                content: body.content,
                author: userId,
                date: new Date()
            }

            // create new chat
            ChatModel.create(newChat)
            .then( mongoResponse => resolve(mongoResponse) )
            .catch( mongoResponse => reject(mongoResponse) )
        });
    };

    const readItem = (body, userId) => {
        return new Promise( (resolve, reject) => {
            ChatModel.find((error, chat) => {
                if(error) reject(error) // Mongo Error
                else {
                    // resolve(chat)
                    let chatArray = [];
                    ((async function loop() {
                        for (let i = 0; i < chat.length; ++i) {
                            const user = await getChatUser(chat[i].author);
                            chatArray.push({user: user, chat: chat[i]})
                        }
                        // return all posts
                        return resolve(chatArray);
                    })());
                }
            });
        });
    };

    const deleteItem = (itemId, userId) => {
        return new Promise( (resolve, reject) => {
            ChatModel.findById(itemId, (error, chat) => {
                if(error) return reject(error) // Mongo Error
                else if(!chat) return reject('Message unknow')
                else{
                    // Vérifier l'identité de l'utilisateur
                    if(chat.author == userId){
                        chat.remove()
                        return resolve('Message deleted')

                    } else reject('Not allowed')    
                }
            });
        });
    };

    const getChatUser = id => {
        console.log(id)
        return new Promise( (resolve, reject) => {
            UserModel.findById( id, { email:1, _id: 0 }, (error, user) => {
                if(error) return reject(error) // Mongo Error
                else {
                    console.log(user)
                    return resolve(user)
                }
            });
        })
    }
//

/*
Export
*/
    module.exports = {
        createItem,
        readItem,
        deleteItem
    }
//