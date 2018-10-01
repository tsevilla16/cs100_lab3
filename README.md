# lab3
For this week's lab, we created a program that will return a readability score for a variety of texts.

We chose to implement our hash function synchronously because querying the database relies on the existence of a hash function, so if we did it asynchronously it would still require the return value from the hash function and we would have to nest our other code in the callback for the asynchronous call.

We chose to index our database in order to increase query speeds, though this is something that occurs at a cost to speed of row insertion. We still chose to index because an insertion to the database is an asynchronous call which means that it will not affect the speed of callback return.

We chose to structure our database as follows: The numbercount, lettercount, wordcount, and sentencescount values within our database were all input integers because our tokenizer returns whole number values for the number of characters, words, letters, and sentences in a text. We used a text data type for our hash for each file because it uses both letters and numbers as outputs. We also made the hash column the primary key because the hash uniquely identifies each row for each unique file. We chose to index on the filehash because our query for matching rows is based on the return value of the hash function. We also hashed the name of the file rather than the contents because we found that when a file with long text contents was hashed, the function would not behave as we anticipated

We chose to move insertdbrow into its own function for program cleanliness, but we nested other processes that could theoretically otherwise been in their own functions as they were reliant on prior returns and we needed those processes to occur in order.

We chose to index our database in order to increase query speeds, though this is something that occurs at a cost to speed of row insertion. We still chose to index because an insertion to the database is an asynchronous call which means that it will not affect the speed of callback return.