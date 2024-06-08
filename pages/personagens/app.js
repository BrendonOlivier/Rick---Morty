const charsContainer = document.querySelector('.chars-container') // Variavel da nossa caixa do conteudo
const searchInput = document.getElementById('search') // Variavel do nosso input de Busca
const especiesFilter = document.getElementById('species') // Variavel do meu selecet de Especies
const generoFilter = document.getElementById('gender') // Variavel do meu selecet de Genero
const statusFilter = document.getElementById('status') // Variavel do meu selecet de Status
const btnCarregarMais = document.getElementById('load-more') // Variavel do Botão de carregar mais

const API = 'https://rickandmortyapi.com/api'

// Filtrando os array em uma variavel
const defaultFilters = {
    name: '',
    species: '',
    gender: '',
    status: '',
    page: 1
}

// Pegando os personagens
async function getCharacters({ name, species, gender, status, page = 1 }) {
    // Pegar os dados do personagem
    const response = await fetch(`${API}/character?name=${name}&species=${species}&gender=${gender}
    &status=${status}&page=${page}`)

    const characters = await response.json()

    return characters.results
}

// Renderizando no nosso HTML
async function render({ characters }) {
    characters.forEach((character) => {

        return charsContainer.innerHTML += `
        <div class="char">
            <img src="${character.image}" alt="">
                <div class="char-info">
                    <h3>${character.name}</h3>
                    <span>${character.species}</span>
                </div>
        </div>
        `
    })
}

function handFilterChange(type, event) {
    return async () => {
        defaultFilters[type] = event.target.value

        // Nesse primeiro IF vou colocar pra não repetir os personagens
        if (charsContainer.firstChild === null) {
            const characters = await getCharacters(defaultFilters)
            render({ characters })
        } else {
            charsContainer.innerHTML = '' // Aqui resetamos o Conteudo

            // E aqui Renderizamos com a opção escolhida.
            const characters = await getCharacters(defaultFilters)
            render({ characters })
        }
    }
}

// Configuração de renderizar mais páginas ao clicar no botão
async function handCarregarMais() {
    defaultFilters.page += 1
    const characters = await getCharacters(defaultFilters)
    render({ characters })
}

// Essa função resume a seleção dos nossos filtros
function addListeners() {
    // Filtrando a opção desejada do nosso Input de Busca
    searchInput.addEventListener('keyup', async (event) => {
        handFilterChange('name', event)()
    })

    // Filtrando a seleção de  Especies
    especiesFilter.addEventListener('change', async (event) => {
        handFilterChange('species', event)()
    })

    // Filtrando a seleção de  Genero
    generoFilter.addEventListener('change', async (event) => {
        handFilterChange('gender', event)()
    })

    // Filtrando a seleção de  Status
    statusFilter.addEventListener('change', async (event) => {
        handFilterChange('status', event)()
    })

    btnCarregarMais.addEventListener('click', handCarregarMais)
}

// Função de mostrar os personagens com seus nomes filtrados
async function main() {
    const characters = await getCharacters(defaultFilters)
    addListeners()
    render({ characters })
}

main()