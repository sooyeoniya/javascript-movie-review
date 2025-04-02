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
function Skeleton({
  width = "",
  height = "",
  className = "",
  style = {}
}) {
  const $skeletonContainer = document.createElement("div");
  $skeletonContainer.className = `skeleton ${className}`.trim();
  $skeletonContainer.style.width = typeof width === "number" ? `${width}px` : width;
  $skeletonContainer.style.height = typeof height === "number" ? `${height}px` : height;
  Object.entries(style).forEach(([property, value]) => {
    const cssProperty = property.replace(
      /[A-Z]/g,
      (match) => `-${match.toLowerCase()}`
    );
    if (value !== void 0 && value !== null) {
      $skeletonContainer.style.setProperty(cssProperty, String(value));
    }
  });
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
          ${Skeleton({
        width: "100%",
        height: "auto",
        style: {
          aspectRatio: "2/3"
        }
      }).outerHTML}
          <div class="item-desc">
            ${Skeleton({ width: "30%", height: 15 }).outerHTML}
            ${Skeleton({ width: "75%", height: 20 }).outerHTML}
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
        ${Skeleton({ width: 280, height: 30, style: { margin: "0 0 10px 0" } }).outerHTML}
        <p class="modal-rate rate">
          ${Skeleton({ width: 330, height: 25 }).outerHTML}
        </p>
        <p class="modal-detail">
          ${Skeleton({ width: 150, height: 30, style: { margin: "10px 0" } }).outerHTML}
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
    if (!movieData) return;
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
function c(n, ...t) {
  return (r) => t.reduce((n2, t2) => t2(n2), n(r));
}
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
const _Movies = class _Movies {
  constructor() {
    __publicField(this, "_movies", []);
  }
  static getInstance() {
    if (!_Movies.instance) _Movies.instance = new _Movies();
    return _Movies.instance;
  }
  get movies() {
    return [...this._movies];
  }
  updateMovies(data) {
    this._movies = [...this._movies, ...data.results];
  }
  getFirstMovie() {
    return this._movies[0];
  }
  findMovieById(id) {
    return this._movies.find((movie) => movie.id === id);
  }
  isEmpty() {
    return this._movies.length === 0;
  }
  reset() {
    this._movies = [];
  }
};
__publicField(_Movies, "instance");
let Movies = _Movies;
const _Pagination = class _Pagination {
  constructor() {
    __publicField(this, "_currentPage", 1);
    __publicField(this, "_totalPages", 1);
    __publicField(this, "_maxPage", MAX_MOVIE_PAGE);
  }
  static getInstance() {
    if (!_Pagination.instance) _Pagination.instance = new _Pagination();
    return _Pagination.instance;
  }
  get currentPage() {
    return this._currentPage;
  }
  updateTotalPages(totalPages) {
    this._totalPages = totalPages;
  }
  nextPage() {
    if (!this.hasReachedEnd()) this._currentPage += 1;
    return this._currentPage;
  }
  hasReachedEnd() {
    return this._currentPage >= Math.min(this._maxPage, this._totalPages);
  }
  isFirstPage() {
    return this._currentPage === 1;
  }
  resetCurrentPage() {
    this._currentPage = 1;
  }
};
__publicField(_Pagination, "instance");
let Pagination = _Pagination;
const _Search = class _Search {
  constructor() {
    __publicField(this, "_searchKeyword", "");
  }
  static getInstance() {
    if (!_Search.instance) _Search.instance = new _Search();
    return _Search.instance;
  }
  get searchKeyword() {
    return this._searchKeyword;
  }
  updateSearchKeyword(searchKeyword) {
    this._searchKeyword = searchKeyword;
  }
  hasSearchKeyword() {
    return this._searchKeyword !== "";
  }
};
__publicField(_Search, "instance");
let Search = _Search;
class InfiniteScroll {
  constructor() {
    __publicField(this, "pagination", Pagination.getInstance());
    __publicField(this, "isLoading", false);
    __publicField(this, "hasReachedEnd", false);
    __publicField(this, "lastScrollY", 0);
    __publicField(this, "scrollTimeout", null);
  }
  initialize() {
    this.cleanup();
    this.isLoading = false;
    this.hasReachedEnd = false;
    this.lastScrollY = window.scrollY;
    window.addEventListener("scroll", this.handleScroll.bind(this), {
      passive: true
    });
  }
  handleScroll() {
    if (this.isLoading || this.hasReachedEnd) return;
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > this.lastScrollY;
    this.lastScrollY = currentScrollY;
    if (!isScrollingDown) return;
    if (this.scrollTimeout === null) {
      this.scrollTimeout = window.setTimeout(() => {
        this.checkAndLoadMoreItems();
        this.scrollTimeout = null;
      }, 400);
    }
  }
  checkAndLoadMoreItems() {
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const scrolledToBottom = viewportHeight + scrollY >= documentHeight - 150;
    if (scrolledToBottom) this.loadMoreItems();
  }
  async loadMoreItems() {
    if (this.hasReachedEnd || this.isLoading || this.pagination.hasReachedEnd()) {
      this.hasReachedEnd = true;
      return;
    }
    this.isLoading = true;
    this.pagination.nextPage();
    await MovieService.getInstance().renderMovies();
    this.isLoading = false;
  }
  setIsLoading(value) {
    this.isLoading = value;
  }
  setHasReachedEnd(value) {
    this.hasReachedEnd = value;
  }
  cleanup() {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
    if (this.scrollTimeout !== null) clearTimeout(this.scrollTimeout);
  }
}
const _MovieService = class _MovieService {
  constructor() {
    __publicField(this, "main", Main.getInstance());
    __publicField(this, "movies", Movies.getInstance());
    __publicField(this, "pagination", Pagination.getInstance());
    __publicField(this, "search", Search.getInstance());
    __publicField(this, "infiniteScroll", new InfiniteScroll());
    __publicField(this, "processSuccessResponse", (data) => {
      return c(
        (data2) => this.updateFromResponse(data2),
        () => {
          if (this.pagination.hasReachedEnd())
            this.infiniteScroll.setHasReachedEnd(true);
        },
        () => {
          this.main.setState({
            movies: this.movies.movies,
            isLoading: false,
            error: this.movies.isEmpty() ? "검색 결과가 없습니다." : null
          });
        }
      )(data);
    });
    __publicField(this, "processErrorResponse", (error) => {
      return c(
        (error2) => this.main.setState({
          isLoading: false,
          error: error2
        }),
        () => this.infiniteScroll.setIsLoading(false)
      )(error);
    });
  }
  static getInstance() {
    if (!_MovieService.instance) _MovieService.instance = new _MovieService();
    return _MovieService.instance;
  }
  async renderMovies() {
    if (!this.search.hasSearchKeyword()) await this.renderTotalList();
    else await this.renderSearchList();
    this.main.render();
    if (this.pagination.isFirstPage()) this.infiniteScroll.initialize();
  }
  async renderTotalList() {
    const moviesResponse = await getMovies({
      page: this.pagination.currentPage
    });
    handleApiResponse(moviesResponse, {
      onSuccess: (data) => {
        this.processSuccessResponse(data);
        this.updateHeaderWithFirstMovie();
      },
      onError: (error) => this.processErrorResponse(error)
    });
  }
  async renderSearchList() {
    this.updateHeaderWithFirstMovie();
    const moviesResponse = await searchMovies({
      page: this.pagination.currentPage,
      title: this.search.searchKeyword
    });
    handleApiResponse(moviesResponse, {
      onSuccess: (data) => this.processSuccessResponse(data),
      onError: (error) => this.processErrorResponse(error)
    });
  }
  updateHeaderWithFirstMovie() {
    const header2 = Header.getInstance();
    const firstMovieData = this.movies.getFirstMovie();
    if (!firstMovieData) return;
    header2.setState({
      id: firstMovieData.id,
      posterImage: `${PREFIX_POSTER_PATH}${firstMovieData.poster_path}`,
      title: firstMovieData.title,
      voteAverage: firstMovieData.vote_average,
      isLoading: false
    });
  }
  updateFromResponse(data) {
    this.movies.updateMovies(data);
    this.pagination.updateTotalPages(data.total_pages);
  }
};
__publicField(_MovieService, "instance");
let MovieService = _MovieService;
const initializeLayout = async () => {
  const $app = document.querySelector("#app");
  $app == null ? void 0 : $app.append(App.getInstance().getElement());
  await MovieService.getInstance().renderMovies();
};
const _Genres = class _Genres {
  constructor() {
    __publicField(this, "_genres", []);
  }
  static getInstance() {
    if (!_Genres.instance) _Genres.instance = new _Genres();
    return _Genres.instance;
  }
  async setGenres() {
    const genreResponse = await getGenres();
    handleApiResponse(genreResponse, {
      onSuccess: (data) => this._genres = data.genres
    });
  }
  getGenreNamesByIds(genreIds) {
    return this._genres.filter((genre) => genreIds.includes(genre.id)).map((genre) => genre.name);
  }
};
__publicField(_Genres, "instance");
let Genres = _Genres;
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
  findRatingById(movieId) {
    var _a;
    return ((_a = this.getRatings().find((rating) => rating.movieId === movieId)) == null ? void 0 : _a.rate) ?? 0;
  }
};
__publicField(_UserMovieRatingStorage, "instance");
__publicField(_UserMovieRatingStorage, "MOVIE_RATING_KEY", "movieRatingKey");
let UserMovieRatingStorage = _UserMovieRatingStorage;
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
  emit(eventType, data) {
    if (!this.events.has(eventType)) return;
    const handlers = this.events.get(eventType);
    if (handlers) handlers.forEach((handler) => handler(data));
  }
};
__publicField(_EventBus, "instance");
let EventBus = _EventBus;
const EVENT_TYPES = {
  modal: {
    open: "MODAL_OPEN",
    close: "MODAL_CLOSE"
  },
  search: {
    submit: "SEARCH_SUBMIT"
  },
  movie: {
    setRating: "SET_RATING"
  }
};
const eventBus$1 = EventBus.getInstance();
const movieRating = UserMovieRatingStorage.getInstance();
const movieService = MovieService.getInstance();
const modal = Modal.getInstance();
const header = Header.getInstance();
const main = Main.getInstance();
const movies = Movies.getInstance();
const genres = Genres.getInstance();
const pagination = Pagination.getInstance();
const search = Search.getInstance();
function initializeEventHandler() {
  eventBus$1.on(EVENT_TYPES.modal.open, handleModalOpen);
  eventBus$1.on(EVENT_TYPES.modal.close, handleModalClose);
  eventBus$1.on(EVENT_TYPES.search.submit, handleSearch);
  eventBus$1.on(EVENT_TYPES.movie.setRating, handleSetRating);
}
async function handleModalOpen(movieId) {
  modal.setState({ isLoading: true });
  modal.open();
  const movieData = movies.findMovieById(movieId);
  if (!movieData) return;
  await genres.setGenres();
  const {
    genre_ids,
    title,
    poster_path,
    vote_average,
    overview,
    release_date
  } = movieData;
  const genreNames = genres.getGenreNamesByIds(genre_ids);
  const releaseDate = release_date.split("-")[0];
  const myRate = movieRating.findRatingById(movieId);
  const finalMovieData = {
    id: movieId,
    title,
    poster_path,
    vote_average,
    overview,
    genres: genreNames,
    release_date: releaseDate,
    isLoading: false,
    my_rate: myRate
  };
  modal.open(finalMovieData);
}
function handleModalClose() {
  modal.close();
}
async function handleSearch(value) {
  search.updateSearchKeyword(value);
  pagination.resetCurrentPage();
  movies.reset();
  main.setState({
    title: `"${search.searchKeyword}" 검색 결과`,
    isLoading: true
  });
  header.setState({ hasSearched: true });
  await movieService.renderMovies();
}
function handleSetRating(newRating) {
  const currentMovieId = modal.getMovieId();
  if (!currentMovieId) return;
  movieRating.setRating({
    movieId: currentMovieId,
    rate: newRating
  });
  modal.setState({ my_rate: newRating });
}
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
const eventBus = EventBus.getInstance();
const SELECTORS = {
  closeModalButton: "#closeModal",
  modalBackground: ".modal-background",
  movieItem: ".thumbnail-list .item, .top-rated-button",
  searchInput: ".top-rated-search-input",
  ratingStar: ".star"
};
function initializeDomEventListener() {
  window.addEventListener("click", handleClick);
  window.addEventListener("submit", handleSubmit);
  window.addEventListener("keydown", handleKeydown);
}
function handleClick({ target }) {
  if (!isElement(target)) return;
  const elementMap = [
    {
      selector: SELECTORS.closeModalButton,
      action: () => eventBus.emit(EVENT_TYPES.modal.close),
      matchMethod: "closest"
    },
    {
      selector: SELECTORS.modalBackground,
      action: () => eventBus.emit(EVENT_TYPES.modal.close),
      matchMethod: "matches"
    },
    {
      selector: SELECTORS.movieItem,
      action: (movieItem) => {
        if (!movieItem || !isHTMLElement(movieItem)) return;
        const movieId = Number(movieItem.dataset.movieId);
        if (!movieId) return;
        eventBus.emit(EVENT_TYPES.modal.open, movieId);
      },
      matchMethod: "closest"
    },
    {
      selector: SELECTORS.ratingStar,
      action: (starImg) => {
        if (!starImg || !isImage(starImg)) return;
        const newRating = Number(starImg.dataset.value);
        eventBus.emit(EVENT_TYPES.movie.setRating, newRating);
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
}
function handleSubmit(event) {
  event.preventDefault();
  const { target } = event;
  if (!isForm(target)) return;
  const $searchInput = target.querySelector(SELECTORS.searchInput);
  if (!isInput($searchInput)) return;
  const keyword = $searchInput.value.trim();
  if (!keyword) return;
  target.reset();
  eventBus.emit(EVENT_TYPES.search.submit, keyword);
}
function handleKeydown(event) {
  if (event.defaultPrevented) return;
  if (["Escape", "Esc"].includes(event.key) && Modal.getInstance().isActive()) {
    eventBus.emit(EVENT_TYPES.modal.close);
    event.preventDefault();
  }
}
addEventListener("load", () => {
  initializeLayout();
  initializeDomEventListener();
  initializeEventHandler();
});
