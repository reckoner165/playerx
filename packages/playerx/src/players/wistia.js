// https://wistia.com/support/developers/player-api

import { define } from '../define.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { createElement } from '../utils/dom.js';
import { options } from '../options.js';
export { options };

const API_URL = 'https://fast.wistia.com/assets/external/E-v1.js';
const API_GLOBAL = 'Wistia';
const MATCH_URL = /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/;

wistia.canPlay = src => MATCH_URL.test(src);

export function wistia(element) {
  let api;
  let div;
  let ready = publicPromise();
  let style = createResponsiveStyle(element, 'div');

  function getOptions() {
    return {
      autoPlay: element.playing || element.autoplay,
      muted: element.muted,
      preload: element.preload,
      playsinline: element.playsinline,
      endVideoBehavior: element.loop && 'loop',
      chromeless: !element.controls,
      playButton: element.controls,
      ...element.config.wistia,
    };
  }

  function getVideoId(src) {
    let match;
    return (match = src.match(MATCH_URL)) && match[1];
  }

  async function init() {
    const options = getOptions();
    const id = getVideoId(element.src);

    div = createElement('div', {
      class: `wistia_embed wistia_async_${id}`,
    });

    const onReadyPromise = publicPromise();
    const onReady = onReadyPromise.resolve;

    await loadScript(API_URL, API_GLOBAL);
    window._wq.push({
      id,
      options,
      onReady
    });

    api = await onReadyPromise;

    api.elem().addEventListener('play', () => {
      element.fire('play');
    });

    api.elem().addEventListener('durationchange', () => {
      element.fire('durationchange');
    });

    ready.resolve();
  }

  const eventAliases = {
    playing: 'play',
    ratechange: 'playbackratechange',
    timeupdate: 'timechange',
    ended: 'end',
  };

  const customEvents = {
    play: undefined,
    durationchange: undefined,
  };

  const methods = {

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    stop() {
      api.rebuild();
    },

    on(eventName, callback) {
      if (eventName in customEvents) return;
      api.bind(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      api.unbind(eventAliases[eventName] || eventName, callback);
    },

    set src(src) {
      style.update(element);
      element.load();

      // `api.replaceWith` works but does strange things with resizing ;(
      // api.replaceWith(getVideoId(src), getOptions());
    },

    set currentTime(seconds) {
      api.time(seconds);
    },

    get currentTime() {
      return api.time();
    },

    get buffered() {
      return api.elem().buffered;
    },

    set controls(controls) {
      api.bigPlayButtonEnabled(controls);
      controls ? api.releaseChromeless() : api.requestChromeless();
    },

    set muted(muted) {
      muted ? api.mute() : api.unmute();
    },

    get muted() {
      return api.isMuted();
    },
  };

  init();

  return extend(style.methods, methods);
}

export const Vimeo = define('player-wistia', wistia);