/*
A vintage TV.
Made by Kevin Jannis (@kevinjannis)
View more at www.janniskev.in

Inspired by: https://dribbble.com/shots/1631288-Vintage-TV
*/

var whiteNoise = {

  switch: false,

  generateNoise: function(opacity, h, w){
    function fakeCanvas(h, w) {
      var canvas = document.createElement('canvas');
      canvas.height = h;
      canvas.width = w;
      return canvas;
    }

    function randomise(data, opacity) {
      var i, x;
      for (i = 0; i < data.length; ++i) {
        x = Math.floor(Math.random() * 0xffffff);
        data[i] = x | opacity;
      }
    }

    function generate(opacity, h, w) {
      var canvas = fakeCanvas(h, w),
      context = canvas.getContext('2d'),
      image = context.createImageData(h, w),
      data = new Uint32Array(image.data.buffer);

      opacity = Math.floor(opacity * 0x255) << 24;

      return function() {
        randomise(data, opacity);
        context.putImageData(image, 0, 0);
        var screen = document.getElementsByClassName('screen')[0];
        screen.style.backgroundImage = 'url("' + canvas.toDataURL('image/png') + '")';
      };
    }

    return generate(opacity || 0.2, h || 55, w || 55);
  },

  turnOn: function(){
    whiteNoise.switch = true;
    whiteNoise.loop();
  },

  turnOff: function(){
    whiteNoise.switch = false;
  },

  loop: function() {
    if (whiteNoise.switch) {
      var noise = whiteNoise.generateNoise(0.13, 173, 147);
      noise();

      if (window.requestAnimationFrame) {
        requestAnimationFrame(whiteNoise.loop);
      } else {
        setTimeout(whiteNoise.loop, 30); // About 33 fps
      }
    } else {
      return;
    }
  },

};
