"use strict";
import './styles/accessibility-bar.css';
import logo from './icons/logo.svg';
import { CONTENT_ES, CONTENT_EN } from "./options/index.js";

function createAccessibilityBar(container, config = {}) {
  const DEFAULT_LANGUAGE = 'es';
  const rootElement = document.getElementById('app');
  const bodyElement = document.body;
  let isNarratorEnabled = false;

  const createLanguageConfig = (config) => {
    const languageContentMap = {
      es: CONTENT_ES,
      en: CONTENT_EN
    };

    const { options: fallbackOptions, ...content } = languageContentMap[config.language] || languageContentMap[DEFAULT_LANGUAGE];

    return {
      language: config.language || DEFAULT_LANGUAGE,
      options: config.options || fallbackOptions,
      content
    };
  };

  const appConfig = createLanguageConfig(config);

  const getTextContent = (e) => {
    const tagsWithTextContent = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'LI', 'SPAN', 'STRONG', 'BUTTON', 'SELECT', 'LABEL', 'TD', 'B']);

    const tagName = e.target.tagName || e.srcElement.tagName;

    if (tagsWithTextContent.has(tagName)) return e.target.textContent;

    if (tagName === 'DIV' && e.target.textContent.length <= 100) return e.target.textContent;

    if (tagName === 'IMG' && e.target.alt) return e.target.alt || '';

    if (tagName === 'INPUT') return e.target.value || e.target.placeholder || '';

    if (tagName === 'A' && e.target.getAttribute('aria-label')) return e.target.getAttribute('aria-label') || '';

    return '';
  };

  const toggleScreenReaderBar = () => {
    container.classList.toggle('active');
  };

  const handleSpeechUtterance = (action = 'create') => {
    const speech = new SpeechSynthesisUtterance();
    isNarratorEnabled = action === 'reset' ? false : !isNarratorEnabled;
    sessionStorage.setItem("isNarratorEnabled", isNarratorEnabled);
    const itemMenu = container.querySelector('.screen-reader__span--narrator-play');

    if (isNarratorEnabled) {
      speech.lang = config?.content?.narrator_language;
      speech.rate = 1.3;
      let mediaQuery = window.matchMedia("(max-width: 800px)");

      const eventType = mediaQuery.matches ? "click" : "mouseover";

      bodyElement.addEventListener(eventType, handleSpeech);
      bodyElement.addEventListener("mouseout", stopSpeech);
      itemMenu.classList.add('screen-reader__span--narrator-stop')

      function handleSpeech(event) {
        const textToSpeak = getTextContent(event);
        if (textToSpeak !== "") {
          speech.text = textToSpeak;
          speechSynthesis.speak(speech);
        }
      }

      function stopSpeech() {
        speechSynthesis.cancel();
      }

      handleSpeechUtterance.handleSpeech = handleSpeech;
      handleSpeechUtterance.stopSpeech = stopSpeech;
    } else {
      bodyElement.removeEventListener("click", handleSpeechUtterance.handleSpeech);
      bodyElement.removeEventListener("mouseover", handleSpeechUtterance.handleSpeech);
      bodyElement.removeEventListener("mouseout", handleSpeechUtterance.stopSpeech);
      itemMenu.classList.remove('screen-reader__span--narrator-stop')
      speechSynthesis.cancel();
    }
  };

  const initializeSpeechUtterance = () => {
    const isActive = sessionStorage.getItem("isNarratorEnabled") === 'true';
    if (isActive) handleSpeechUtterance();
  };

  const adjustFontSize = (action) => {
    const rootElement = document.documentElement;
    const currentFontSize = parseFloat(getComputedStyle(rootElement).fontSize);

    if (action === 'increase' && currentFontSize <= 22) {
      rootElement.style.fontSize = `${(currentFontSize * 1.1).toFixed(2)}px`;
    } else if (action === 'decrease' && currentFontSize >= 10) {
      rootElement.style.fontSize = `${(currentFontSize * 0.9).toFixed(2)}px`;
    } else if (action === 'reset') {
      rootElement.style.fontSize = '';
    }
  };

  const adjustLetterSpacing = (action) => {
    const rootElement = document.documentElement;
    const currentLetterSpacing = parseFloat(getComputedStyle(rootElement).letterSpacing) || 0;

    if (action === 'increase' && currentLetterSpacing <= 3.5) {
      rootElement.style.letterSpacing = `${(currentLetterSpacing + 0.5).toFixed(2)}px`;
    } else if (action === 'decrease' && currentLetterSpacing >= -1.5) {
      rootElement.style.letterSpacing = `${(currentLetterSpacing - 0.5).toFixed(2)}px`;
      console.log(currentLetterSpacing);
    } else if (action === 'reset') {
      rootElement.style.letterSpacing = '';
    }
  };

  const toggleGreyScale = () => {
    rootElement.classList.toggle('grey-scale');
  };

  const toggleHighContrast = () => {
    rootElement.classList.toggle('high-contrast');
    bodyElement.classList.toggle('high-contrast-bg');
  };

  const toggleDyslexicFont = () => {
    rootElement.classList.toggle('font-dyslexic');
  };

  const toggleBigCursor = () => {
    rootElement.classList.toggle('big-cursor');
  };

  const toggleHighlightLinks = () => {
    rootElement.classList.toggle('highlight-links');
  };

  const resetAllSettings = () => {
    handleSpeechUtterance('reset');
    adjustFontSize('reset');
    adjustLetterSpacing('reset');
    rootElement.classList.remove(
      'grey-scale',
      'high-contrast',
      'font-dyslexic',
      'big-cursor',
      'highlight-links'
    );
    bodyElement.classList.remove('high-contrast-bg');
  };

  const handleUserAction = (actionId) => {
    const actionHandlers = Object.freeze({
      'toggle-button': toggleScreenReaderBar,
      'narrator': handleSpeechUtterance,
      'increase_text': () => adjustFontSize('increase'),
      'decrease_text': () => adjustFontSize('decrease'),
      'increase_spacing_text': () => adjustLetterSpacing('increase'),
      'decrease_spacing_text': () => adjustLetterSpacing('decrease'),
      'grey_scale': toggleGreyScale,
      'high_contrast': toggleHighContrast,
      'dyslexic_font': toggleDyslexicFont,
      'big_cursor': toggleBigCursor,
      'highlight_links': toggleHighlightLinks,
      'reset_all': resetAllSettings
    });

    const action = actionHandlers[actionId];
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

  const createAccessibilityDesign = () => {
    container.classList.add('screen-reader');

    const imageContainer = createElement('button', ['screen-reader__toggle-button'], { id: 'toggle-button' });
    const logoImage = createElement('img', ['screen-reader__image'], {
      src: logo,
      alt: appConfig?.content?.image_alt
    });

    const contentContainer = createElement('div', ['screen-reader__content']);
    const titleElement = createElement('h3', ['screen-reader__title'], {}, appConfig?.content?.title);
    const optionsList = createElement('ul', ['screen-reader__ul']);
    const fragment = document.createDocumentFragment();

    if (appConfig?.options?.length > 0) {
      const relayCentreOption = appConfig.options.find(option => option?.id === 'relay_centre');
      const otherOptions = appConfig.options.filter(option => option?.id !== 'relay_centre');

      otherOptions.forEach(option => {
        const listItem = createElement('li', ['screen-reader__li']);
        const buttonElement = createElement('button', ['screen-reader__button'], { id: option?.id });
        const iconSpan = createElement('span', ['screen-reader__span', `screen-reader__span--${option?.icon}`]);
        buttonElement.append(iconSpan, option?.label);
        listItem.appendChild(buttonElement);
        fragment.appendChild(listItem);
      });

      if (relayCentreOption) {
        const relayCentreItem = createElement('li', ['screen-reader__li'], { id: relayCentreOption?.id });
        const relayCentreIcon = createElement('span', ['screen-reader__span', `screen-reader__span--${relayCentreOption?.icon}`]);
        const relayCentreLink = createElement('a', ['screen-reader__a'], {
          href: 'https://centroderelevo.gov.co/632/w3-channel.html',
          title: appConfig?.content?.relay_title,
          target: '_blank'
        }, relayCentreOption?.label);

        relayCentreItem.append(relayCentreIcon, relayCentreLink);
        fragment.appendChild(relayCentreItem);
      }
    }

    optionsList.appendChild(fragment);
    contentContainer.append(titleElement, optionsList);
    imageContainer.appendChild(logoImage);
    container.append(imageContainer, contentContainer);
  };

  document.addEventListener('DOMContentLoaded', () => {
    createAccessibilityDesign();
    initializeSpeechUtterance();
    container.addEventListener('click', (e) => handleUserAction(e.target.id));
    container.addEventListener('keypress', (e) => e.key === 'enter' && handleUserAction(e.target.id));
  })
}

export {
  createAccessibilityBar
}