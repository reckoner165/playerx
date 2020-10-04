/**
 * Copyright (c) 2020, Wesley Luyten, @luwes
 * @see LICENSE
 */
import * as Events from './constants/events.js';
import { version } from './constants/version.js';
import * as VideoEvents from './constants/video-events.js';
import { options } from './options.js';

export * from 'swiss';
export { addCssRule, getStyle } from './utils/css.js';
export { loadScript } from './utils/load-script.js';
export { Playerx } from './playerx.js';
export {
  Events,
  VideoEvents,
  options,
  version
};