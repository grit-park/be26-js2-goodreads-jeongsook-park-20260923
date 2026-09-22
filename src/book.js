export class Book {
    #title;
    #author;
    #isRead;
    #score;

    constructor(title, author, isRead = false, score = 0) {
        this.title = title;
        this.author = author;
        this.isRead = isRead;
        this.score = score;
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        if (!value || typeof value !== "string" || value.trim() === "") {
            throw new Error("Title must be a non-empty string.");
        }
        this.#title = value.trim();
    }

    get author() {
        return this.#author;
    }

    set author(value) {
        if (!value || typeof value !== "string" || value.trim() === "") {
            throw new Error("Author must be a non-empty string.");
        }
        this.#author = value.trim();
    }

    get isRead() {
        return this.#isRead;
    }

    set isRead(value) {
        this.#isRead = Boolean(value);
        if (!this.#isRead) {
            this.#score = 0;
        }
    }

    get score() {
        return this.#score;
    }

    set score(value) {
        if (!this.#isRead) {
            this.#score = 0;
            return;
        }
        const numScore = Number(value);
        if (isNaN(numScore) || numScore < 0 || numScore > 5) {
            throw new Error("Score must be a number between 0 and 5.");
        }
        this.#score = numScore;
    }

    toJSON() {
        return {
            title: this.#title,
            author: this.#author,
            isRead: this.#isRead,
            score: this.#score
        };
    }
}