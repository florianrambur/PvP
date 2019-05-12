/*
Functions
*/

    const arrayRemove = (array, value) => {
        return array.filter(function(element){
            return element != value;
        });
    }

    const arrayRemoveForRanking = (array, value) => {
        return array.filter(function(element){
            return element.playerId != value;
        });
    }

    const arrayRemoveForPlayerA = (array, value) => {
        return array.filter(function(element){
            return element.playerA != value;
        });
    }

    const arrayRemoveForPlayerB = (array, value) => {
        return array.filter(function(element){
            return element.playerB != value;
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

/*
Export
*/
    module.exports = { arrayRemove, arrayRemoveForRanking, shuffleArray, arrayRemoveForPlayerA, arrayRemoveForPlayerB };
//