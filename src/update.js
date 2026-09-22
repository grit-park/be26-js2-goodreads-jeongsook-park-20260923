import { BASE_URL, fetchAndRenderBooks } from "./get.js";

const updateForm = document.getElementById("book-form-update");
const titleInput = document.getElementById("update-title");
const authorInput = document.getElementById("update-author");
const isReadInput = document.getElementById("update-isRead");
const scoreInput = document.getElementById("update-score");
const updateButton = document.getElementById("update-btn");
const cancelUpdateBtn = document.getElementById("cancel-update-btn");

function updateScoreState() {
    const isRead = isReadInput.value === "true";
    scoreInput.disabled = !isRead;
    if (!isRead) {
        scoreInput.value = "0";
    }
}

isReadInput.addEventListener("change", updateScoreState);

updateButton.addEventListener("click", async () => {
    const checkedBook = document.querySelector(".book-checkbox:checked");

    if (!checkedBook) {
        alert("Please select a book.");
        return;
    }

    const bookId = checkedBook.dataset.id;

    try {
        // GET selected book details via REST API
        const response = await fetch(`${BASE_URL}/${bookId}.json`);
        if (!response.ok) throw new Error("Book not found.");

        const book = await response.json();

        titleInput.value = book.title;
        authorInput.value = book.author;
        isReadInput.value = String(book.isRead);
        scoreInput.value = book.isRead ? String(book.score) : "0";

        updateScoreState();

        updateForm.dataset.id = bookId;
        updateForm.classList.remove("hidden");
    } catch (error) {
        console.error("Error fetching book details:", error);
        alert("Could not retrieve book details.");
    }
});

// PATCH: Update only reading status and score
updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bookId = updateForm.dataset.id;
    if (!bookId) {
        alert("No book selected.");
        return;
    }

    const isRead = isReadInput.value === "true";
    const score = isRead ? Number(scoreInput.value) : 0;

    const patchPayload = {
        isRead: isRead,
        score: score
    };

    try {
        const response = await fetch(`${BASE_URL}/${bookId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patchPayload)
        });

        if (!response.ok) throw new Error("Failed to update book.");

        console.log("Book updated via PATCH REST API:", patchPayload);
        updateForm.classList.add("hidden");
        updateForm.reset();
        delete updateForm.dataset.id;
        fetchAndRenderBooks();
    } catch (error) {
        console.error("Error updating book:", error);
    }
});

cancelUpdateBtn.addEventListener("click", () => {
    updateForm.reset();
    updateForm.classList.add("hidden");
    delete updateForm.dataset.id;
});