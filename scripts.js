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

//important variables
const eventArray = ["load", "resize"];

const socialMediaIconHandleEvents = ["mouseover", "mouseout"];
let state = [];

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
  shortLinkContainer.classList.add("hidden");

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

const addToLocalStorage = function () {
  localStorage.setItem("urls", JSON.stringify(state));
};

const clearFromLocalStorage = function () {
  localStorage.clear("urls");
};

//getting the urls from the localstorage
const init = function () {
  const urls = localStorage.getItem("urls");

  if (urls) {
    state = JSON.parse(urls);
  }
};

init();

//copy The Shortened Link To Clipboard
const copyTextToTheClipboard = function (text, copyBtn) {
  navigator.clipboard
    .writeText(text)
    .then(function () {
      //## when the copying action is successful ##

      const copyBtns = document.querySelectorAll(".copy-btn");

      //removing the class from the other copy elements
      copyBtns.forEach((el) => {
        el.classList.remove("copy-btn--black");
        el.textContent = "Copy";
      });

      //add the class to the copy btn which is clicked
      copyBtn.classList.add("copy-btn--black");
      copyBtn.classList.remove("errorCopy");
      copyBtn.textContent = "Copied";
    })
    .catch(function (err) {
      //## when the copying action is unsuccessful ##

      copyBtn.textContent = "Not copied!";
      copyBtn.classList.add("errorCopy");
    });
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

//executing the copytexttotheclipboard function when the copy btn is clicked
shortLinkContainer.addEventListener("click", function (e) {
  const copyBtn = e.target.closest(".copy-btn");

  //returning when the user clicks outside of the copy button
  if (!copyBtn) return;

  const shortenedLink = copyBtn.previousElementSibling.textContent.trim();

  copyTextToTheClipboard(shortenedLink, copyBtn);
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

    addToLocalStorage();

    renderShortenUrl(state);
  } catch (err) {
    showErrorMessage(err.message);
  }
});
