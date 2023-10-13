import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { getData } from './api.js';

const searchInput = document.querySelector('.searchQuery');
const serachBtn = document.querySelector('.searchBtn');
const gallery = document.querySelector('.gallery');
const loadeMore = document.querySelector('.loadmore');
let q = '';
let page = 0;
const per_page = 40;
const maxRecords = 500;
const total = maxRecords / per_page;

serachBtn.addEventListener('click', async () => {
  event.preventDefault();
  page = 1;
  q = searchInput.value;

  if (!q) return;

  gallery.innerHTML = '';
  page = 1;

  try {
    const data = await getData(q, page, per_page);
    const { total, totalHits, hits } = data;
    if (!total) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const message = 'Hooray! We found ${totalHits} images.';
    Notiflix.Notify.success(message);
    gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    loadeMore.style.visibility = 'visible';
    lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
    scrollPageSmoothly();
  } catch (e) {
    console.log(e);
  }
});

function createMarkup(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
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
      }
    )
    .join('');
}
loadeMore.addEventListener('click', async () => {
  page += 1;
});

function scrollPageSmoothly() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

window.addEventListener('scroll', async () => {

  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight
  ) {
    if (page > total) {
      loadeMore.style.display = 'none';
      Notiflix.Notify.failure(
        'We are sorry, but you have reached the end of search results.'
      );
      return;
    }
    page += 1;

    try{
      const data = await getData(q, page, per_page);
      const { hits } = data;
      gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      
    }catch(e){
      console.log(e)
    }
  }
});
