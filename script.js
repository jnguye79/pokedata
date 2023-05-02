const pokedex = document.getElementById("pokedex");
const radar = document.getElementById('radar-chart');
pokemon_global = null;

function filterList(array, filterInputValue) {
    return array.filter((item) => {
        const lowerCaseName = item.name.toLowerCase();
        const lowerCaseQuery = filterInputValue.toLowerCase();
        return lowerCaseName.includes(lowerCaseQuery);
    });
}

function injectHTML(list) {
    console.log("fired injectHTML");
    const target = document.querySelector("#restaurant_list");
    target.innerHTML = "";
    list.forEach((item) => {
      const str = `<li>${item.name}</li>`;
      target.innerHTML += str;
    });
  }

function RADAR(pokemon) {
    new Chart(radar, {
        type: 'radar',
        data: {
          labels: ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Speed'],
          datasets: [{
            data: pokemon.stats,
            backgroundColor: ['lightgrey'],
            pointBackgroundColor: ['yellow', 'aqua', 'pink', 'lightgreen', 'lightblue', 'gold'],
            borderColor: ['black'],
            borderWidth: 1,
            pointRadius: 6,
          }]
        },
        options: {
            responsive: false,
            elements: {
               line: {
                  borderWidth: 3
               }
            }
        }
    });
}

const fetchPokemon = () => {

    const promises = [];

    for (let i = 1; i <= 9; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    
    Promise.all(promises).then( results => {
        const pokemon = results.map((data) => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types.map((type) => type.type.name).join(', '),
            stats: [data.stats[0].base_stat, data.stats[1].base_stat, data.stats[2].base_stat, data.stats[3].base_stat, data.stats[4].base_stat, data.stats[5].base_stat] 
        }));
        
        pokemon_global = pokemon;
    });
};

async function mainEvent() {
    const mainForm = document.querySelector('.main_form');
    const loadDataButton = document.querySelector('#data_load');
    const search = document.querySelector('#data_filter');
    const textField = document.querySelector('#filter');
    console.log(textField);

    fetchPokemon();
    
    loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something    
        console.log('loading Pokemon'); 
        displayPokemon(pokemon_global);
    });

    textField.addEventListener("input", (event) => {
        console.log("input", event.target.value);
        const newPokeList = filterList(pokemon, event.target.value);
        console.log(newPokeList);
        injectHTML(newPokeList);
        displayPokemon(newPokeList);
    });
}

/* const displayOnePokemon = (name) => {
    console.log(name);
    position = 0;
    for (let i = 0; i < pokemon_global.length; i++) {
        console.log(name, ' ', pokemon_global[i].name)
        if(name == pokemon_global[i].name){
            position = i;
            break;
        } else{
            console.log('false');
        }
      }
     
} */

const displayPokemon = (pokemon) => {
    console.log(pokemon);
    const pokemonHTMLString = pokemon.map ( pokeman =>
        `
    <li class="card">
        <img class="card-image" src="${pokeman.image}" />
        <h2>${pokeman.id}. ${pokeman.name}</h2>
        <p> Type: ${pokeman.type}</p>
    </li>
        `
    ).join('');
    pokedex.innerHTML = pokemonHTMLString;
}

document.addEventListener('DOMContentLoaded', async () => mainEvent());
