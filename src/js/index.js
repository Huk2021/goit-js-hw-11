import '/./sass/main.scss';
import { searchImages } from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const searchForm = document.querySelector('[id="search-form"]');
const galleryDiv = document.querySelector('.gallery');
const searchQueryInput = document.querySelector('[name="searchQuery"]');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let perPage = 40;


loadMoreBtn.classList.add('is-hidden');

searchForm.addEventListener('submit', onSearchFormSabmit);
loadMoreBtn.addEventListener('click', onloadMoreBtn);
function onloadMoreBtn() {
  page += 1;
  fetchImages()
}

function onSearchFormSabmit(e) {
    e.preventDefault();
  galleryDiv.innerHTML = '';
  fetchImages()
}
function fetchImages() {
const searchQuery = searchQueryInput.value.trim();
    console.log(searchQuery);
    searchImages(searchQuery, page, perPage)
        .then(({ data }) => {
          console.log(data.hits);
          console.log(data.hits.length);
          if (data.hits.length === 0) {
              loadMoreBtn.classList.add('is-hidden');
              Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
            return
          }
          renderGallery(data.hits);
          loadMoreBtn.classList.remove('is-hidden');
          if (data.hits.length !== 0) {
            Notify.success(`Hooray! We found ${data.totalHits} images.`);
          }
          
          if (data.hits.length < 40 && data.hits.length!==0 ) {
            Notify.failure(`We're sorry, but you've reached the end of search results.`);
            loadMoreBtn.classList.add('is-hidden');
            }
        })
        .catch(error => console.log(error));
}

 
function renderGallery(images) {
    const markup = images.map((image => {
        return `
        <div class="photo-card">
        <a class="gallery__link" href="${image.largeImageURL}">
  <img class="gallery__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
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
    const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt', 
});   
}






  