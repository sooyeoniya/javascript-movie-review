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
const MAX_MOVIE_PAGE = 500;
const PREFIX_BACKDROP_PATH = "https://media.themoviedb.org/t/p/w440_and_h660_face/";
const DEFAULT_TOP_RATED_DATA = Object.freeze({
  backdropPath: "./images/default_thumbnail.jpeg",
  title: "Non Title",
  voteAverage: 0
});
function MovieList(moviesResult) {
  const $ul = document.querySelector(".thumbnail-list");
  moviesResult.forEach((movieResult) => {
    const $li = document.createElement("li");
    const backgroundImage = movieResult.backdrop_path ? `${PREFIX_BACKDROP_PATH}${movieResult.backdrop_path}` : "./images/default_thumbnail.jpeg";
    $li.innerHTML = /*html*/
    `
      <div class="item">
        <img
          class="thumbnail"
          src="${backgroundImage}"
          alt="${movieResult.title}"
        />
        <div class="item-desc">
          <p class="rate loading">
            <img src="./images/star_empty.png" class="star" alt="star_empty" /><span
              >${movieResult.vote_average}</span
            >
          </p>
          <strong>${movieResult.title}</strong>
        </div>
      </div>
    `;
    $ul == null ? void 0 : $ul.appendChild($li);
  });
  return $ul;
}
function MovieListSkeleton() {
  const $ul = document.querySelector(".thumbnail-list");
  for (let i = 0; i < 20; i++) {
    const $li = document.createElement("li");
    const $item = document.createElement("div");
    $item.className = "item";
    const $imageSkeleton = Skeleton({ width: 200, height: 300 });
    const $voteAverageSkeleton = Skeleton({ width: 60, height: 15 });
    const $titleSkeleton = Skeleton({ width: 150, height: 20 });
    const $itemDesc = document.createElement("div");
    $itemDesc.className = "item-desc";
    $itemDesc.append($voteAverageSkeleton, $titleSkeleton);
    $item.append($imageSkeleton);
    $item.append($itemDesc);
    $li.append($item);
    $ul == null ? void 0 : $ul.append($li);
  }
  return $ul;
}
function TopRatedMovie({
  title,
  voteAverage
}) {
  const $topRatedMovie = document.createElement("div");
  $topRatedMovie.className = "top-rated-movie";
  $topRatedMovie.innerHTML = /*html*/
  `
    <div class="rate">
      <img src="./images/star_empty.png" class="star" alt="star_empty" />
      <span class="rate-value">${voteAverage}</span>
    </div>
    <div class="title">${title}</div>
  `;
  $topRatedMovie.append(
    Button({ className: "detail", textContent: "자세히 보기" })
  );
  return $topRatedMovie;
}
const isErrorResponse = (response) => {
  return "error" in response;
};
function handleApiResponse(response, onSuccess, onError) {
  if (isErrorResponse(response)) {
    onError == null ? void 0 : onError(response.error);
    return;
  }
  onSuccess(response);
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
      search: "search/movie"
    }
  }
};
const createMovieApiUrl = (endpoint, params) => {
  const searchParams = new URLSearchParams(params);
  return `${MOVIE_API.BaseUrl}/${endpoint}?${searchParams.toString()}`;
};
async function getMovies({ page }) {
  const url = createMovieApiUrl(MOVIE_API.endPoints.movies.popular, {
    language: "ko-KR",
    page: String(page)
  });
  return fetchWithErrorHandling(url);
}
async function searchMovies({ name, page }) {
  const url = createMovieApiUrl(MOVIE_API.endPoints.movies.search, {
    query: String(name),
    include_adult: "false",
    language: "ko-KR",
    page: String(page)
  });
  return fetchWithErrorHandling(url);
}
const store = {
  page: 1,
  totalPages: 1,
  movies: [],
  searchKeyword: ""
};
const $mainSection = document.querySelector("main section");
const $thumbnailList = document.querySelector(".thumbnail-list");
const $error = document.querySelector(".error");
const $errorMessage = document.querySelector(".error-message");
const showError = (error) => {
  $thumbnailList == null ? void 0 : $thumbnailList.classList.add("close");
  $error == null ? void 0 : $error.classList.remove("close");
  if ($errorMessage) $errorMessage.textContent = error;
};
const hideError = () => {
  $thumbnailList == null ? void 0 : $thumbnailList.classList.remove("close");
  $error == null ? void 0 : $error.classList.add("close");
};
const changeHeaderBackground = () => {
  const $backgroundContainer = document.querySelector(".background-container");
  if (store.searchKeyword === "") {
    const backgroundImage = store.movies[0].backdrop_path ? `${PREFIX_BACKDROP_PATH}${store.movies[0].backdrop_path}` : DEFAULT_TOP_RATED_DATA.backdropPath;
    $backgroundContainer.style.backgroundImage = `url(${backgroundImage})`;
  } else {
    $backgroundContainer.style.backgroundImage = "";
  }
};
const renderHeaderBackground = () => {
  if (!document.querySelector(".top-rated-movie")) {
    const $topRatedContainer = document.querySelector(".top-rated-container");
    $topRatedContainer == null ? void 0 : $topRatedContainer.append(
      TopRatedMovie({
        title: store.movies[0].title ?? DEFAULT_TOP_RATED_DATA.title,
        voteAverage: store.movies[0].vote_average ?? DEFAULT_TOP_RATED_DATA.voteAverage
      })
    );
  }
};
const renderTotalList = async () => {
  const moviesResponse = await getMovies({ page: store.page });
  handleApiResponse(
    moviesResponse,
    (data) => {
      store.movies = [...store.movies, ...data.results];
      store.totalPages = data.total_pages;
      renderHeaderBackground();
      changeHeaderBackground();
    },
    (error) => showError(error)
  );
};
const renderSearchList = async () => {
  changeHeaderBackground();
  const moviesResponse = await searchMovies({
    name: store.searchKeyword,
    page: store.page
  });
  handleApiResponse(
    moviesResponse,
    (data) => {
      store.movies = [...store.movies, ...data.results];
      store.totalPages = data.total_pages;
      store.movies.length === 0 ? showError("검색 결과가 없습니다.") : hideError();
    },
    (error) => showError(error)
  );
};
const renderMoviesList = async () => {
  const $skeleton = MovieListSkeleton();
  if ($skeleton) $mainSection == null ? void 0 : $mainSection.appendChild($skeleton);
  if (store.searchKeyword === "") await renderTotalList();
  else await renderSearchList();
  const $showMore = document.querySelector(".show-more");
  if (store.page !== Math.min(MAX_MOVIE_PAGE, store.totalPages))
    $showMore == null ? void 0 : $showMore.classList.add("open");
  else $showMore == null ? void 0 : $showMore.classList.remove("open");
  if ($thumbnailList) $thumbnailList.innerHTML = "";
  const $movies = MovieList(store.movies);
  if ($movies) $mainSection == null ? void 0 : $mainSection.appendChild($movies);
};
const isElement = (target) => {
  return target instanceof Element;
};
window.addEventListener("click", async (event) => {
  const { target } = event;
  if (!isElement(target) || !target.closest(".show-more")) return;
  store.page = store.page + 1;
  renderMoviesList();
});
window.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { target } = event;
  if (!isElement(target) || !target.closest(".top-rated-search")) return;
  const $searchInput = target.querySelector(
    ".top-rated-search-input"
  );
  const value = $searchInput == null ? void 0 : $searchInput.value;
  target.reset();
  if (!value) return;
  store.searchKeyword = value;
  store.page = 1;
  const $title = document.querySelector(".thumbnail-title");
  if ($title) $title.textContent = `"${store.searchKeyword}" 검색 결과`;
  const $ul = document.querySelector(".thumbnail-list");
  if ($ul) $ul.innerHTML = "";
  const $topRatedContainer = document.querySelector(".top-rated-container");
  const $overlay = document.querySelector(".overlay");
  $topRatedContainer == null ? void 0 : $topRatedContainer.classList.add("close");
  $overlay == null ? void 0 : $overlay.classList.add("close");
  store.movies = [];
  renderMoviesList();
});
addEventListener("load", async () => {
  const $container = document.querySelector(".container");
  $container == null ? void 0 : $container.appendChild(
    Button({ className: "show-more", textContent: "더 보기" })
  );
  renderMoviesList();
});
