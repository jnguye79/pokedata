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

function filterTypeList(array, filterInputValue) {
  var filtered = [];
  for (var i = 0; i < array.length; i++) {
    var pokemon = array[i];
    if (pokemon.type.toLowerCase().includes(filterInputValue.toLowerCase())) {
      filtered.push(pokemon);
    }
  }
  return filtered;
}

function filterAbilityList(array, filterInputValue) {
  var filtered = [];
  for (var i = 0; i < array.length; i++) {
    var pokemon = array[i];
    if (pokemon.abilities.includes(filterInputValue)) {
      filtered.push(pokemon);
    }
  }
  return filtered;
}

function filterHeightList(array, filterInputValue) {
  var filtered = [];
  for (var i = 0; i < array.length; i++) {
    var pokemon = array[i];
    if (pokemon.height >= filterInputValue) {
      filtered.push(pokemon);
    }
  }
  return filtered;
}

function filterWeightList(array, filterInputValue) {
  var filtered = [];
  for (var i = 0; i < array.length; i++) {
    var pokemon = array[i];
    if (pokemon.weight >= filterInputValue) {
      filtered.push(pokemon);
    }
  }
  return filtered;
}

function filterMoveList(array, filterInputValue) {
  var filtered = [];
  for (var i = 0; i < array.length; i++) {
    var pokemon = array[i];
    if (pokemon.moves.includes(filterInputValue)) {
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
      moves: data.moves.map((move => move.move.name)),
      abilities: data.abilities.map((ability) => ability.ability.name),
      height: data.height,
      weight: data.weight,
    }));

    pokemon_global = pokemon;
  });
};

async function mainEvent() {
  const mainForm = document.querySelector(".main_form");
  const loadDataButton = document.querySelector("#data_load");
  const CleanDataButton = document.querySelector("#data_clean");
  const search = document.querySelector("#data_filter");
  const textField = document.querySelector("#pokeName");
  const typeField = document.querySelector("#pokeType");
  const abilityField = document.querySelector("#abType");
  const heightField = document.querySelector("#height");
  const weightField = document.querySelector("#weight");
  const moveField = document.querySelector("#moveType");

  console.log(textField);

  fetchPokemon();

  const storedData = localStorage.getItem("storedData");
  loadDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something
    console.log("loading Pokemon");
    localStorage.setItem("storedData", pokemon_global);
    displayPokemon(pokemon_global);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newPokeList = filterList(pokemon_global, event.target.value);
    console.log("loading new List");
    displayPokemon(newPokeList);
  });

  typeField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newPokeList = filterTypeList(pokemon_global, event.target.value);
    console.log("loading new List");
    displayPokemon(newPokeList);
  });

  abilityField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newPokeList = filterAbilityList(pokemon_global, event.target.value);
    console.log("loading new List");
    displayPokemon(newPokeList);
  });

  heightField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newPokeList = filterHeightList(pokemon_global, event.target.value);
    console.log("loading new List");
    displayPokemon(newPokeList);
  });

  weightField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newPokeList = filterWeightList(pokemon_global, event.target.value);
    console.log("loading new List");
    displayPokemon(newPokeList);
  });

  moveField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newPokeList = filterMoveList(pokemon_global, event.target.value);
    console.log("loading new List");
    displayPokemon(newPokeList);
  });

  CleanDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something
    console.log("pre clean storage check", localStorage.getItem("storedData"));
    localStorage.clear();
    console.log("post clean storage check", localStorage.getItem("storedData"));
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
            pokemon.stats[0].base_stat,
            pokemon.stats[1].base_stat,
            pokemon.stats[2].base_stat,
            pokemon.stats[3].base_stat,
            pokemon.stats[4].base_stat,
            pokemon.stats[5].base_stat,
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
