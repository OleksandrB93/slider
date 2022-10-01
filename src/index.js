import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import PixabayApiService from './js/pixabay-service';
import LoadMoreBtn from './js/component/load-more-btn';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

//! Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом.
//! Додай оформлення елементів інтерфейсу. Подивись демо-відео роботи застосунку.
//
//! Форма спочатку міститья в HTML документі. Користувач буде вводити рядок для пошуку
//! у текстове поле, а по сабміту форми необхідно виконувати HTTP-запит.
//
//! Для бекенду використовуй публічний API сервісу Pixabay.
//! Зареєструйся, отримай свій унікальний ключ доступу і ознайомся з документацією.

//! Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

//! key - твій унікальний ключ доступу до API.
//! q - термін для пошуку. Те, що буде вводити користувач.
//! image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
//! orientation - орієнтація фотографії. Постав значення horizontal.
//! safesearch - фільтр за віком. Постав значення true.
//
//! У відповіді буде масив зображень, що задовольнили критерії параметрів запиту.
//! Кожне зображення описується об'єктом, з якого тобі цікаві тільки наступні властивості:!
//! webformatURL - посилання на маленьке зображення для списку карток.
//! largeImageURL - посилання на велике зображення.
//! tags - рядок з описом зображення. Підійде для атрибуту alt.
//! likes - кількість лайків.
//! views - кількість переглядів.
//! comments - кількість коментарів.
//! downloads - кількість завантажень.
//!
//! Якщо бекенд повертає порожній масив, значить нічого підходящого не було знайдено.
//! У такому разі показуй повідомлення з текстом:
//! "Sorry, there are no images matching your search query. Please try again.".
//! Для повідомлень використовуй бібліотеку notiflix.
//

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  searchBtn: document.querySelector('search-btn'),
  galleryCards: document.querySelector('.gallery'),
  body: document.querySelector('body'),
};
refs.body.style.backgroundColor = '#e2e0dc';

const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
loadMoreBtn.refs.button.hidden = true;

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetnchArticles);

function onSearch(event) {
  event.preventDefault();

  pixabayApiService.query = event.currentTarget.elements.query.value;
  clearArticlesContainer();

  if (pixabayApiService.query === '') {
    Notify.info('Please, write something...');
  } else {
    clearArticlesContainer();

    loadMoreBtn.Show();
    pixabayApiService.resetPage();
    loadMoreBtn.refs.button.hidden = false;
    Notify.success('Here are the images we were able to find!');
    fetnchArticles();
  }
}

function fetnchArticles() {
  loadMoreBtn.disable();
  pixabayApiService.fetchArticles().then(hits => {
    createGalleryMarkup(hits);
    loadMoreBtn.enable();
  });
}

function createGalleryMarkup(images) {
  const markup = images
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
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img
          class="photo-card__img"
          src="${largeImageURL}" 
          alt="${tags}" 
          loading="lazy" 
          width="320"
          height="212"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${downloads}</span>
        </p>
      </div>
    </div>
    `;
      }
    )
    .join('');

  refs.galleryCards.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function clearArticlesContainer() {
  refs.galleryCards.innerHTML = '';
}

var gallery = new SimpleLightbox('.gallery a', {
  /* options */
});

