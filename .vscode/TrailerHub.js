const API_KEY = '9a32d813a1fe401688bcfa15ce43c963';
const API_URL = 'https://api.themoviedb.org/3/search';

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
    const url = `${API_URL}/${type}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

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

    if (results.length === 0) {
        movieResults.innerHTML = '<p>No results found. Try a different search term.</p>';
        return;
    }

    results.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('movie-card');

        const image = document.createElement('img');
        image.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`; // Movie poster URL
        image.alt = `${item.title || item.name} Poster`;

        const info = document.createElement('div');
        info.classList.add('movie-info');

        const title = document.createElement('h3');
        title.textContent = item.title || item.name;

        const overview = document.createElement('p');
        overview.textContent = item.overview || 'No description available.';

        const trailerBtn = document.createElement('a');
        trailerBtn.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(item.title || item.name)}`;
        trailerBtn.target = '_blank';
        trailerBtn.classList.add('watch-trailer-btn');
        trailerBtn.textContent = 'Watch Trailer';

        info.appendChild(title);
        info.appendChild(overview);
        card.appendChild(image);
        card.appendChild(info);
        card.appendChild(trailerBtn); // Append the trailer button

        movieResults.appendChild(card); // Append the card to the results grid
    });
}
