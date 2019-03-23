/*
Functions
*/

    const arrayRemove = (array, value) => {
        return array.filter(function(element){
            return element != value;
        });
    }

/*
Export
*/
    module.exports = { arrayRemove };
//