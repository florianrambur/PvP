export interface GameModel {
    _id?: String,
    name: String,
    platforms: [String],
    modes: [{
        name: String,
        description: String
    }],
    rules: [{
        name: String,
        description: String
    }],
    isValidate: Boolean,
    author: String,
    date: Date
}