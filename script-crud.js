let allMovies = []; // Declarar `allMovies` fora de `DOMContentLoaded`


document.addEventListener("DOMContentLoaded", () => {
    const inputBusca = document.querySelector('.input__pesquisa');
    const API_KEY = '6272efaeb4ea9438a54f35f1827c85d2';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const movieContainer = document.getElementById('movies-list');

    // Recupera filmes do localStorage ou inicializa vazio
    allMovies = JSON.parse(localStorage.getItem('movies')) || [];  // Aqui sempre vai buscar no localStorage

    // Inicializa os filmes populares (será chamado aqui)
    getPopularMovies();

    async function getPopularMovies() {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
        const data = await response.json();

        const newMovies = data.results.map(movie => ({
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            title: movie.title,
            rating: movie.vote_average,
            year: movie.release_date.split('-')[0],
            description: movie.overview || 'Sem descrição disponível.',
            isFavorited: false,
        }));

        // Atualiza allMovies com os novos filmes, preservando os favoritos
        allMovies = newMovies.map(newMovie => {
            const savedMovie = allMovies.find(m => m.title === newMovie.title);
            return savedMovie ? savedMovie : newMovie;
        });

        // Atualiza o localStorage
        localStorage.setItem('movies', JSON.stringify(allMovies));

        // Exibe os filmes na tela
        addMovie(allMovies);
    }

    function addMovie(filmes) {
        movieContainer.innerHTML = ''; // Limpa os filmes anteriores

        filmes.forEach(filme => {
            const divCard = document.createElement('div');
            divCard.classList.add('cards');

            const imgPost = document.createElement('img');
            imgPost.classList.add('cards__poster');
            imgPost.setAttribute('src', filme.image);

            const divInfo = document.createElement('div');
            divInfo.classList.add('cards__info');

            const tituloFilme = document.createElement('h2');
            tituloFilme.textContent = filme.title;

            const divAvaliar = document.createElement('div');
            divAvaliar.classList.add('cards__info__avaliar');

            const divAvaliacao = document.createElement('div');
            divAvaliacao.classList.add('cards__avaliacao');

            const imgStar = document.createElement('img');
            imgStar.setAttribute('src', './img/Star.png');

            let rankAval = document.createElement('p');
            rankAval.textContent = filme.rating;

            const divFavoritar = document.createElement('div');
            divFavoritar.classList.add('card__favoritar');

            const btHeart = document.createElement('button');
            btHeart.classList.add('card__favoritar__button');

            const imgHeart = document.createElement('img');
            imgHeart.setAttribute('src', filme.isFavorited ? './img/Vector.svg' : './img/Heart.svg');

            btHeart.addEventListener('click', () => {
                filme.isFavorited = !filme.isFavorited; // Altera o estado de favoritado
                imgHeart.setAttribute('src', filme.isFavorited ? './img/Vector.svg' : './img/Heart.svg');
                localStorage.setItem('movies', JSON.stringify(allMovies));  // Atualiza o localStorage
            });

            const favoritar = document.createElement('p');
            favoritar.textContent = 'Favoritar';

            const descricao = document.createElement('p');
            descricao.classList.add('descricao');
            descricao.textContent = filme.description;

            // Monta a estrutura do card
            divCard.appendChild(imgPost);
            divCard.appendChild(divInfo);
            divInfo.appendChild(tituloFilme);
            divInfo.appendChild(divAvaliar);
            divAvaliar.appendChild(divAvaliacao);
            divAvaliacao.appendChild(imgStar);
            divAvaliacao.appendChild(rankAval);
            divAvaliar.appendChild(divFavoritar);
            divFavoritar.appendChild(btHeart);
            btHeart.appendChild(imgHeart);
            divFavoritar.appendChild(favoritar);
            divCard.appendChild(descricao);

            // Adiciona o card ao container
            movieContainer.appendChild(divCard);
        });
    }

    function filterMovie() {
        const searchTerm = inputBusca.value.trim().toLowerCase();

        if (searchTerm === '') {
            addMovie(allMovies); // Se estiver vazio, mostra todos os filmes
            return;
        }

        const filteredMovies = allMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm)
        );

        addMovie(filteredMovies);
    }

    inputBusca.addEventListener('input', filterMovie);

    // Exibir apenas filmes favoritados
    function exibirFavoritos() {
        const favoritos = allMovies.filter(movie => movie.isFavorited);
        addMovie(favoritos);
    }

    // Captura o checkbox e escuta as mudanças
    const btCheck = document.querySelector('.input__checkbox');

    btCheck.addEventListener('change', () => {
        if (btCheck.checked) {
            exibirFavoritos();  // Exibe os favoritos
        } else {
            addMovie(allMovies);  // Exibe todos os filmes
        }
    });
});
