const pokedex = document.getElementById("pokedex");
const radar = document.getElementById("radar-chart");
pokemon_global = null;

function filterList(array, filterInputValue) {
  var filtered = [];
  for (var i = 0; i < array.length; i++) {
    var pokemon = array[i];
    if (pokemon.name.toLowerCase().includes(filterInputValue.toLowerCase())) {
      filtered.push(pokemon);
    }
  }
  return filtered;
}

const fetchPokemon = () => {
  const promises = [];

  for (let i = 1; i <= 1008; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }

  Promise.all(promises).then((results) => {
    const pokemon = results.map((data) => ({
      name: data.name,
      id: data.id,
      image: data.sprites["front_default"],
      type: data.types.map((type) => type.type.name).join(", "),
      stats: [
        data.stats[0].base_stat,
        data.stats[1].base_stat,
        data.stats[2].base_stat,
        data.stats[3].base_stat,
        data.stats[4].base_stat,
        data.stats[5].base_stat,
      ],
    }));

    pokemon_global = pokemon;
  });
};

async function mainEvent() {
  const mainForm = document.querySelector(".main_form");
  const loadDataButton = document.querySelector("#data_load");
  const search = document.querySelector("#data_filter");
  const textField = document.querySelector("#pokeName");
  console.log(textField);

  fetchPokemon();

  loadDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something
    console.log("loading Pokemon");
    displayPokemon(pokemon_global);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newPokeList = filterList(pokemon_global, event.target.value);
    console.log("loading new List");
    displayPokemon(newPokeList);
  });
}

function loadRadarChart(pokemon) {
  //1.
  let statsChart = document.getElementById("radar-chart");
  //2.
  statsChart = new Chart(statsChart, {
    type: "radar",
    data: {
      // Will show up on each radar points in clockwise order
      labels: ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"],
      datasets: [
        {
          //one data obj per set, order same as labels
          data: [
            pokemon.stats[0],
            pokemon.stats[1],
            pokemon.stats[2],
            pokemon.stats[3],
            pokemon.stats[4],
            pokemon.stats[5],
          ],
          backgroundColor: "rgba(197,48,48,0.5)", // red
        },
        /*Add another set if needed like so
        {
           data: [ ]
        },
        */
      ],
    },
  })
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
  const pokemonHTMLString = pokemon
    .map(
      (pokeman) =>
        `
    <li class="card" data-aos="fade-up" data-aos-duration="10">
        <img class="card-image" src="${pokeman.image}" />
        <h2>${pokeman.id}. ${pokeman.name}</h2>
        <p> Type: ${pokeman.type}</p>
    </li>
        `
    )
    .join("");
  pokedex.innerHTML = pokemonHTMLString;
};

document.addEventListener("DOMContentLoaded", async () => mainEvent());

