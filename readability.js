const fs = require("fs");
const md5File = require('md5-file');
const sqlite3 = require('sqlite3');
const Tokenizer = require('tokenize-text');
const tokenize = new Tokenizer();
const tokenizeEnglish = require("tokenize-english")(tokenize);

//copied code from https://www.w3schools.com/nodejs/nodejs_mysql_insert.asp
//creates a referece to the sqllite database
let db = new sqlite3.Database('./textsinfo.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the textsinfo database.');
});

// Parses a text file into words, sentences, characters
function readability(filename, callback) {
    fs.readFile(filename, "utf8", (err, contents) => {
        if (err) throw err;
        
        //parse and analyze the file contents
        let extractLetters = tokenize.re(/[A-Za-z]/);
        const lettertokens = extractLetters(contents);
        let extractNumbers = tokenize.re(/[0-9]/);
        const numberTokens = extractNumbers(contents);
        const wordtokens = tokenize.words()(contents);
        const nonewlines = contents.split(/\n/).join(' ');
        const sentencesTokens = tokenizeEnglish.sentences()(nonewlines)

        const colemanLiauText = colemanLiau(lettertokens.length, wordtokens.length, sentencesTokens.length)
        const automatedReadabilityIndexText = automatedReadabilityIndex(lettertokens.length, numberTokens.length, wordtokens.length, sentencesTokens.length)

        //insert row into database
        insertDBRow (numberTokens.length, lettertokens.length, wordtokens.length, sentencesTokens.length, filename)

        callback({test: automatedReadabilityIndexText});
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

//Insert rows into database
// insert one row into the textsinfo table
function insertDBRow (numberscount, letterscount, wordscount, sentencescount, filename){
    db.run(`INSERT INTO textsinfo(numbercount, lettercount, wordcount, sentencescount, filename) VALUES(?,?,?,?,?)`, [numberscount, letterscount, wordscount, sentencescount, filename], function(err) {
        if (err) {
        return console.log(err.message);
        }
        //Console log that a row has been inserted into the database
        console.log(`A row has been inserted`);
    });
}