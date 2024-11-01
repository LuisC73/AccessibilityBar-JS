"use strict";
import { options } from "./options/index.js";

const assetsDir = '/src/assets/';
const rootContainer = document.getElementById('root');
const screenReader = document.getElementById("screen-reader");
const bodyElement = document.querySelector('body');
let isNarratorActive = false;

const returnTag = (e) => {
  let tag = e.srcElement ? e.srcElement.tagName : e.target.type;
  return tag;
};

const returnText = (e) => {
  if (
    returnTag(e) == "P" ||
    returnTag(e) == "H1" ||
    returnTag(e) == "H2" ||
    returnTag(e) == "H3" ||
    returnTag(e) == "H4" ||
    returnTag(e) == "H5" ||
    returnTag(e) == "H6" ||
    returnTag(e) == "A" ||
    returnTag(e) == "LI" ||
    returnTag(e) == "SPAN" ||
    returnTag(e) == "STRONG" ||
    returnTag(e) == "BUTTON" ||
    returnTag(e) == "SELECT" ||
    returnTag(e) == "LABEL" ||
    returnTag(e) == "TD" ||
    returnTag(e) == "B"
  ) {
    return e.target.textContent;
  } else if (returnTag(e) == "DIV" && e.target.textContent.length <= 100) {
    return e.target.textContent;
  } else if (returnTag(e) == "IMG" && e.target.getAttribute("alt")) {
    return e.target.getAttribute("alt");
  } else if (returnTag(e) == "INPUT" && e.target.getAttribute("value")) {
    return e.target.getAttribute("value");
  } else if (returnTag(e) == "A" && e.target.getAttribute("aria-label")) {
    return e.target.getAttribute("aria-label");
  } else if (returnTag(e) == "INPUT" && e.target.getAttribute("placeholder")) {
    return e.target.getAttribute("placeholder");
  } else {
    return "";
  }
};

const handleClickOpenBar = () => {
  screenReader.classList.toggle('active');
};

const speechUtterance = (action = 'create') => {
  const speak = new SpeechSynthesisUtterance();
  isNarratorActive = action === 'reset' ? false : !isNarratorActive;

  if (isNarratorActive) {
    speak.lang = "es-ES";
    speak.rate = 1.3;
    let speakerOnOff = true;
    let mediaQuery = window.matchMedia("(max-width: 800px)");

    if (mediaQuery.matches) {
      bodyElement.addEventListener("click", speakHandler);
      bodyElement.addEventListener("mouseout", cancelSpeech);
    } else {
      bodyElement.addEventListener("mouseover", speakHandler);
      bodyElement.addEventListener("mouseout", cancelSpeech);
    }

    function speakHandler(e) {
      if (returnText(e) != "") {
        speak.text = returnText(e);
        if (speakerOnOff) {
          speechSynthesis.speak(speak);
        }
      }
    }

    function cancelSpeech() {
      speechSynthesis.cancel();
    }

    speechUtterance.speakHandler = speakHandler;
    speechUtterance.cancelSpeech = cancelSpeech;
  } else {
    bodyElement.removeEventListener("click", speechUtterance.speakHandler);
    bodyElement.removeEventListener("mouseover", speechUtterance.speakHandler);
    bodyElement.removeEventListener("mouseout", speechUtterance.cancelSpeech);
    speechSynthesis.cancel();
  }
};

const changeFontSize = (action) => {
  const root = document.documentElement;
  const currentFontSize = parseFloat(getComputedStyle(root).fontSize);

  if (action === 'increase' && currentFontSize <= 22) {
    root.style.fontSize = `${currentFontSize * 1.1}px`;
  } else if (action === 'decrease' && currentFontSize >= 10) {
    root.style.fontSize = `${currentFontSize * 0.9}px`;
    console.log(currentFontSize);
  } else if (action === 'reset') {
    root.style.fontSize = '';
  }
};

const changeLetterSpacing = (action) => {
  const root = document.documentElement;
  const currentLetterSpacing = parseFloat(getComputedStyle(root).letterSpacing) || 0;

  if (action === 'increase') {
    root.style.letterSpacing = `${currentLetterSpacing + 0.5}px`;
  } else if (action === 'decrease') {
    root.style.letterSpacing = `${currentLetterSpacing - 0.5}px`;
  } else if (action === 'reset') {
    root.style.letterSpacing = '';
  }
};

const applyGreyTone = () => {
  rootContainer.classList.toggle('grey-scale');
};

const applyContrastTone = () => {
  rootContainer.classList.toggle('high-contrast');
  bodyElement.classList.toggle('high-contrast-bg')
};

const applyDyslexicFont = () => {
  rootContainer.classList.toggle('font-dyslexic')
};

const applyBigCursor = () => {
  rootContainer.classList.toggle('big-cursor');
};

const applyHighlightLink = () => {
  rootContainer.classList.toggle('highlight-links');
};

const restartState = () => {
  speechUtterance('reset');
  changeFontSize('reset');
  changeLetterSpacing('reset');
  rootContainer.classList.remove('grey-scale', 'high-contrast', 'font-dyslexic', 'big-cursor', 'highlight-links');
  bodyElement.classList.remove('high-contrast-bg')
};

const handleClickAction = (id) => {
  const actions = Object.freeze({
    'toggle-bar': handleClickOpenBar,
    'narrator': speechUtterance,
    'increase_text': () => changeFontSize('increase'),
    'decrease_text': () => changeFontSize('decrease'),
    'increse_spacing_text': () => changeLetterSpacing('increase'),
    'decrease_spacing_text': () => changeLetterSpacing('decrease'),
    'grey_scale': applyGreyTone,
    'high_contrast': applyContrastTone,
    'dyslexic__font': applyDyslexicFont,
    'big_cursor': applyBigCursor,
    'highlight_links': applyHighlightLink,
    'reset_all': restartState
  });

  const action = actions[id];
  if (action) action();
};

const createElement = (tag, classes = [], attributes = {}, textContent = '') => {
  const element = document.createElement(tag);
  if (classes.length) element.classList.add(...classes);
  if (textContent) element.textContent = textContent;
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

const createDesign = (container, options) => {
  container.classList.add('screen-reader');
  const imageContainer = createElement('div', ['screen-reader__image-container'], { id: 'toggle-bar' });
  const image = createElement('img', ['screen-reader__image'], {
    src: `${assetsDir}/icons/logo.svg`,
    alt: 'Botón para abrir barra de accesibilidad'
  });

  const contentContainer = createElement('div', ['screen-reader__content']);
  const title = createElement('h3', ['screen-reader__title'], {}, 'Accesibilidad');
  const optionsContainer = createElement('ul', ['screen-reader__ul']);
  const fragmentOptions = document.createDocumentFragment();

  if (options?.length > 0) {
    const optionLink = options.find(option => option?.id === 'relay_centre');
    const newOptions = options.filter(option => option?.id !== 'relay_centre');

    newOptions.forEach(option => {
      const liElement = createElement('li', ['screen-reader__li']);
      const buttonElement = createElement('button', ['screen-reader__button'], { id: option?.id });
      const spanElement = createElement('span', ['screen-reader__span', `screen-reader__span--${option?.icon}`]);
      buttonElement.append(spanElement, option?.label);
      liElement.appendChild(buttonElement);
      fragmentOptions.appendChild(liElement);
    });

    const liElementLink = createElement('li', ['screen-reader__li'], { id: optionLink?.id });
    const spanElementLink = createElement('span', ['screen-reader__span', `screen-reader__span--${optionLink?.icon}`]);
    const linkElement = createElement('a', ['screen-reader__a'], {
      href: 'https://centroderelevo.gov.co/632/w3-channel.html',
      title: 'Ingresar a la página oficial de centro de relevo',
      target: '_blank'
    }, optionLink?.label);

    liElementLink.append(spanElementLink, linkElement);
    fragmentOptions.appendChild(liElementLink);
  }

  optionsContainer.appendChild(fragmentOptions);
  contentContainer.append(title, optionsContainer);
  imageContainer.appendChild(image);
  container.append(imageContainer, contentContainer);
};

createDesign(screenReader, options);

screenReader.addEventListener('click', (e) => handleClickAction(e.target.id));
screenReader.addEventListener('keypress', (e) => e.key === 'enter' && handleClickAction(e.target.id));