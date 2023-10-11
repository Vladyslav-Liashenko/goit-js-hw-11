import axios from 'axios';
import Notiflix from 'notiflix';

// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:
// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.

const searchInput = document.querySelector('.searchQuery');
const serachBtn = document.querySelector('.searchBtn');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = 'l39984846-5bc4e2c56e6d5349f3486ddeb';
const Q = '';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';

// Запуск отрисовки по клику поиск
serachBtn.addEventListener('click', function () {
  event.preventDefault();
  const Q = searchInput.value;

  getDate(Q)
    .then(data => {
      console.log(date);
      // body.innerHTML = '';
      info.insertAdjacentHTML('beforeend', createMarkup(data));
    })
    .catch(err => console.log(err));
});

// ЗАПРОС АПИ

//pixabay.com/api/?key=39984846-5bc4e2c56e6d5349f3486ddeb&q=yellow+flowers&image_type=photo

export function getDate(Q) {
  const url =
    BASE_URL + '?key=' + API_KEY;
    // + '&q=' + Q + '&image_type=' + IMAGE_TYPE + '&orientation=' + ORIENTATION + '&safesearch=' + SAFESEARCH;
  return axios({
    method: 'get',
    url: url,
  }).then(resp => {
    if (resp.status !== 200) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      throw new Error(`Fetch errorr with ${resp.status}: ${resp.statusText}`);
    }
    return resp.data;
  });
}

// РАЗМЕТКА
function createMarkup(date) {
  return `
    <div class="photo-card">
      <img src="${date.src}" alt="${date.alt}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>${date.Likes}</b>
        </p>
        <p class="info-item">
          <b>${date.Views}</b>
        </p>
      <p class="info-item">
        <b>${date.Comments}</b>
      </p>
      <p class="info-item">
        <b>${date.Downloads}</b>
      </p>
    </div>
  </div>
  `;
}

