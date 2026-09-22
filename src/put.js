import { Book } from "./book.js";
import { BASE_URL, fetchAndRenderBooks, updateScoreInput } from "./get.js";

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const isReadInput = document.getElementById("isRead");
const scoreInput = document.getElementById("score");
const form = document.getElementById("book-form");

const addButton = document.getElementById("add-btn");
const cancelButton = document.getElementById("cancel-btn");

// POST: Add new book using REST API
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const newBook = new Book(
            titleInput.value,
            authorInput.value,
            isReadInput.value === "true",
            Number(scoreInput.value)
        );

        const response = await fetch(`${BASE_URL}.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBook.toJSON())
        });

        if (!response.ok) throw new Error("Failed to add book.");

        console.log("Book successfully added.");
        form.reset();

        updateScoreInput();
        form.classList.add("hidden");
        
        fetchAndRenderBooks();
    } catch (error) {
        console.error("Error adding book:", error);
    }
});


addButton.addEventListener("click", () => {
    form.classList.remove("hidden");
});

cancelButton.addEventListener("click", () => {
    form.reset();
    updateScoreInput();
    form.classList.add("hidden");
});