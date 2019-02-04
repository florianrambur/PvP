export interface UserModel {
    _id?: String,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    parameters: {
        pseudo: String,
        twitch: String,
        discord: String
    }
}