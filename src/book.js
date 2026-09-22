//class book: to reuse in put.js and update.js
// # private fields for title, author, isRead, and score: 
//cannot be accessible from outside the class, 
// only through GET and SET methods.

export class Book {#title; #author; #isRead; #score;

    constructor(title, author, isRead = false, score = 0) {
        this.title = title;
        this.author = author;
        this.isRead = isRead;
        this.score = score;
    }

    // ******************************************************* //
    // GET and SET methods for title, author, isRead, and score 
    // title(): outsider, this.#title: insider
    get title() {return this.#title;}
    get author() {return this.#author;}
    get isRead() {return this.#isRead;}
    get score() {return this.#score;}

    set title(value) {
        if (!value ||                       //if value is null or undefined
            typeof value !== "string" ||   //type of value is not string
            value.trim() === "")           //does not allow empty string.
            {throw new Error("No empty string is allowed.");}  //HTML attribute required will not allow empty string, but this is a double check.
        this.#title = value.trim();
    }

    set author(value) {
        if (!value || 
            typeof value !== "string" || value.trim() === "") 
            {throw new Error("No empty string is allowed.");}
        this.#author = value.trim();
    }

    set isRead(value) {
        this.#isRead = Boolean(value); 
        if (!this.#isRead) {this.#score = 0;}
    }

    set score(value) {
        if (!this.#isRead) 
            {this.#score = 0; return;}

    
        const numScore = Number(value);

        //validation of score
        if (isNaN(numScore) || numScore < 0 || numScore > 5) {
            throw new Error("Score 0 (no review), choose 1-5.");
        }

        //saved to the private field
        this.#score = numScore;
    }
    // ******************************************************* //

    // Convert Book instance to JSON for REST API
    toJSON() {
        return {
            title: this.#title,
            author: this.#author,
            isRead: this.#isRead,
            score: this.#score
        };
    }
}