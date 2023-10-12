import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39984846-5bc4e2c56e6d5349f3486ddeb';
let q = '';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';
let page;
let per_page = 40;

export function getData(q) {
  const params = new URLSearchParams({
    q: q,
    image_type: IMAGE_TYPE,
    orientation: ORIENTATION,
    safesearch: SAFESEARCH,
    page: page,
    per_page: per_page,
  });
  const url = BASE_URL + '?key=' + API_KEY + '&' + params;
  return axios({
    method: 'get',
    url: url,
  }).then(resp => {
    if (resp.status !== 200) {
      throw new Error(`Fetch errorr with ${resp.status}: ${resp.statusText}`);
    }
    if (!resp.data.total) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    return resp.data;
  });
}
