const locationContainer = document.querySelector('.location-container') // Variavel da nossa caixa do conteudo
const searchInput = document.getElementById('search') // Variavel do nosso input de Busca
const typeFilter = document.getElementById('type') // Variavel do meu select de Tipo
const dimensionFilter = document.getElementById('dimension') // Variavel do meu select de Dimensão
const btnCarregarMais = document.getElementById('load-more') // Variavel do Botão de carregar mais

const API = 'https://rickandmortyapi.com/api'

// Filtrando os array em uma variavel
const defaultFilters = {
    name: '',
    type: '',
    dimension: '',
    page: 1
}   

// Pegando as localizações
async function getLocations({ name, type, dimension, page = 1 }) {
    // Pegar os dados das localizações
    const response = await fetch(`${API}/location?name=${name}&type=${type}&dimension=${dimension}&page=${page}`)

    const locations = await response.json()
    console.log(locations.results)
    return locations.results
}

// Renderizando no nosso HTML
async function render({ locations }) {
    locations.forEach((location) => {

        return locationContainer.innerHTML += `
        <div class="location">
            <img src="../../assets/Planet.png" alt="">
                <div class="location-info">
                    <h3>${location.name}</h3>
                    <span>${location.type}</span>
                </div>
        </div>
        `
    })
}

// Função pra proibir de não repetir os itens e rederizar na tela
function handFilterChange(type, event) {
    return async () => {
        defaultFilters[type] = event.target.value

        // Nesse primeiro IF vou colocar pra não repetir as localizações
        if (locationContainer.firstChild === null) {

            const locations = await getLocations(defaultFilters)
            render({ locations })

        } else {

            locationContainer.innerHTML = '' // Aqui resetamos o Conteudo

            // E aqui Renderizamos com a opção escolhida.
            const locations = await getLocations(defaultFilters)
            render({ locations })
        }
    }
}

// Configuração de renderizar mais páginas ao clicar no botão
async function handCarregarMais() {
    defaultFilters.page += 1
    const locations = await getLocations(defaultFilters)
    render({ locations })
}

// Essa função resume a seleção dos nossos filtros
function addListeners() {
    // Filtrando a opção desejada do nosso Input de Busca
    searchInput.addEventListener('keyup', async (event) => {
        handFilterChange('name', event)()
    })

    // Filtrando a seleção de  Especies
    typeFilter.addEventListener('change', async (event) => {
        handFilterChange('type', event)()
    })

    // Filtrando a seleção de  Genero
    dimensionFilter.addEventListener('change', async (event) => {
        handFilterChange('dimension', event)()
    })

    btnCarregarMais.addEventListener('click', handCarregarMais)
}

async function main() {
    const locations = await getLocations(defaultFilters)
    addListeners()
    render({ locations })
}

main()