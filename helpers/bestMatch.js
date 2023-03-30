const stringSimilarity = require('string-similarity');

const sinners = ['Yi Sang', 'Faust', 'Don Quixote', 'Ryoshu', 'Meursault', 'Hong Lu', 'Heathcliff', 'Ishmael', 'Rodion', 'Sinclair', 'Outis', 'Gregor', 'Dante'];

function bestMatch(sinner) {

    // Capitalize name
    if (typeof(sinner) != 'string') return;
    sinner = sinner.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

    // Rate similarity
    let bestMatch = stringSimilarity.findBestMatch(sinner, sinners).bestMatch;

    if (bestMatch.rating < 0.3) return false;
    
    // Return
    return bestMatch.target;
}

module.exports = bestMatch