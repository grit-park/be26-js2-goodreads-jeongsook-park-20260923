import { Book } from "./book.js";

export const BASE_URL = "https://grit2026-default-rtdb.europe-west1.firebasedatabase.app/books";

const isReadInput = document.getElementById("isRead");
const scoreInput = document.getElementById("score");
const bookList = document.getElementById("book-list");


// ************************************************************ //
// GET books from Realtime Database REST API
export async function fetchAndRenderBooks() {
    try {
        const response = await fetch(`${BASE_URL}.json`);
        if (!response.ok) throw new Error("Failed to fetch books.");

        const books = await response.json();
        bookList.innerHTML = "";

        if (!books) {
            console.log("No books found in database.");
            return;
        }

        Object.entries(books).forEach(([id, bookData]) => {
            const book = new Book(
                bookData.title,
                bookData.author,
                bookData.isRead,
                bookData.score
            );
            createBookRow(id, book);
        });
    } catch (error) {
        console.error("Error from REST API:", error);
    }
}
// ************************************************************ //


function createBookRow(id, book) {
    // Checkbox
    const checkboxCell = document.createElement("div");
    checkboxCell.classList.add("grid-cell");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("book-checkbox");
    checkbox.dataset.id = id;
    checkboxCell.appendChild(checkbox);

    // Title 
    const titleCell = document.createElement("div");
    titleCell.classList.add("grid-cell");
    titleCell.textContent = book.title;

    // Author
    const authorCell = document.createElement("div");
    authorCell.classList.add("grid-cell");
    authorCell.textContent = book.author;

    // isRead cell with Yes/No buttons
    const readCell = document.createElement("div");
    readCell.classList.add("grid-cell");

    const readButtons = document.createElement("div");
    readButtons.classList.add("read-buttons");

    const yesButton = document.createElement("button");
    yesButton.textContent = "Yes";
    yesButton.classList.add("read-btn", "yes-button");

    const noButton = document.createElement("button");
    noButton.textContent = "No";
    noButton.classList.add("read-btn", "no-button");

    if (book.isRead) {
        yesButton.classList.add("active");
    } else {
        noButton.classList.add("active");
    }

    readButtons.append(yesButton, noButton);
    readCell.appendChild(readButtons);

    // Score with star display
    const scoreCell = document.createElement("div");
    scoreCell.classList.add("grid-cell");

    const stars = document.createElement("div");
    stars.classList.add("stars");

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("button");
        star.type = "button";
        star.textContent = "★";
        star.classList.add("star");

        if (book.isRead && i <= book.score) {
            star.classList.add("active");
        }

        stars.appendChild(star);
    }

    scoreCell.appendChild(stars);
    bookList.append(checkboxCell, titleCell, authorCell, readCell, scoreCell);
}

// Disable score select if book is unread
export function updateScoreInput() {
    const isRead = isReadInput.value === "true";
    scoreInput.disabled = !isRead;
    if (!isRead) {
        scoreInput.value = "0";
    }
}

updateScoreInput();
isReadInput.addEventListener("change", updateScoreInput);

// Initial load
fetchAndRenderBooks();