/**
 * Knob.js
 *
 * Copyright (C) 2012 Ramon E. Torres <raymondjavaxx@gmail.com>
 * Licensed under The MIT License
 */

var Knob = function (canvas, sprite) {
  var self = this;

  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');

  this.mask = document.createElement('canvas');
  this.mask.width = this.canvas.width;
  this.mask.height = this.canvas.height;
  this.maskCtx = this.mask.getContext('2d');

  this.sprite = new Image;
  this.sprite.src = sprite;
  this.sprite.onload = function (e) {
    self.paint();
  };

  this.value = 0.0;
  this.capturing = false;

  var bindEvents = function (element, events, callback) {
    for (var i = 0; i < events.length; i++) {
      element.addEventListener(events[i], function (e) {
        callback.call(self, e);
      }, false);
    };
  };

  bindEvents(canvas, ['mousedown'], function (e) {
    if (e.target.setCapture) {
      e.target.setCapture();
    }

    this.capturing = true;
  });

  bindEvents(canvas, ['mouseup', 'mouseout'], function (e) {
    this.capturing = false;
  });

  bindEvents(canvas, ['mousemove'], this.onMouseMove);

  this.onChange = function (value) { };
};

Knob.prototype.onMouseMove = function (e) {
  e.preventDefault();

  if (this.capturing) {
    var movementY = e.movementY ||
                    e.mozMovementY ||
                    e.webkitMovementY;

    if (movementY > 0) {
      this.value -= 0.01;
    } else {
      this.value += 0.01;
    }

    if (this.value > 1.0) {
      this.value = 1.0;
    } else if (this.value < 0.0) {
      this.value = 0.0;
    }

    this.paint();
    this.onChange(this.value);
  }
};

Knob.prototype.setValue = function (value) {
  this.value = value;
  this.onChange(value);
  if (this.sprite.ready) {
    this.paint();
  }
};

Knob.prototype.paint = function () {
  var kSize = 229;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.drawImage(this.sprite, kSize * 1, 0, this.canvas.width, this.canvas.height, 0, 0, kSize, kSize);

  this.maskCtx.clearRect(0, 0, this.mask.width, this.mask.height);
  this.maskCtx.drawImage(this.sprite, 0, 0, this.canvas.width, this.canvas.height, 0, 0, kSize, kSize);

  this.maskCtx.save();
  this.maskCtx.beginPath();
  this.maskCtx.globalCompositeOperation = 'destination-out';
  this.maskCtx.translate(kSize/2, kSize/2)
  this.maskCtx.rotate(-90 * 0.0174532925);
  this.maskCtx.moveTo(0, 0);
  this.maskCtx.arc(0, 0, kSize/2, 0, (2 * Math.PI) * this.value, false);
  
  // this.maskCtx.shadowColor = "black";
  // this.maskCtx.shadowBlur = 8;
  // this.maskCtx.shadowOffsetX = 0;
  // this.maskCtx.shadowOffsetY = 0;
  this.maskCtx.fill();

  this.maskCtx.restore();

  this.ctx.drawImage(this.mask, 0, 0);

  this.ctx.save();
  this.ctx.translate(kSize/2, kSize/2)
  this.ctx.rotate(-90 * 0.0174532925);
  this.ctx.rotate((365 * this.value) * 0.0174532925);
  this.ctx.drawImage(this.sprite, kSize * 2, 0, this.canvas.width, this.canvas.height, -kSize/2, -kSize/2, kSize, kSize);
  this.ctx.restore();
};
