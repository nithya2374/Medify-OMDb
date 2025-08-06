const API_KEY = "6d675181"; // Insert your OMDb API key here
const searchBtn = document.getElementById("searchBtn");
const queryInput = document.getElementById("query");
const moviesContainer = document.getElementById("movies");

let errorTimeout; // Store timeout reference


// Event listener for search button
searchBtn.addEventListener("click", fetchMovies);

// Fetch movies based on search query
async function fetchMovies() {
    const query = queryInput.value.trim();
    clearTimeout(errorTimeout); // Clear previous error timeout

    if (!query) {
        showError("Please enter a movie title!");
        return;
    }

   moviesContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#888;">Loading...</p>`;

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
        const data = await response.json();

        if ( data.Response === "True" &&  data.Search ) {
            renderMovies(data.Search);
        } else {

            // Handle API-specific errors
            if (data.Error === "Invalid API key!") 
            {
                showError("Invalid API Key! Please check your configuration.", "critical");
            } 

            else if (data.Error === "Movie not found!") 
            {
                showError("No movies found. Try another title.", "warning");
            } 
            else 
            {
                showError(data.Error || "Something went wrong.", "error");
            }
        }
    } 

    catch (error) {
        console.error("Error fetching movies:", error);
        showError("Network error! Please check your connection and try again.", "network");
    }
}

// Render movie cards
function renderMovies(movies) {

    clearTimeout(errorTimeout); // Clear error timeout if new data is loaded
    moviesContainer.innerHTML = "";
    

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        // Use Poster API if Poster is missing
        let poster;
        if (movie.Poster !== "N/A") {
            poster = movie.Poster;
        } else {
            // Use direct image endpoint
            poster = `https://img.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`;
        }

        card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;

        moviesContainer.appendChild(card);
    });
}

function showError(message , type="error") {

    let color = "#ff7043"; // default (warning)
    if (type === "critical") color = "#ff4d4d"; // red
    if (type === "network") color = "#ffc107"; // yellow

    moviesContainer.innerHTML = `
        <div class="error-box" style="border-color:${color}; color:${color};">
            <p>${message}</p>
        </div>
    `;

    // Auto-hide error after 5 minutes
    errorTimeout = setTimeout(() => {
        moviesContainer.innerHTML = "";
    }, 5 * 60 * 1000); // 5 min
}

window.addEventListener("scroll", function () {
        const header = document.querySelector("header");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });