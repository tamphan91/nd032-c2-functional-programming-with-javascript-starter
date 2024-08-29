let store = Immutable.Map({
  selectedRover: null,
  photos: [],
  isFetching: true,
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
  const rovers = state.get("rovers");
  const selectedRover = state.get("selectedRover");
  const photos = state.get("photos");
  const isFetching = state.get("isFetching");
  return `
        <div class="bg-white py-24 sm:py-32">
            <div class="mx-auto grid max-w-7xl gap-x-8 gap-y-10 px-6 lg:px-8">
                <div class="col-span-2 grid gap-y-10">
                    <p class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Mars Dashboard</p>
                    <p class="text-1xl font-bold tracking-tight text-gray-500 sm:text-2xl">${
                      selectedRover ? "Images" : "Rover List"
                    }</p>
                </div>
                ${isFetching ? "Loading..." : ""}
                ${
                  rovers.length > 0 && !selectedRover
                    ? renderListHtml(rovers, renderRoverHtml)
                    : ""
                }
                ${selectedRover && !isFetching > 0 ? renderPhotosHtml(photos) : ""}
            </div>
        </div>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
  getRovers((data) => {
    updateStore(
      store.set("isFetching", false).set("rovers", data.images.rovers)
    );
  });
});

const renderListHtml = (list, callback) => {
  return `<ul role="list" class="grid gap-x-8 gap-y-8 md:grid-cols-2 md:gap-y-10 md:col-span-2 col-span-2">
            ${list.map((element) => callback(element)).join("")}
        </ul>`;
};

const renderRoverHtml = (rover) => {
  const { name, launch_date, landing_date, status } = rover;
  return `<li>
            <figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
                <div class="pt-6 md:p-8 text-left space-y-4">
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
                        <button onclick="handleShowImages('${name}')" class="bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-lg p-2 mt-4">Images</button>
                    </figcaption>
                </div>
            </figure>
        </li>`;
};

const renderPhotosHtml = (photos) => {

  return `
        <div class"flex flex-col">
          <button onclick="handleBackToRover()" class="bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-lg p-2 m-4">Back to rover list</button>
          ${renderListHtml(photos, renderPhotoHtml)}
          ${photos.length === 0 ? 'No photo found!' : ''}
        </div>
    `;
};

const renderPhotoHtml = (photo) => {
  const {
    img_src,
    camera: { full_name, name: cameraName },
    earth_date,
    rover: { name },
  } = photo;
  return `<li>
            <figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
              <img class="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src="${img_src}" alt="" width="384" height="512">
              <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
                <blockquote>
                  <p class="text-lg font-medium">
                    “This photo was taken by ${full_name} on the ${name} rover on ${earth_date}.”
                  </p>
                </blockquote>
                <figcaption class="font-medium">
                  <div class="text-sky-500 dark:text-sky-400">
                    Rover: ${name}
                  </div>
                  <div class="text-slate-700 dark:text-slate-500">
                    ${full_name} (${cameraName})
                  </div>
                </figcaption>
              </div>
            </figure>
        </li>`;
};

const handleShowImages = (roverName) => {
  updateStore(store.set("isFetching", true).set("selectedRover", roverName));
  getRoverByName(roverName, (data) => {
    updateStore(
      store.set("isFetching", false).set("photos", data.images.photos)
    );
  });
};

const handleBackToRover = () => {
  updateStore(store.set("photos", []).set("selectedRover", null));
};

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
