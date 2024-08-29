let store = Immutable.Map({
  selectedRover: null,
  rovers: [],
});

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (newState) => {
  store = store.merge(store, newState);
  render(root, store);
};

const render = async (rootElement, state) => {
  rootElement.innerHTML = App(state);
};

// create content
const App = (state) => {
  let rovers = state.get("rovers");
  let selectedRover = state.get("selectedRover");
  console.log("rovers", rovers);
  console.log("selectedRover", selectedRover);
  return `
        <div class="bg-white py-24 sm:py-32">
            <div class="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-2">
                <div class="max-w-2xl">
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Mars Dashboard</h2>
                </div>
                ${rovers.length > 0 ? renderRoversHtml(rovers) : 'Loading...'}
            </div>
        </div>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", async () => {
  render(root, store);
  await getRovers((data) => {
    updateStore(store.set("rovers", data.images.rovers));
  });
});

const renderRoversHtml = (rovers) => {

    return `<ul role="list" class="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
            ${rovers.map(rover => renderReverHtml(rover)).join("")}
        </ul>`
}

const renderReverHtml = (rover) => {
    const {name, launch_date, landing_date, status} = rover;
    return `<li>
            <figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
                <button>
                <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
                    <figcaption class="font-medium">
                        <div class="text-sky-500 dark:text-sky-400">
                            Name: ${name}
                        </div>
                        <div class="text-slate-700 dark:text-slate-500">
                            Launch date: ${launch_date}
                        </div>
                         <div class="text-slate-700 dark:text-slate-500">
                            Landing date: ${landing_date}
                        </div>
                         <div class="text-slate-700 dark:text-slate-500">
                            Status: ${status}
                        </div>
                    </figcaption>
                </div>
            </figure>
        </li>`
}

// const renderReverHtml = (rover) => {
//     const {name, launch_date, landing_date, status} = rover;
//     return `<li>
//             <div class="flex items-center gap-x-6">
//                 <div>
//                     <h3 class="text-base font-semibold leading-7 tracking-tight text-gray-900">Name: ${name}</h3>
//                     <p class="text-sm font-semibold leading-6 text-indigo-600">Launch date: ${launch_date}</p>
//                     <p class="text-sm font-semibold leading-6 text-indigo-600">Landing date: ${landing_date}</p>
//                     <p class="text-sm font-semibold leading-6 text-indigo-600">Status: ${status}</p>
//                 </div>
//             </div>
//         </li>`
// }

const getRovers = (callback) => {
  fetch("http://localhost:3000/rovers")
    .then((res) => res.json())
    .then((json) => callback(json));
};

const getRoverByName = (roverName, callback) => {
  fetch(`http://localhost:3000/rovers/${roverName}`)
    .then((res) => res.json())
    .then((json) => callback(json));
};
