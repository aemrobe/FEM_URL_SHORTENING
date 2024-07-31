//selecting elements
const header = document.querySelector("header");
const navbar = document.querySelector(".navbar");
const staticsEl = document.querySelector(".statics");
const socialMediaItem = document.querySelectorAll(".footer__social-media-link");
const socialMediaItemContainer = document.querySelector(
  ".footer__social-media-link-list"
);
const shortLinkForm = document.querySelector(".shorten-link");
const shortLinkInput = document.querySelector(".shorten-link__input");
const shortLinkContainer = document.querySelector(".shorten-link-container");
const staticsContainer = document.querySelector(".statics-container");
const errorMessage = document.querySelector(".err");

//functions
const removeHorizontallyCenterClass = function () {
  const screenSize = window.innerWidth;

  if (screenSize >= 1400) {
    staticsEl.classList.remove("horizontaly-center");
  } else if (screenSize < 1400) {
    staticsEl.classList.add("horizontaly-center");
  }
};

const showErrorMessage = function (err) {
  shortLinkInput.classList.add("error");
  errorMessage.classList.remove("hidden");
  errorMessage.textContent = `${err}`;

  staticsContainer.style.padding = `7.625rem 1rem 7.3rem`;
};

const hideErrorMessage = function () {
  shortLinkInput.classList.remove("error");
  errorMessage.classList.add("hidden");
  shortLinkForm.inputLink.value = "";
  staticsContainer.style.padding = `6.625rem 1rem 7.3rem`;
  shortLinkContainer.classList.remove("hidden");
};

const renderShortenUrl = function (state) {
  const html = state
    .map((el) => {
      console.log(el);
      return ` <!--Shorten Link-->
       <div class="shorten-link-container__link">
              <a 
              href="${el.originalUrl}"
              class="shorten-link-container__text">
                ${el.originalUrl}
              </a>

              <a
                href="${el.shortUrl}"
                class="shorten-link-container__text shorten-link-container__text--shorten"
              >
                ${el.shortUrl}
              </a>

              <button class="primay-btn copy-btn">Copy</button>
            </div>`;
    })
    .join("");

  shortLinkContainer.innerHTML = "";

  shortLinkContainer.insertAdjacentHTML("beforeend", html);
};

const renderSpinner = function () {
  const html = `<div class="spinner">
      <svg>
        <use href="./images/icons.svg#icon-loader"></use>
      </svg>
    </div>`;

  shortLinkContainer.innerHTML = "";

  shortLinkContainer.insertAdjacentHTML("beforeend", html);
};

//important variables
const eventArray = ["load", "resize"];
const socialMediaIconHandleEvents = ["mouseover", "mouseout"];
const state = [];

eventArray.forEach((ev) => {
  //remove horizontally center class
  window.addEventListener(ev, removeHorizontallyCenterClass);
});

//changing the color of social media icons when they are hovered on
const handleMobileNavbar = function (ev) {
  socialMediaItemContainer.addEventListener(ev, function (e) {
    const socialMediaIcon = e.target.closest(".footer__social-media-link");

    const socialMediaImg = socialMediaIcon.querySelector("img");

    if (!socialMediaImg) return;

    const newSrc =
      ev === "mouseover"
        ? socialMediaImg.src.slice(0, -4) + "-cyan.svg"
        : socialMediaImg.src.slice(0, -9) + ".svg";

    socialMediaImg.src = newSrc;
  });
};

socialMediaIconHandleEvents.forEach((ev) => {
  handleMobileNavbar(ev);
});

//handling the mobile menu
header.addEventListener("click", function (e) {
  const menubar = e.target.closest(".menubar");

  //when you click outside of the menubar it returns
  if (!menubar) return;

  if (!navbar.classList.contains("display-navbar")) {
    navbar.classList.add("display-navbar");
    navbar.classList.remove("not-open");
    navbar.classList.remove("hide-navbar");
  } else {
    navbar.classList.add("hide-navbar");
    navbar.classList.remove("display-navbar");

    setTimeout(function () {
      navbar.classList.add("not-open");
      navbar.classList.remove("hide-navbar");
    }, 500);
  }
});

//shortening the url
const shortenUrl = async function (url) {
  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`);

    //when there is incorrect url
    if (!res.ok) throw new Error("Incorrect url");

    const data = await res.text();

    return data;
  } catch (err) {
    throw err;
  }
};

shortLinkForm.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();

    const inputLink = shortLinkForm.inputLink;

    //when the input is null
    if (inputLink.value === "") throw new Error("Please add a link");

    //when there is no error
    const originalUrl = inputLink.value.trim();

    renderSpinner();

    const shortUrl = await shortenUrl(originalUrl);

    hideErrorMessage();

    state.push({ originalUrl, shortUrl });

    renderShortenUrl(state);
  } catch (err) {
    showErrorMessage(err.message);
  }
});
