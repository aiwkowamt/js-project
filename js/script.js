// const API_KEY = 'cfd66ca8db9e2d2b90f87d107e5f8b82';
const URL_TOP_MOVIES = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';

getTopMovies(URL_TOP_MOVIES);

updateModalContent();

async function getTopMovies(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZmQ2NmNhOGRiOWUyZDJiOTBmODdkMTA3ZTVmOGI4MiIsInN1YiI6IjY1MGJmYWFhNDRlYTU0MDEwMDExYTAzMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2vJkbCFMo2AoDpc6kNESjzzYcGsrIlqt_v6c9f6kirc',
            }
        });
        const data = await response.json();
        showMovies(data);
    } catch (err) {
        console.error(err);
    }
}

function showMovies(data) {
    document.querySelector('.movies').innerHTML = '';

    const moviesElements = document.querySelector('.movies');
    data.results.forEach(movieObject => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <div class ='wrapperImage'>
                 <img alt = '' src ='${'https://image.tmdb.org/t/p/original' + movieObject.poster_path}' class = 'movieImage'>
            </div>
            <div class = 'movieTitle'>${movieObject.title}</div>
            <div class = 'movieRating'>${'Рейтинг ' + movieObject.vote_average}</div>
            <form class = 'movieForm'>
                <span class ='addFavourite' id = '${movieObject.title}' onclick='addFavourite(this.id)'>В избранное</span>
                <span class = 'addLater'>Смотреть позже</span>
            </form>
            `;
        moviesElements.appendChild(movieElement);
    });
}

function addFavourite(title) {
    let favorites = [];
    const favoritesJSON = localStorage.getItem('favorites');
    if (favoritesJSON) {
        favorites = JSON.parse(favoritesJSON);
    }

    let isAlreadyFavorite = false;
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].title === title) {
            isAlreadyFavorite = true;
        }
    }

    if (!isAlreadyFavorite) {
        favorites.push({title});
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateModalContent();
    }
}

function showModalWindow () {
    const modalWindow = document.querySelector('.modalWindow');
    const showModalWindowButton = document.querySelector('.headerFavouriteMovies');
    showModalWindowButton.addEventListener('click', () => {
        modalWindow.style.display = 'block';
    })
}

function closeModalWindow () {
    const modalWindow = document.querySelector('.modalWindow');
    const closeModalWindowButton = document.querySelector('.closeModalWindow');
    closeModalWindowButton.addEventListener('click', () => {
        modalWindow.style.display = 'none';
    })
}

const modalWindow = document.querySelector('.modalWindow')
window.onclick = function(event) {
    if (event.target == modalWindow) {
        modalWindow.style.display = 'none';
    }
}

function updateModalContent() {
    let favorites = [];
    const favoritesJSON = localStorage.getItem('favorites');
    if (favoritesJSON) {
        favorites = JSON.parse(favoritesJSON);
    }

    const modalContent = document.querySelector('.modalContent');
    modalContent.innerHTML = '';
    favorites.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.innerHTML = `
        <div class = 'modelMovie'>
            <span class = 'deleteFavouriteMovie' id = '${movie.title}' onclick ='deleteFavouriteMovie(this.id)'>X</span>${movie.title}
        </div>`;
        modalContent.appendChild(movieElement);
    });
}

function deleteFavouriteMovie(title) {
    const favoritesJSON = localStorage.getItem('favorites');
    const favorites = JSON.parse(favoritesJSON);

    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].title === title) {
            favorites.splice(i, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateModalContent();
            break;
        }
    }

    if(favorites.length===0){
        const modalWindow = document.querySelector('.modalWindow');
        modalWindow.style.display = 'none';
    }
}

function saveToCookie() {
    const inputValue = document.getElementById('inputWithName').value;

    document.cookie = `savedValue=${inputValue}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;

    updateWelcomeMessage(inputValue);
}

function updateWelcomeMessage(value) {
    const inputWithName = document.getElementById('inputWithName');
    const greetings = document.getElementById('greetings');
    const saveToCookieButton = document.getElementById('saveToCookieButton');
    const spanWithQuestion = document.getElementById('spanWithQuestion');

    inputWithName.style.display = 'none';
    saveToCookieButton.style.display = 'none';
    spanWithQuestion.style.display = 'none';
    greetings.textContent = `Добро пожаловать, ${value}`;
}

function loadFromCookie() {
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'savedValue') {
            updateWelcomeMessage(value);
            break;
        }
    }
}

window.onload = loadFromCookie;

const form = document.querySelector('.headerForm');
const search = document.querySelector('.headerSearch');
const API_URL_SEARCH1 = 'https://api.themoviedb.org/3/search/movie?query=';
const API_URL_SEARCH2 = '&include_adult=false&language=en-US&page=1';

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH1}${search.value}${API_URL_SEARCH2}`;
    if(search.value){
        getTopMovies(apiSearchUrl);
    }
})