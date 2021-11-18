import '/./sass/main.scss';
import { searchImages } from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('[id="search-form"]');
const galleryDiv = document.querySelector('.gallery');
const searchQueryInput = document.querySelector('[name="searchQuery"]');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let perPage = 40;

loadMoreBtn.classList.add('is-hidden');

searchForm.addEventListener('submit', onSearchFormSabmit);

function onSearchFormSabmit(e) {
    e.preventDefault();
    galleryDiv.innerHTML = '';
    const searchQuery = searchQueryInput.value.trim();
    console.log(searchQuery);
    searchImages(searchQuery, page, perPage)
        .then(({ data }) => {
            console.log(data.hits);
            if (data.hits.length === 0) {
                Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
            } 
            renderGallery(data.hits);
             Notify.success(`Hooray! We found ${data.totalHits} images.`);
             if (page < perPage) {
            loadMoreBtn.classList.remove('is-hidden');;
            }
        })
        .catch (error => console.log(error));
    }
  
    

function renderGallery(images) {
    const markup = images.map((image => {
        return `<a class="gallery__link" href="${image.largeImageURL}">
        <div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <span> ${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${image.downloads}</span>
    </p>
  </div>
</div>`
    })).join('');
    galleryDiv.insertAdjacentHTML('beforeend', markup);
    
}