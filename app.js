const API_KEY = "6d675181"; //Insert your OMDb API key here
const searchBtn = document.getElementById("searchBtn");
const queryInput = document.getElementById("query");
const moviesContainer = document.getElementById("movies");

let errorTimeout; // Store timeout reference
let currentIndex = 0;
let currentMovies = [];


// Event listener for search button
searchBtn.addEventListener("click", fetchMovies); //for search button

// Fetch movies based on search query
async function fetchMovies() {

    const query = queryInput.value.trim();
    clearTimeout(errorTimeout); // Clear previous error timeout

    if (!query) {
        showError("Please enter a movie title!");
        return;
    }

   moviesContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#888; font-size:bold">Loading...</p>`;

    try {

        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`); //search api and fetch movies using api key
        const data = await response.json();

        if ( data.Response === "True" &&  data.Search ) {
            renderMovies(data.Search);
        } 

        else {

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
    

    movies.forEach((movie,index) => {

        const card = document.createElement("div");
        card.classList.add("movie-card");

        let poster = movie.Poster !== "N/A"
            ? movie.Poster
            : `https://img.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`; // fetch poster image usng apikey

        card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        `;

         card.addEventListener("click", () => {
            currentIndex = index; 
            fetchMovieDetails(movie.imdbID); //display movies related to search
        });

        moviesContainer.appendChild(card);
    });
}

function showError(message , type="critical") {

    let bgColor = "rgba(150, 0, 0, 0.4)";  // default (red)
    let borderColor = "rgba(255, 0, 0, 0.4)";

    if (type === "network") { 
        bgColor = "rgba(0, 180, 255, 0.2)"; 
        borderColor = "rgba(0, 212, 255, 0.4)";//slightly blue
    } 
    else if (type === "warning") { 
        bgColor = "rgba(200, 150, 0, 0.3)"; 
        borderColor = "rgba(255, 200, 0, 0.4)";//yellow
    }

    moviesContainer.innerHTML = `
        <div class="error-box" style="
                background:${bgColor};
                border:2px solid ${borderColor};
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                color:#fff;
            ">
            <p>${message}</p>
            <button onclick="moviesContainer.innerHTML=''">Dismiss</button> 

        </div>
    `;

    // Auto-hide error after 5 minutes
    errorTimeout = setTimeout(() => {
        moviesContainer.innerHTML = "";
    }, 5 * 60 * 1000); // 5 min
}

async function fetchMovieDetails(imdbID) {

    try {

        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`); //fetching movie detail using id
        const movie = await response.json();

        if (movie.Response === "True") {
            showMovieModal(movie);//movie detail available
        } 

        else {
            showError("Could not load movie details.", "warning");
        }

    } catch (error) {
        console.error("Error fetching movie details:", error);
        showError("Failed to load movie details.", "network");//show blue color
    }
}


function showMovieModal(movie) {

    const modal = document.getElementById("movieModal");
    const movieDetails = document.getElementById("movieDetails");
    const closeBtn = document.querySelector(".close-btn");

    const poster = movie.Poster !== "N/A"
        ? movie.Poster
        : `https://img.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`; //else fetching movie poster using api

    movieDetails.innerHTML = `
        <img src="${poster}" alt="${movie.Title}">
        <div>
            <h2>${movie.Title} (${movie.Year})</h2>
            <p><strong>Rated:</strong> ${movie.Rated}</p>
            <p><strong>Released:</strong> ${movie.Released}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p> 
        </div>
    `;

    modal.style.display = "flex"; //display row

    closeBtn.onclick = () => { modal.style.display = "none"; }; //close modal
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
    
}


window.addEventListener("scroll", function () {

        const header = document.querySelector("header");
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
     });