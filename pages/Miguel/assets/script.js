document.addEventListener('DOMContentLoaded', function() {
    const charactersContainer = document.getElementById('characters-container');
    const loadingElement = document.getElementById('loading');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    let currentPage = 1;
    let totalPages = 0;
    let currentSearchTerm = '';

    // Função para buscar personagens
    async function fetchCharacters(page = 1, name = '') {
        loadingElement.style.display = 'block';
        charactersContainer.innerHTML = '';

        try {
            const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}&name=${name}`);
            if (!response.ok) {
                throw new Error('Personagens não encontrados');
            }
            const data = await response.json();

            displayCharacters(data.results);
            updatePagination(data.info);

            loadingElement.style.display = 'none';
        } catch (error) {
            loadingElement.textContent = error.message;
            charactersContainer.innerHTML = '';
            prevButton.disabled = true;
            nextButton.disabled = true;
        }
    }

    // Função para exibir os personagens
    function displayCharacters(characters) {
        charactersContainer.innerHTML = '';

        if (characters.length === 0) {
            charactersContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Nenhum personagem encontrado</p>';
            return;
        }

        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.className = 'character-card';

            // Determinar a classe do status para a cor
            let statusClass = '';
            if (character.status === 'Alive') {
                statusClass = 'status-alive';
            } else if (character.status === 'Dead') {
                statusClass = 'status-dead';
            } else {
                statusClass = 'status-unknown';
            }

            characterCard.innerHTML = `
                <img src="${character.image}" alt="${character.name}" class="character-image">
                <div class="character-info">
                    <h2 class="character-name">${character.name}</h2>
                    <p class="character-species">Espécie: ${character.species}</p>
                    <p class="character-status ${statusClass}">Status: ${character.status}</p>
                    <p class="character-gender">Gênero: ${character.gender}</p>
                    <p class="character-origin">Origem: ${character.origin.name}</p>
                </div>
            `;

            charactersContainer.appendChild(characterCard);
        });
    }

    // Função para atualizar a paginação
    function updatePagination(info) {
        totalPages = info.pages;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages || !info.next;
    }

    // Event listeners para os botões de paginação
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchCharacters(currentPage, currentSearchTerm);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchCharacters(currentPage, currentSearchTerm);
        }
    });

    // Event listener para a busca
    searchButton.addEventListener('click', () => {
        currentSearchTerm = searchInput.value.trim();
        currentPage = 1;
        fetchCharacters(currentPage, currentSearchTerm);
    });

    // Permitir busca ao pressionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentSearchTerm = searchInput.value.trim();
            currentPage = 1;
            fetchCharacters(currentPage, currentSearchTerm);
        }
    });

    // Carregar os primeiros personagens ao iniciar
    fetchCharacters();
});