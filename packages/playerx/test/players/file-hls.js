import { testPlayer } from '../player.js';

const src = 'https://stream.mux.com/LvkSQ3bpRjLS9sCIzJlpccO9TW6dP3At00ypl6SXKrgM.m3u8';
const duration = 46;

const tests = {
  play: true,
};

testPlayer({ src, duration, tests });
