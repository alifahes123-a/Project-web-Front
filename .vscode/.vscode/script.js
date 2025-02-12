const API_KEY = '9a32d813a1fe401688bcfa15ce43c963'; // Replace with your TMDb API key
const API_URL = 'https://api.themoviedb.org/3/search'; // TMDb API search endpoint

// Select DOM Elements
const searchBtn = document.getElementById('search-btn');
const searchType = document.getElementById('search-type');
const movieSearchInput = document.getElementById('movie-search');
const movieResults = document.getElementById('results-grid');

// Event Listener for Search Button
searchBtn.addEventListener('click', () => {
    const query = movieSearchInput.value.trim(); // Get the value from the input
    const type = searchType.value; // Get the selected type (movie or TV)
    if (query) {
        searchMoviesOrTVShows(type, query); // Call the search function
    } else {
        alert('Please enter a search term.');
    }
});

// Function to Search for Movies or TV Shows
function searchMoviesOrTVShows(type, query) {
    const genre = document.getElementById('genre').value; // Get selected genre
    const year = document.getElementById('year').value; // Get selected year

    // Build the API URL with filters
    let url = `${API_URL}/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    if (genre) url += `&with_genres=${genre}`; // Add genre filter
    if (year) url += `&year=${year}`; // Add year filter

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data from the API');
            }
            return response.json();
        })
        .then(data => {
            displayResults(data.results, type); // Display the search results
        })
        .catch(error => {
            console.error('Error:', error);
            movieResults.innerHTML = '<p>Sorry, something went wrong. Please try again later.</p>';
        });
}

// Function to Display Results
function displayResults(results, type) {
    movieResults.innerHTML = ''; // Clear previous results

    if (!results || results.length === 0) {
        movieResults.innerHTML = '<p>No results found. Try a different search term.</p>';
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('movie-card');

        // Movie Poster
        const image = document.createElement('img');
        image.src = item.poster_path 
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image';
        image.alt = `${item.title || item.name} Poster`;

        // Movie Title
        const title = document.createElement('h3');
        title.textContent = item.title || item.name;

        // Movie Description (Overview)
        const description = document.createElement('p');
        description.textContent = item.overview || 'No description available.';
        description.classList.add('movie-description');

        // Watch Trailer Button
        const trailerBtn = document.createElement('a');
        trailerBtn.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title || item.name + ' trailer')}`;
        trailerBtn.target = '_blank';
        trailerBtn.classList.add('watch-trailer-btn');
        trailerBtn.textContent = 'Watch Trailer';

        // Append elements to card
        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(trailerBtn);

        // Append card to results grid
        movieResults.appendChild(card);
    });
}

// Fetch genres from TMDb API
function fetchGenres(type) {
    const genreUrl = `https://api.themoviedb.org/3/genre/${type}/list?api_key=${API_KEY}`;

    fetch(genreUrl)
        .then(response => response.json())
        .then(data => {
            const genreDropdown = document.getElementById('genre');
            genreDropdown.innerHTML = '<option value="">All Genres</option>'; // Reset dropdown
            data.genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching genres:', error);
        });
}

// Call fetchGenres when the page loads or when the search type changes
document.getElementById('search-type').addEventListener('change', (e) => {
    fetchGenres(e.target.value); // Fetch genres based on the selected type (movie or TV)
});

// Fetch genres for movies by default when the page loads
fetchGenres('movie');