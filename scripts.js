//selecting elements
const header = document.querySelector("header");
const navbar = document.querySelector(".navbar");
const staticsEl = document.querySelector(".statics");
const socialMediaItem = document.querySelectorAll(".footer__social-media-link");
const socialMediaItemContainer = document.querySelector(
  ".footer__social-media-link-list"
);
const shortLinkForm = document.querySelector(".shorten-link");
const shortLinkContainer = document.querySelector(".shorten-link-container");
const staticsContainer = document.querySelector(".statics-container");

//functions
const removeHorizontallyCenterClass = function () {
  const screenSize = window.innerWidth;

  if (screenSize >= 1400) {
    staticsEl.classList.remove("horizontaly-center");
  } else if (screenSize < 1400) {
    staticsEl.classList.add("horizontaly-center");
  }
};

//important variables
const eventArray = ["load", "resize"];
const socialMediaIconHandleEvents = ["mouseover", "mouseout"];
const url = "https://cleanuri.com/api/v1/shorten";

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

//changing the propery of the statics container when the url is submitted
shortLinkForm.addEventListener("submit", function (e) {
  e.preventDefault();

  staticsContainer.style.padding = `6.625rem 1rem 4.75rem`;

  shortLinkContainer.classList.remove("hidden");
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
const short = function () {
  const request = new XMLHttpRequest();

  request.open("POST", `https://cleanuri.com/api/v1/shorten`);

  request.send();

  request.addEventListener("load", function () {
    const [data] = JSON.parse(this.responseText);

    console.log(data);
  });
};
