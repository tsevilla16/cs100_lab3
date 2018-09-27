const fs = require("fs");
const md5File = require('md5-file');
const sqlite3 = require('sqlite3');
const Tokenizer = require('tokenize-text');
const tokenize = new Tokenizer();
const tokenizeEnglish = require("tokenize-english")(tokenize);

//characters var tokens = tokenize.characters()('abc');
//words var tokens = tokenize.words()('hello, how are you?');
//setences var tokens = tokenizeEnglish.sentences("On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration.")

// Parses a text file into words, sentences, characters
function readability(filename, callback) {
    fs.readFile(filename, "utf8", (err, contents) => {
        if (err) throw err;

        // TODO: parse and analyze the file contents
        const charactertokens = tokenize.characters()(contents);
        const wordtokens = tokenize.words()(contents);
        const sentencesTokens = tokenizeEnglish.sentences()(contents)
        callback({test: "PUT IN HERE WHAT YOU ACTUALLY WANT TO PRINT TO CONSOLE"});
    });
}

// Computes Coleman-Liau readability index
function colemanLiau(letters, words, sentences) {
    return (0.0588 * (letters * 100 / words))
        - (0.296 * (sentences * 100 / words))
        - 15.8;
}

// Computes Automated Readability Index
function automatedReadabilityIndex(letters, numbers, words, sentences) {
    return (4.71 * ((letters + numbers) / words))
        + (0.5 * (words / sentences))
        - 21.43;
}

// Calls the readability function on the provided file and defines callback behavior
if (process.argv.length >= 3) {
    readability(process.argv[2], data => {
        console.log(data);
    });
}
else {
    console.log("Usage: node readability.js <file>");
}
