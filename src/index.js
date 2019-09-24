/* eslint-env browser */
import { ready } from './utilities';

class App {
  constructor() {
    this.setup();
    this.frame = 0;
    this.blackThreshold = 30;
    this.hidden = false;
    this.sampleSize = 50;
  }

  setup() {
    this.video = document.querySelector('#videoElement');

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

    this.hidden = true;

    for (let x = 0; x < this.sampleSize; x += 1) {
      if (!this.hidden) {
        break;
      }
      for (let y = 0; y < this.sampleSize; y += 1) {
        if (!this.hidden) {
          break;
        }
        const samplePoint = this.ctx.getImageData(x, y, 1, 1).data;
        if (
          samplePoint[0] > this.blackThreshold &&
          samplePoint[1] > this.blackThreshold &&
          samplePoint[2] > this.blackThreshold
        ) {
          this.hidden = false;
        }
      }
    }

    this.renderTimeout = setTimeout(() => {
      this.render();
    }, 10);
  }
}

ready(() => {
  const app = new App();
});
