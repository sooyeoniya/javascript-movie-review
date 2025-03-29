var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
async function fetchWithErrorHandling(url) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDljNDczODg1ZmVjMjQxYzIzOTNkYWVlNDkwYzMwMiIsIm5iZiI6MTc0Mjg3OTA3Ny4xOCwic3ViIjoiNjdlMjM5NjU0NDBmMzExYWNlNzVkNWEwIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.qpqb60AR3c7Qc-BOPMm-vOvEx_v4_hJETbJpmQFAnYw"}`
    }
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      switch (response.status) {
        case 400:
          return {
            error: "검색 가능한 페이지 수를 넘겼습니다."
          };
        case 401:
          return {
            error: "사용자 인증 정보가 잘못되었습니다."
          };
        default:
          return {
            error: `에러가 발생했습니다. (${response.status})`
          };
      }
    }
    return response.json();
  } catch (error) {
    return {
      error: `에러가 발생했습니다. ${error}`
    };
  }
}
const MOVIE_API = {
  BaseUrl: "https://api.themoviedb.org/3",
  endPoints: {
    movies: {
      popular: "movie/popular",
      search: "search/movie",
      genre: "genre/movie/list"
    }
  },
  defaultParams: {
    language: "ko-KR"
  }
};
const createMovieApiUrl = (endpoint, params) => {
  const searchParams = new URLSearchParams({
    ...MOVIE_API.defaultParams,
    ...params
  });
  return `${MOVIE_API.BaseUrl}/${endpoint}?${searchParams.toString()}`;
};
async function getMovies({ page }) {
  const url = createMovieApiUrl(MOVIE_API.endPoints.movies.popular, {
    page: String(page)
  });
  return fetchWithErrorHandling(url);
}
async function searchMovies({ page, title }) {
  const url = createMovieApiUrl(MOVIE_API.endPoints.movies.search, {
    query: String(title),
    include_adult: "false",
    page: String(page)
  });
  return fetchWithErrorHandling(url);
}
async function getGenres() {
  const url = createMovieApiUrl(MOVIE_API.endPoints.movies.genre);
  return fetchWithErrorHandling(url);
}
const isErrorResponse = (response) => {
  return "error" in response;
};
function handleApiResponse(response, callbacks) {
  if (callbacks.onError && isErrorResponse(response)) {
    callbacks.onError(response.error);
    return;
  }
  callbacks.onSuccess(response);
}
class Component {
  constructor(initialState) {
    __publicField(this, "$element");
    __publicField(this, "state");
    this.$element = this.createElement();
    this.state = initialState;
    this.render();
  }
  render() {
    this.$element.innerHTML = this.template();
  }
  template() {
    return "";
  }
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
  getElement() {
    return this.$element;
  }
}
const _Footer = class _Footer extends Component {
  createElement() {
    const $footer = document.createElement("footer");
    $footer.className = "footer";
    return $footer;
  }
  static getInstance() {
    if (!_Footer.instance) _Footer.instance = new _Footer();
    return _Footer.instance;
  }
  render() {
    this.$element.innerHTML = /*html*/
    `
      <p>&copy; 우아한테크코스 All Rights Reserved.</p>
      <p>
        <img
          src="./images/woowacourse_logo.png"
          width="180"
          alt="woowacourse_logo"
        />
      </p>
    `;
  }
};
__publicField(_Footer, "instance");
let Footer = _Footer;
function Button({
  className = "",
  textContent,
  type = "button"
}) {
  const $button = document.createElement("button");
  $button.className = `primary ${className}`;
  $button.textContent = textContent;
  $button.type = type;
  return $button;
}
function Skeleton({ width, height }) {
  const $skeletonContainer = document.createElement("div");
  $skeletonContainer.className = "skeleton";
  $skeletonContainer.style.width = `${width}px`;
  $skeletonContainer.style.height = `${height}px`;
  return $skeletonContainer;
}
const _Header = class _Header extends Component {
  constructor() {
    super({
      id: null,
      posterImage: null,
      title: null,
      voteAverage: null,
      hasSearched: false,
      isLoading: true
    });
  }
  createElement() {
    const $header = document.createElement("header");
    $header.className = "background-container";
    return $header;
  }
  static getInstance() {
    if (!_Header.instance) _Header.instance = new _Header();
    return _Header.instance;
  }
  render() {
    this.$element.style.backgroundImage = !this.state.hasSearched ? `url(${this.state.posterImage})` : "";
    super.render();
  }
  renderSkeletonItem() {
    return (
      /*html*/
      `
      ${Skeleton({ width: 100, height: 20 }).outerHTML}
      ${Skeleton({ width: 170, height: 30 }).outerHTML}
      ${Skeleton({ width: 120, height: 20 }).outerHTML}
    `
    );
  }
  template() {
    return (
      /*html*/
      `
    ${!this.state.hasSearched ? (
        /*html*/
        `<div class="overlay" aria-hidden="true"></div>`
      ) : ""}
    <div class="top-rated-header">
      <a href="/javascript-movie-review">
        <h1 class="logo">
          <img src="./images/logo.png" alt="MovieList" />
        </h1>
      </a>
      <form class="top-rated-search">
        <input
          id="top-rated-search-input"
          class="top-rated-search-input"
          placeholder="검색어를 입력하세요"
        />
        <button type="submit" class="top-rated-search-button">
          <img src="./images/search.svg" alt="MovieSearch" />
        </button>
      </form>
    </div>
    ${!this.state.hasSearched ? (
        /*html*/
        `
        <div class="top-rated-container">
          <div class="top-rated-movie">
            ${this.state.isLoading ? this.renderSkeletonItem() : (
          /*html*/
          `
                  <div class="rate">
                    <img src="./images/star_empty.png" class="star" alt="star" />
                    <span class="rate-value">${this.state.voteAverage}</span>
                  </div>
                  <div class="title">${this.state.title}</div>
                  <div class="top-rated-button" data-movie-id="${this.state.id}">
                  ${Button({ className: "detail", textContent: "자세히 보기" }).outerHTML}
                  </div>
                `
        )}
          </div>
        </div>`
      ) : ""}
  `
    );
  }
};
__publicField(_Header, "instance");
let Header = _Header;
const MAX_MOVIE_PAGE = 500;
const PREFIX_POSTER_PATH = "https://media.themoviedb.org/t/p/w440_and_h660_face/";
const SKELETON_COUNT = 20;
const _Main = class _Main extends Component {
  constructor() {
    super({
      movies: [],
      isLoading: true,
      title: "지금 인기 있는 영화",
      error: null
    });
  }
  createElement() {
    return document.createElement("main");
  }
  static getInstance() {
    if (!_Main.instance) _Main.instance = new _Main();
    return _Main.instance;
  }
  renderSkeletonItem() {
    return (
      /*html*/
      `
      <li>
        <div class="item">
          ${Skeleton({ width: 200, height: 300 }).outerHTML}
          <div class="item-desc">
            ${Skeleton({ width: 60, height: 15 }).outerHTML}
            ${Skeleton({ width: 150, height: 20 }).outerHTML}
          </div> 
        </div> 
      </li>
    `
    );
  }
  renderMovieItem(movie) {
    const posterImage = movie.poster_path ? `${PREFIX_POSTER_PATH}${movie.poster_path}` : "./images/default_thumbnail.jpeg";
    return (
      /*html*/
      `
      <li>
        <div class="item" data-movie-id="${movie.id}">
          <img
            class="thumbnail"
            src="${posterImage}"
            alt="${movie.title}"
          />
          <div class="item-desc">
            <p class="rate loading">
              <img src="./images/star_empty.png" class="star" alt="star" /><span
                >${movie.vote_average}</span
              >
            </p>
            <strong>${movie.title}</strong>
          </div>
        </div>
      </li>
    `
    );
  }
  template() {
    return (
      /*html*/
      `
      <section>
        <h2 class="thumbnail-title">${this.state.title}</h2>
        ${!this.state.error ? (
        /*html*/
        `
          <ul class="thumbnail-list">
          ${this.state.isLoading ? Array.from(
          { length: SKELETON_COUNT },
          this.renderSkeletonItem
        ).join("") : this.state.movies.map((movie) => this.renderMovieItem(movie)).join("")}
        </ul>
          `
      ) : (
        /*html*/
        `
          <div class="error">
            <img src="./images/woowawa_planet.svg" alt="woowawa_planet" />
            <h2 class="error-message">${this.state.error}</h2>
          </div>
          `
      )}
      </section>
    `
    );
  }
};
__publicField(_Main, "instance");
let Main = _Main;
const ratingDescriptions = {
  0: "별점을 선택해주세요",
  2: "최악이에요",
  4: "별로예요",
  6: "보통이에요",
  8: "재미있어요",
  10: "명작이에요"
};
const _Modal = class _Modal extends Component {
  constructor() {
    super({
      id: null,
      title: null,
      poster_path: null,
      vote_average: null,
      overview: null,
      genres: [],
      release_date: null,
      isLoading: true,
      my_rate: 0
    });
  }
  createElement() {
    const $modal = document.createElement("div");
    $modal.className = "modal-background";
    $modal.id = "modalBackground";
    return $modal;
  }
  static getInstance() {
    if (!_Modal.instance) _Modal.instance = new _Modal();
    return _Modal.instance;
  }
  renderSkeletonItem() {
    return (
      /*html*/
      `
      <div class="modal-image">
        ${Skeleton({ width: 350, height: 570 }).outerHTML}
      </div>
      <div class="modal-description">
        ${Skeleton({ width: 300, height: 40 }).outerHTML}
        <p class="modal-rate rate">
          ${Skeleton({ width: 370, height: 25 }).outerHTML}
        </p>
        <p class="modal-detail">
          ${Skeleton({ width: 150, height: 30 }).outerHTML}
        </p>
      </div>
    `
    );
  }
  renderRatingStar() {
    const totalStars = 5;
    const filledStars = this.state.my_rate / 2;
    const starsHtml = Array.from({ length: totalStars }, (_, i) => {
      const starType = i + 1 <= filledStars ? "filled" : "empty";
      return `<img 
        src="./images/star_${starType}.png" 
        class="star" 
        data-value="${(i + 1) * 2}"
        alt="star"
      />`;
    }).join("");
    return starsHtml;
  }
  template() {
    return (
      /*html*/
      `
      <div class="modal">
        <button class="close-modal" id="closeModal">
          <img src="./images/modal_button_close.png" />
        </button>
        <div class="modal-container" data-movie-id="${this.state.id}">
          ${this.state.isLoading ? this.renderSkeletonItem() : (
        /*html*/
        `
              <div class="modal-image">
                <img src="${PREFIX_POSTER_PATH}${this.state.poster_path}" />
              </div>
              <div class="modal-description">
                <h2 class="modal-title">${this.state.title}</h2>
                <p class="modal-category">
                  ${this.state.release_date} · ${this.state.genres.join(", ")}
                </p>
                <p class="modal-rate rate">
                  <span class="modal-rate-average">평균</span>
                  <img src="./images/star_filled.png" class="star" alt="star" /><span
                    >${this.state.vote_average}</span
                  >
                </p>
                <hr />
                <p class="modal-subtitle">내 별점</p>
                <div class="modal-rate-star">
                  <div>${this.renderRatingStar()}</div>
                  <div>
                    <span class="modal-rate-description">${ratingDescriptions[this.state.my_rate]}</span>
                    <span class="modal-rate-scale">(${this.state.my_rate}/10)</span>
                  </div>
                </div>
                <hr />
                <p class="modal-subtitle">줄거리</p>
                <p class="modal-detail">${this.state.overview}</p>
              </div>
            `
      )}
        </div>
      </div>
    `
    );
  }
  open(movieData) {
    this.$element.classList.add("active");
    this.setState({
      isLoading: false,
      id: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path,
      vote_average: movieData.vote_average,
      overview: movieData.overview,
      genres: movieData.genres,
      release_date: movieData.release_date,
      my_rate: movieData.my_rate
    });
  }
  close() {
    this.$element.classList.remove("active");
  }
  isActive() {
    return this.$element.classList.contains("active");
  }
  getMovieId() {
    return this.state.id;
  }
};
__publicField(_Modal, "instance");
let Modal = _Modal;
const _App = class _App extends Component {
  createElement() {
    const $wrap = document.createElement("div");
    $wrap.id = "wrap";
    return $wrap;
  }
  static getInstance() {
    if (!_App.instance) _App.instance = new _App();
    return _App.instance;
  }
  render() {
    const $container = document.createElement("div");
    $container.className = "container";
    const $main = Main.getInstance().getElement();
    const $header = Header.getInstance().getElement();
    const $modal = Modal.getInstance().getElement();
    const $footer = Footer.getInstance().getElement();
    $container.append($main);
    this.$element.append($header, $container, $footer, $modal);
  }
};
__publicField(_App, "instance");
let App = _App;
const store = {
  page: 1,
  totalPages: 1,
  movies: [],
  searchKeyword: "",
  genres: []
};
let isLoading = false;
let hasReachedEnd = false;
const initInfiniteScroll = () => {
  window.removeEventListener("scroll", handleScroll);
  isLoading = false;
  hasReachedEnd = false;
  window.addEventListener("scroll", handleScroll);
};
const handleScroll = () => {
  if (isLoading || hasReachedEnd) return;
  checkAndLoadMoreItems();
};
const checkAndLoadMoreItems = () => {
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const scrolledToBottom = viewportHeight + scrollY >= documentHeight - 150;
  if (scrolledToBottom) loadMoreItems();
};
const loadMoreItems = async () => {
  if (hasReachedEnd || isLoading || store.page >= Math.min(MAX_MOVIE_PAGE, store.totalPages)) {
    hasReachedEnd = true;
    return;
  }
  isLoading = true;
  store.page = store.page + 1;
  await updateMoviesList();
  isLoading = false;
};
const checkLastPage = () => {
  return store.page >= Math.min(MAX_MOVIE_PAGE, store.totalPages);
};
const setHeaderData = () => {
  const header = Header.getInstance();
  const firstMovieData = store.movies[0];
  if (!firstMovieData) return;
  header.setState({
    id: firstMovieData.id,
    posterImage: `${PREFIX_POSTER_PATH}${firstMovieData.poster_path}`,
    title: firstMovieData.title,
    voteAverage: firstMovieData.vote_average,
    isLoading: false
  });
};
const renderTotalList = async (main) => {
  const moviesResponse = await getMovies({ page: store.page });
  handleApiResponse(moviesResponse, {
    onSuccess: (data) => {
      store.movies = [...store.movies, ...data.results];
      store.totalPages = data.total_pages;
      if (checkLastPage()) hasReachedEnd = true;
      setHeaderData();
      main.setState({
        movies: store.movies,
        isLoading: false
      });
    },
    onError: (error) => {
      main.setState({
        isLoading: false,
        error
      });
      isLoading = false;
    }
  });
};
const renderSearchList = async (main) => {
  setHeaderData();
  const moviesResponse = await searchMovies({
    page: store.page,
    title: store.searchKeyword
  });
  handleApiResponse(moviesResponse, {
    onSuccess: (data) => {
      store.movies = [...store.movies, ...data.results];
      store.totalPages = data.total_pages;
      if (checkLastPage()) hasReachedEnd = true;
      main.setState({
        movies: store.movies,
        isLoading: false,
        error: store.movies.length === 0 ? "검색 결과가 없습니다." : null
      });
    },
    onError: (error) => {
      main.setState({
        isLoading: false,
        error
      });
      isLoading = false;
    }
  });
};
const getGenreList = async () => {
  const genreResponse = await getGenres();
  handleApiResponse(genreResponse, {
    onSuccess: (data) => store.genres = data.genres
  });
};
const updateMoviesList = async () => {
  const main = Main.getInstance();
  if (store.searchKeyword === "") await renderTotalList(main);
  else await renderSearchList(main);
  main.render();
  if (store.page === 1) initInfiniteScroll();
};
const initializeLayout = async () => {
  const $app = document.querySelector("#app");
  $app == null ? void 0 : $app.append(App.getInstance().getElement());
  await updateMoviesList();
};
const _EventBus = class _EventBus {
  constructor() {
    __publicField(this, "events");
    this.events = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!_EventBus.instance) {
      _EventBus.instance = new _EventBus();
    }
    return _EventBus.instance;
  }
  on(eventType, handler) {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, []);
    }
    const handlers = this.events.get(eventType);
    if (handlers) handlers.push(handler);
  }
  emit(eventType, ...args) {
    if (!this.events.has(eventType)) return;
    const handlers = this.events.get(eventType);
    if (handlers) handlers.forEach((handler) => handler(...args));
  }
};
__publicField(_EventBus, "instance");
let EventBus = _EventBus;
const isElement = (target) => {
  return target instanceof Element;
};
const isHTMLElement = (target) => {
  return target instanceof HTMLElement;
};
const isForm = (target) => {
  return target instanceof HTMLFormElement;
};
const isInput = (target) => {
  return target instanceof HTMLInputElement;
};
const isImage = (target) => {
  return target instanceof HTMLImageElement;
};
const EVENT_TYPES = {
  modalOpen: "modal-open",
  modalClose: "modal-close",
  search: "search",
  setRating: "set-rating"
};
const eventBus$1 = EventBus.getInstance();
const SELECTORS = {
  closeModalButton: "#closeModal",
  modalBackground: ".modal-background",
  movieItem: ".thumbnail-list .item, .top-rated-button",
  searchInput: ".top-rated-search-input",
  ratingStar: ".star"
};
window.addEventListener("click", async (event) => {
  const { target } = event;
  if (!isElement(target)) return;
  const elementMap = [
    {
      selector: SELECTORS.closeModalButton,
      action: () => eventBus$1.emit(EVENT_TYPES.modalClose),
      matchMethod: "closest"
    },
    {
      selector: SELECTORS.modalBackground,
      action: () => eventBus$1.emit(EVENT_TYPES.modalClose),
      matchMethod: "matches"
    },
    {
      selector: SELECTORS.movieItem,
      action: (movieItem) => {
        if (!movieItem || !isHTMLElement(movieItem)) return;
        const movieId = Number(movieItem.dataset.movieId);
        if (!movieId) return;
        eventBus$1.emit(EVENT_TYPES.modalOpen, movieId);
      },
      matchMethod: "closest"
    },
    {
      selector: SELECTORS.ratingStar,
      action: (starImg) => {
        if (!starImg || !isImage(starImg)) return;
        const newRating = Number(starImg.dataset.value);
        eventBus$1.emit(EVENT_TYPES.setRating, newRating);
      },
      matchMethod: "closest"
    }
  ];
  for (const { selector, action, matchMethod } of elementMap) {
    const element = matchMethod === "matches" ? target.matches(selector) ? target : null : target.closest(selector);
    if (!element) continue;
    action(element);
    return;
  }
});
window.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { target } = event;
  if (!isForm(target)) return;
  const $searchInput = target.querySelector(SELECTORS.searchInput);
  if (!isInput($searchInput)) return;
  const keyword = $searchInput.value.trim();
  if (!keyword) return;
  target.reset();
  eventBus$1.emit(EVENT_TYPES.search, keyword);
});
window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) return;
  if (["Escape", "Esc"].includes(event.key) && Modal.getInstance().isActive()) {
    eventBus$1.emit(EVENT_TYPES.modalClose);
    event.preventDefault();
  }
});
class LocalStorage {
  get(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  remove(key) {
    localStorage.removeItem(key);
  }
  clear() {
    localStorage.clear();
  }
}
const _UserMovieRatingStorage = class _UserMovieRatingStorage {
  constructor() {
    __publicField(this, "storage", new LocalStorage());
  }
  static getInstance() {
    if (!_UserMovieRatingStorage.instance)
      _UserMovieRatingStorage.instance = new _UserMovieRatingStorage();
    return _UserMovieRatingStorage.instance;
  }
  getRatings() {
    return this.storage.get(
      _UserMovieRatingStorage.MOVIE_RATING_KEY
    ) ?? [];
  }
  setRating(rating) {
    const ratings = this.getRatings();
    const existingIndex = ratings.findIndex(
      (r) => r.movieId === rating.movieId
    );
    if (existingIndex >= 0) ratings[existingIndex] = rating;
    else ratings.push(rating);
    this.storage.set(
      _UserMovieRatingStorage.MOVIE_RATING_KEY,
      ratings
    );
  }
  removeRating(movieId) {
    const ratings = this.getRatings();
    const filteredRatings = ratings.filter((r) => r.movieId !== movieId);
    this.storage.set(_UserMovieRatingStorage.MOVIE_RATING_KEY, filteredRatings);
  }
  clearAllRatings() {
    this.storage.remove(_UserMovieRatingStorage.MOVIE_RATING_KEY);
  }
};
__publicField(_UserMovieRatingStorage, "instance");
__publicField(_UserMovieRatingStorage, "MOVIE_RATING_KEY", "movieRatingKey");
let UserMovieRatingStorage = _UserMovieRatingStorage;
const eventBus = EventBus.getInstance();
eventBus.on(EVENT_TYPES.modalOpen, async (movieId) => {
  var _a;
  const movieData = store.movies.find((m) => m.id === movieId);
  if (!movieData) return;
  await getGenreList();
  const {
    genre_ids,
    title,
    poster_path,
    vote_average,
    overview,
    release_date
  } = movieData;
  const genres = store.genres.filter(({ id }) => genre_ids.includes(id)).map(({ name }) => name);
  const releaseDate = release_date.split("-")[0];
  const ratings = UserMovieRatingStorage.getInstance().getRatings();
  const myRate = ((_a = ratings.find((r) => r.movieId === movieId)) == null ? void 0 : _a.rate) ?? 0;
  const finalMovieData = {
    id: movieId,
    title,
    poster_path,
    vote_average,
    overview,
    genres,
    release_date: releaseDate,
    isLoading: false,
    my_rate: myRate
  };
  Modal.getInstance().open(finalMovieData);
});
eventBus.on(EVENT_TYPES.modalClose, () => {
  Modal.getInstance().close();
});
eventBus.on(EVENT_TYPES.search, async (value) => {
  store.searchKeyword = value;
  store.page = 1;
  store.movies = [];
  const main = Main.getInstance();
  main.setState({
    title: `"${store.searchKeyword}" 검색 결과`,
    isLoading: true
  });
  Header.getInstance().setState({ hasSearched: true });
  await updateMoviesList();
});
eventBus.on(EVENT_TYPES.setRating, (newRating) => {
  const currentMovieId = Modal.getInstance().getMovieId();
  if (!currentMovieId) return;
  UserMovieRatingStorage.getInstance().setRating({
    movieId: currentMovieId,
    rate: newRating
  });
  Modal.getInstance().setState({ my_rate: newRating });
});
addEventListener("load", () => {
  initializeLayout();
});
