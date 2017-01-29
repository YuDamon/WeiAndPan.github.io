function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.letterContainer  = document.querySelector(".letter");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
  this.clearLetter();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);
  if (tile.who === "Wei")
    inner.classList.add("tile-inner");
  else
    inner.classList.add("tile-inner2");
  //inner.textContent = tile.value+tile.who;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

var content1 = "Dear 湾, ";
var content2 = "Happy birthday! Hope that this website brings happyness to you. In the past two and a half years, we experienced many difficulties and shared more happyness. Thanks a lot for the beautiful experience of having you around me. It is you that give me the reason and courage to be a better man. ";
var content3 = "Finding someone to spend life with is not easy. But after going through so much, I believe that you are the right one. You have your own life and choice. I'll wait till you have your answer. ";
var content4 = "Again, happy birthday! And I hope fulfilling and rosy your new 2017 will be! ";
var content5 = "Love from, ";
var content6 = "棒棒 ";
var count = 0;
var progress = 1;
var ele1 = document.getElementById("letter1");
var ele2 = document.getElementById("letter2");
var ele3 = document.getElementById("letter3");
var ele4 = document.getElementById("letter4");
var ele5 = document.getElementById("letter5");
var ele6 = document.getElementById("letter6");

HTMLActuator.prototype.showLetter = function () {
  var self = this;
  this.clearMessage();
  this.letterContainer.classList.add("game-won");
  requestAnimationFrame(Letter1);
};

Letter1 = function () {
  count += 1;
  if (count >= 6) {
    progress += 1;
    count = 0;
  }
  if (progress < content1.length) {
    ele1.innerHTML = content1.substr(0,progress);
	ele2.innerHTML = " ";
	ele3.innerHTML = " ";
	ele4.innerHTML = " ";
	ele5.innerHTML = " ";
	ele6.innerHTML = " ";
  } else if (progress < content1.length + content2.length) {
    ele2.innerHTML = content2.substr(0,progress - content1.length);
  } else if (progress < content1.length + content2.length + content3.length) {
    ele3.innerHTML = content3.substr(0,progress - content1.length - content2.length);
  } else if (progress < content1.length + content2.length + content3.length + content4.length) {
    ele4.innerHTML = content4.substr(0,progress - content1.length - content2.length - content3.length);
  } else if (progress < content1.length + content2.length + content3.length + content4.length + content5.length) {
    ele5.innerHTML = content5.substr(0,progress - content1.length - content2.length - content3.length - content4.length);
  } else {
    ele6.innerHTML = content6.substr(0,progress - content1.length - content2.length - content3.length - content4.length - content5.length);
  }

  if (progress < content1.length + content2.length + content3.length + content4.length + content5.length + content6.length) {
    requestAnimationFrame(Letter1);
  }
};

HTMLActuator.prototype.clearLetter = function () {
  // IE only takes one value to remove at a time.
  this.letterContainer.classList.remove("game-won");
  count = 0;
  progress = 1;
};