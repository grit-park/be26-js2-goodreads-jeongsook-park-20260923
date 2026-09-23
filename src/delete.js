import { BASE_URL, fetchAndRenderBooks } from "./get.js";

const deleteButton = document.getElementById("delete-btn");

deleteButton.addEventListener("click", async () => {
    const checkedBooks = document.querySelectorAll(".book-checkbox:checked");

    if (checkedBooks.length === 0) {
        alert("Please select a book.");
        return;
    }

    try {
        for (const checkbox of checkedBooks) {
            const bookId = checkbox.dataset.id;

            // DELETE book via REST API: book ID
            const response = await fetch(`${BASE_URL}/${bookId}.json`, {
                method: "DELETE"
            });

            if (!response.ok) {
                console.error(`Failed to delete book ${bookId}`);
                alert(`Failed to delete book ${bookId}`);
            }
        }

        console.log("Selected books deleted.");
        alert("All selected books deleted.");
        fetchAndRenderBooks();

    } catch (error) {
        console.error("Error deleting book(s):", error);
        alert("Error deleting book(s).");
    }
});