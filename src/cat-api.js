import axios from 'axios';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

const BASE_URL = "https://api.thecatapi.com/v1/";

const API_KEY =
  "live_byDUUQmQekkLRlI0L9gIRy8RBj14h6KEagneJBWPmRPtldgkqC5Hwb1BsoZTJwhN";

export function getBreeds() {
  const url = BASE_URL + "breeds";
  return axios({
    method: "get",
    url: url,
    api_key: API_KEY,
  }).then((resp) => {
    if (resp.status !== 200) {
      loader.style.display = "none";
      error.style.display = "block";
      Notiflix.Notify.failure(
        "Oops! Something went wrong! Try reloading the page!"
      );
      throw new Error(`Fetch errorr with ${resp.status}: ${resp.statusText}`);
    }
    return resp.data;
  });
}

export function getCatsByBreed(id) {
  const url = BASE_URL + 'images/' + id
  return axios({
    method: "get",
    url: url,
    api_key: API_KEY,
  }).then((resp) => {
    if (resp.status !== 200) {
      loader.style.display = "none";
      error.style.display = "block";
      Notiflix.Notify.failure(
        "Oops! Something went wrong! Try reloading the page!"
      );
      throw new Error(`Fetch errorr with ${resp.status}: ${resp.statusText}`);
    }

    return resp.data;
  });
}
