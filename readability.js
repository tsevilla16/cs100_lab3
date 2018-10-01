const fs = require("fs");
const md5File = require('md5-file');
const sqlite3 = require('sqlite3');
const Tokenizer = require('tokenize-text');
const tokenize = new Tokenizer();
const tokenizeEnglish = require("tokenize-english")(tokenize);

//copied and modified code from http://www.sqlitetutorial.net/sqlite-nodejs/connect/
//creates a referece to the sqllite database
let db = new sqlite3.Database('./textsinfo.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }

});

// Parses a text file into words, sentences, characters
function readability(filename, callback) {
    fs.readFile(filename, "utf8", (err, contents) => {
        if (err) throw err;

        //create variables to store coleman liau and automated readability
        let colemanLiauText = 0;
        let automatedReadabilityIndexText = 0;

        //generate hash based on given filename
        const fileHash = md5File.sync(filename);

        //check if row exists in database table
        //referenced https://stackoverflow.com/questions/9755860/valid-query-to-check-if-row-exists-in-sqlite3
        db.get('SELECT * FROM textsinfo WHERE fileHash=?', [fileHash], (err, row) => {
              if (err) {
                  throw err;
              }
                //if the file information is not storred in the database
                if (row == undefined){
                    
                    //parse and analyze the file contents
                    let extractLetters = tokenize.re(/[A-Za-z]/);
                    const lettertokens = extractLetters(contents);
                    let extractNumbers = tokenize.re(/[0-9]/);
                    const numberTokens = extractNumbers(contents);
                    const wordtokens = tokenize.words()(contents);
                    const nonewlines = contents.split(/\n/).join(' ');
                    const sentencesTokens = tokenizeEnglish.sentences()(nonewlines)

                    //calculate coleman liau score and automated readability index score
                    colemanLiauText = colemanLiau(lettertokens.length, wordtokens.length, sentencesTokens.length)
                    automatedReadabilityIndexText = automatedReadabilityIndex(lettertokens.length, numberTokens.length, wordtokens.length, sentencesTokens.length)

                    //if no insert into database
                    //insert row into database
                    insertDBRow (fileHash, numberTokens.length, lettertokens.length, wordtokens.length, sentencesTokens.length, colemanLiauText, automatedReadabilityIndexText)

                    //callback the calculated file information
                    callback(
                        "characters: " + (numberTokens.length + lettertokens.length) + "\n" +
                        "words: " + wordtokens.length + "\n" +
                        "sentences: " + sentencesTokens.length + "\n" +
                        "-------------------" + "\n" +
                        "Coleman-Liau Score: " + colemanLiauText + "\n" +
                        "Automated Readability Index: " + automatedReadabilityIndexText
                    );

                }
                //else if the file information is stored in the database
                else {
                        //callback the file information in the database
                        callback(
                            "characters: " + (row.numbercount + row.lettercount) + "\n" +
                            "words: " + row.wordcount + "\n" +
                            "sentences: " + row.sentencescount + "\n" +
                            "-------------------" + "\n" +
                            "Coleman-Liau Score: " + row.colemanLiau + "\n" +
                            "Automated Readability Index: " + row.automatedReadability
                        );
                }
        });
        
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
//copied and modified code from http://www.sqlitetutorial.net/sqlite-nodejs/insert/
// insert one row into the textsinfo table
function insertDBRow (fileHash, numberscount, letterscount, wordscount, sentencescount, colemanLiauNum, automatedReadabiltyNum){
    db.run(`INSERT INTO textsinfo(fileHash, numbercount, lettercount, wordcount, sentencescount, colemanLiau, automatedReadability) VALUES(?,?,?,?,?,?,?)`, [fileHash, numberscount, letterscount, wordscount, sentencescount, colemanLiauNum, automatedReadabiltyNum], function(err) {
        if (err) {
        return console.log(err.message);
        }

    });
}