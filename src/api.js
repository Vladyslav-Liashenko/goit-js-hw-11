import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('.searchQuery');
const serachBtn = document.querySelector('.searchBtn');
const gallery = document.querySelector('.gallery');
const loadeMore = document.querySelector('.loadmore');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39984846-5bc4e2c56e6d5349f3486ddeb';
let q = '';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';
let page;
let per_page = 40;


// Запуск отрисовки по клику поиск
serachBtn.addEventListener('click', function () {
  event.preventDefault();
  q = searchInput.value;
  gallery.innerHTML = '';
  page = 1;
  
  getData(q)
    .then(data => {
      const totalHits = data.totalHits;
      const message = `Hooray! We found ${totalHits} images.`;
      Notiflix.Notify.success(message);
      gallery.insertAdjacentHTML('beforeend', createMarkup(data));
      loadeMore.style.visibility = 'visible';
      lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
      scrollPageSmoothly();
    })
    .catch(err => console.log(err));
});

// ЗАПРОС АПИ

export function getData(q) {
  
  const params = new URLSearchParams({
    q: q,
    image_type: IMAGE_TYPE,
    orientation: ORIENTATION,
    safesearch: SAFESEARCH,
    page: page,
    per_page: per_page
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

// РАЗМЕТКА
function createMarkup({ hits }) {
  return hits.map(
    ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
        <a href="${largeImageURL}" class="image-link">
          <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" data-src="${largeImageURL}"/>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${downloads}
              </p>
            </div>
          </div>
        </a>
      `;
    })
    .join("");
}
loadeMore.addEventListener('click', function () {
  page += 1;
  per_page += 40;

  getData(q)
    .then(data => {
      gallery.insertAdjacentHTML('beforeend', createMarkup(data));

      if (data.hits.length < data.totalHits) {
        loadeMore.style.visibility = 'hidden';
        Notiflix.Notify.failure(
          'We are sorry, but you have reached the end of search results.'
        );
        lightbox.refresh();
        scrollPageSmoothly();
      }
    })
    .catch(err => console.log(err));
});
// СКРОЛ
function scrollPageSmoothly() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Слушаем событие прокрутки страницы
window.addEventListener('scroll', () => {
  // Если пользователь долистал до нижней части страницы
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
    page += 1;
    per_page += 40;

    getData(q)
      .then(data => {
        gallery.insertAdjacentHTML('beforeend', createMarkup(data));

        if (data.hits.length < data.totalHits) {
          Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
        }
      })
      .catch(err => console.log(err));
  }
});
