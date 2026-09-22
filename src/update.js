import { BASE_URL, fetchAndRenderBooks } from "./get.js";

const updateForm = document.getElementById("book-form-update");
const titleInput = document.getElementById("update-title");
const authorInput = document.getElementById("update-author");
const isReadInput = document.getElementById("update-isRead");
const scoreInput = document.getElementById("update-score");
const updateButton = document.getElementById("update-btn");
const cancelUpdateBtn = document.getElementById("cancel-update-btn");

// Function for controlling the state of the score input based on the isRead value
function updateScoreState() {
    const isRead = isReadInput.value === "true";
    scoreInput.disabled = !isRead;
    if (!isRead) {
        scoreInput.value = "0";
    }
}

//isReadInput change eventListener
isReadInput.addEventListener("change", updateScoreState);

//updateBtn listener whether checkbox is checked or not.
updateButton.addEventListener("click", async () => {
    const checkedBook = document.querySelector(".book-checkbox:checked");

    if (!checkedBook) {
        alert("Please select a book.");
        return;
    }

    //THe most challenging part  is to understand 
    //how to get the book ID from the checked checkbox
    // and get the book details from database.

    // Get the book ID from the checked checkbox. 
    // dataset.id is used to retrieve the data-id attribute value 
    // from the checkbox element.
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


// ******************************************************** //
// PATCH: Update only via isRead and score 
updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bookId = updateForm.dataset.id;
    if (!bookId) {
        alert("No book selected. Please select a book");
        return;
    }

    const isRead = isReadInput.value === "true";
    const score = isRead ? Number(scoreInput.value) : 0;


    //PATCH via SAVE button in in an update form
    const patchPayload = {
        isRead: isRead,
        score: score
    };

    try {
        // PATCH: Update book via REST API
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


//eventListener for cancel button in an update form
cancelUpdateBtn.addEventListener("click", () => {
    updateForm.reset();
    updateForm.classList.add("hidden");
    delete updateForm.dataset.id;
});