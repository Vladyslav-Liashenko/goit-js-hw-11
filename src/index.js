import { getData } from './api.js'
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchInput = document.querySelector('.searchQuery');
const serachBtn = document.querySelector('.searchBtn');
const gallery = document.querySelector('.gallery');
const loadeMore = document.querySelector('.loadmore');

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
