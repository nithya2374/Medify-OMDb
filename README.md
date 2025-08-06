
Movie Search App

A responsive web application built with HTML, CSS, and JavaScript that allows users to search for movies using the [OMDb API](https://www.omdbapi.com/).  
It displays movies in a clean grid layout, supports proper error handling, and has a dark-themed UI.


Overview:

This project integrates with the OMDb API using the following endpoints:

1. Movie Search Endpoint

[https://www.omdbapi.com/?s=](https://www.omdbapi.com/?s=)\<movie\_name>\&apikey=\<your\_api\_key>

- Purpose: Fetches a list of movies based on the search query.  
- Use: This endpoint provides essential data like movie title, release year, poster URL, and IMDb ID for rendering movie cards.

2. Poster API Endpoint (Fallback)

[https://img.omdbapi.com/?apikey=](https://img.omdbapi.com/?apikey=)\<your\_api\_key>\&i=\<imdb\_id>


- Purpose: Fetches the movie poster image directly.
- Use: When the main API returns `Poster: "N/A"`, this endpoint ensures that we still display an image, improving the user experience.

Setup:

Follow these steps to run the application locally:

1. Clone the repository

git clone https://github.com/yourusername/medify-OMDB.
cd medify-OMDB

2. Get your OMDb API key

Go to [OMDb API](https://www.omdbapi.com/apikey.aspx) and register with your email.
After activation, you’ll receive a valid API key.

3. Insert your API key

   Open `app.js`
   Replace the placeholder key:
     const API_KEY = "your_real_api_key";
     
4. Run the app locally

   Simply open `index.html` in your browser.
   No server is required for this project.


 Usage:

1. Search for a movie

* Enter a movie title in the search bar.
* Click the Search button.


2. View movie results

* Movies will be displayed in a grid layout.
* Each movie card shows the poster, title, and release year.


3. Error handling

   * Invalid API Key: Displays a red error message.
   * Movie not found:  Displays an orange warning message.
   * Network error:  Displays a yellow error message.
   * All errors automatically disappear after 5 minutes or when you perform a new search.

4. Poster Fallback

    If a movie has no poster, the app fetches the image using the Poster API endpoint or displays a default placeholder image.


Challenges:

During development, the following issues were encountered:

1. Unauthorized (401) Error

   * Cause: Using a placeholder API key (`apikey123`) instead of a valid OMDb key.
   * Solution: Registered at [OMDb API](https://www.omdbapi.com/apikey.aspx) and replaced the placeholder with a valid key.

2. Missing Poster Images

   * Cause: Some movies returned `"Poster": "N/A"` from the main endpoint.
   * Solution: Added a fallback mechanism using the `img.omdbapi.com` endpoint and a placeholder image if both fail.

3. Error Timeout Not Working

   * Cause: Previous error timeout wasn’t cleared before setting a new one.
   * Solution: Added `clearTimeout(errorTimeout)` before showing a new error message to prevent overlapping timers.

4. Sticky Footer

   * Cause: Footer floated in the middle when no movies were displayed.
   * Solution: Used `flexbox` on the `body` to ensure the footer stays at the bottom regardless of content.

