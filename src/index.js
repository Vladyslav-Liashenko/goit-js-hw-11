import 'slim-select/dist/slimselect.css'
import SlimSelect from 'slim-select';

import { getBreeds, getCatsByBreed } from './cat-api.js'

const loader = document.querySelector('.loader');
loader.style.display = "block";
const error = document.querySelector('.error');
error.style.display = 'none';
const brend = document.querySelector('.breed-select');
const info = document.querySelector('.cat-info');
info.style.listStyleType = "none";

getBreeds().then((data) => {
  data.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.reference_image_id
    option.text = breed.name;
    brend.appendChild(option);
  });
  loader.style.display = 'none';
  new SlimSelect({
    select: '.breed-select',
  });
});

document.querySelector('.breed-select').addEventListener('change', function () {
  const idbreed = this.value;
  error.style.display = 'none';
  loader.style.display = 'block';

  getCatsByBreed(idbreed).then(data => {
      info.innerHTML = '';
      info.insertAdjacentHTML('beforeend', createMarkup(data));
      loader.style.display = 'none';
    })
    .catch(err => console.log(err));
});

function createMarkup(cat) {
    const { breeds }  = cat; // array from object
    const [ breed ] = breeds; // object from array
    
    return `
    <li class="cat-card">
      <img src="${cat.url}" alt="${breed.name}" width="${cat.width}" height="${cat.height}">
      <div class="cat-info">
        <h2>${breed.name}</h2>
        <p>${breed.description}</p>
        <p><strong>Temperament: </strong>${breed.temperament}</p>
      </div>
    </li>
    `;
  }
  