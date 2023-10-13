import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '?key=39984846-5bc4e2c56e6d5349f3486ddeb';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';
axios.defaults.baseURL = BASE_URL;

export const getData = async (q, page, per_page) => {
  const params = new URLSearchParams({
    q,
    image_type: IMAGE_TYPE,
    orientation: ORIENTATION,
    safesearch: SAFESEARCH,
    page,
    per_page,
  });
  const url = API_KEY + '&' + params;
  const req = await axios({
    method: 'get',
    url: url,
  });

  return req.data;
};
