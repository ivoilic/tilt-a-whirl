/* eslint-env browser */
import { ready } from './utilities';

class App {
  constructor() {
    this.frame = 0;
    this.blackThreshold = 30;
    this.hidden = false;
    this.alive = true;
    this.cleared = false;
    this.sampleSize = 50;
    this.firstPass = true;
    this.screens = [];
    this.setup();
  }

  queryDomElements() {
    this.video = document.querySelector('#videoElement');
    this.startButton = document.querySelector('#start');
    this.readyButton = document.querySelector('#ready');
    this.screens[0] = document.querySelector('#screen-0');
    this.screens[1] = document.querySelector('#screen-1');
    this.screens[2] = document.querySelector('#screen-2');
    this.result = document.querySelector('#result');

    // this.video = document.createElement('video');
    // this.video.autoplay = true;
    // this.video.playsinline = 'true';
    // this.video.muted = 'true';
    // this.video.id = 'videoElement';
    // document.body.appendChild(this.video);
  }

  addEventListeners() {
    this.startButton.addEventListener('click', this.openSection.bind(this, 1));
    this.readyButton.addEventListener('click', this.openSection.bind(this, 2));
  }

  clearResult() {
    this.cleared = true;
    this.updateResult();
  }

  randomizeResult() {
    this.cleared = false;
    this.alive = Math.random() > 0.5;
    if (this.firstPass) {
      this.firstPass = false;
      this.alive = true;
    }
    this.updateResult();
  }

  updateResult() {
    // eslint-disable-next-line no-nested-ternary
    this.result.innerHTML = this.cleared ? '' : this.alive ? 'Alive' : 'Dead';
  }

  setup() {
    this.queryDomElements();
    this.addEventListeners();

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          this.video.srcObject = stream;
          this.setupCanvas();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  openSection(id) {
    this.screens[id - 1].classList.remove('active');
    this.screens[id].classList.add('active');
    this.screens[id].classList.remove('waiting');
  }

  setupCanvas() {
    this.canvas = document.getElementById('sensorCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.render();
  }

  render() {
    clearTimeout(this.renderTimeout);

    this.frame += 1;
    // console.log(this.frame);
    this.ctx.drawImage(this.video, 0, 0, this.sampleSize, this.sampleSize);

    let hidden = true;

    for (let x = 0; x < this.sampleSize; x += 1) {
      if (!hidden) {
        break;
      }
      for (let y = 0; y < this.sampleSize; y += 1) {
        if (!hidden) {
          break;
        }
        const samplePoint = this.ctx.getImageData(x, y, 1, 1).data;
        if (
          samplePoint[0] > this.blackThreshold &&
          samplePoint[1] > this.blackThreshold &&
          samplePoint[2] > this.blackThreshold
        ) {
          hidden = false;
        }
      }
    }

    if (this.hidden) {
      if (hidden) {
        this.clearResult();
      } else {
        this.randomizeResult();
      }
    }

    this.hidden = hidden;

    this.renderTimeout = setTimeout(() => {
      this.render();
    }, 10);
  }
}

ready(() => {
  const app = new App();
});
