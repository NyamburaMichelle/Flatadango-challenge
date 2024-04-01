document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "http://localhost:3000";

    // Function to fetch movie details by ID
    function fetchMovieDetails(movieId) {
        return fetch(`${baseURL}/films/${movieId}`)
            .then(response => response.json())
            .catch(error => console.error("Error fetching movie details:", error));
    }

    // Function to fetch all movies
    function fetchAllMovies() {
        return fetch(`${baseURL}/films`)
            .then(response => response.json())
            .catch(error => console.error("Error fetching all movies:", error));
    }

    // Function to display movie details
    function displayMovieDetails(movie) {
        const poster = document.getElementById("poster");
        poster.src = movie.poster;
        
        document.getElementById("title").textContent = movie.title;
        document.getElementById("runtime").textContent = `Runtime: ${movie.runtime} mins`;
        document.getElementById("showtime").textContent = `Showtime: ${movie.showtime}`;
        document.getElementById("film-info").textContent = `${movie.description}`;
        let available = movie.capacity - movie.tickets_sold
        
        document.getElementById("ticket-num").textContent = available
        
        const availableTickets = movie.capacity - movie.tickets_sold;
        document.getElementById("tickets").textContent = `Available Tickets: ${availableTickets}`;
        
        // Display sold-out if no tickets available
        const buyButton = document.getElementById("buyButton");
        if (availableTickets === 0) {
            buyButton.textContent = "Sold Out";
            buyButton.disabled = true;
        } else {
            buyButton.textContent = "Buy Ticket";
            buyButton.disabled = false;
        }
    }

    // Function to update ticket count and display sold out
    // Function to update ticket count and display sold out
    // Function to update ticket count and display sold out
function buyTicket(movieId) {
    fetchMovieDetails(movieId)
        .then(movie => {
            let available = movie.capacity - movie.tickets_sold;
            if (available > 0) {
                movie.tickets_sold++;
                available--; // Decrement available tickets
                // Update movie details on the server
                fetch(`${baseURL}/films/${movieId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ tickets_sold: movie.tickets_sold })
                })
                .then(() => {
                    displayMovieDetails(movie); // Update display immediately
                    updateMovieList(); // Update movie list (if necessary)
                })
                .catch(error => console.error("Error updating movie details:", error));
            } else {
                console.log("Tickets sold out!");
            }
        })
        .catch(error => console.error("Error fetching movie details:", error));
}



    // Function to display movie list
    function displayMovieList(movies) {
        const filmsList = document.getElementById("films");
        filmsList.innerHTML = "";
        movies.forEach(movie => {
            const listItem = document.createElement("li");
            listItem.textContent = movie.title;
            listItem.classList.add("film", "item");
            listItem.addEventListener("click", () => {
                fetchMovieDetails(movie.id)
                    .then(movie => displayMovieDetails(movie))
                    .catch(error => console.error("Error fetching movie details:", error));
            });
            filmsList.appendChild(listItem);
        });
    }

    // Function to update movie list
    function updateMovieList() {
        fetchAllMovies()
            .then(movies => displayMovieList(movies))
            .catch(error => console.error("Error updating movie list:", error));
    }

    // Initial setup
    fetchMovieDetails(1)
        .then(movie => displayMovieDetails(movie))
        .catch(error => console.error("Error fetching initial movie details:", error));

    updateMovieList();

    // Event listener for buy ticket button
    // Event listener for buy ticket buttons
const buyButtons = document.querySelectorAll(".buy-ticket-button");
buyButtons.forEach(button => {
    button.addEventListener("click", () => {
        const movieId = button.dataset.movieId;
        buyTicket(movieId);
    });
});

});
