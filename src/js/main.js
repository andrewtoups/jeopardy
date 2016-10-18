
var addListeners = {
  game: function(self){
    $(self.elem).one('click', '.controls-1', function(){
      self.getQuestion();
    });
  }
};

//contructors:

var Game = function(){
  this.question = {};
  this.whiteNoise = whiteNoise;
  this.elem = this.display();
  addListeners.game(this);
  this.whiteNoise.turnOn();
};

Game.prototype = {
  display: function(){
    var tv = utils.template('#TV');
    return $(tv).appendTo('main');
  },

  getQuestion: function(){
    $.get('http://jservice.io/api/random').done((function(response){
      this.data = response;
      if (this.data[0].question !== '' && this.data[0].question.length <= 80){
        this.question = new Question(this);
      } else {
        this.getQuestion();
      }
    }).bind(this));
  }
};

var Question = function(gameObj){
  this.game = gameObj;
  this.parent = this.game.elem;
  this.rawAnswer = this.game.data[0].answer;
  this.answer = this.parseAnswer();
  this.question = this.game.data[0].question;
  this.category = this.game.data[0].category.title;
  this.value = this.game.data[0].value;
  console.log(this);
  this.display();
};

Question.prototype = {

  display: function(){
    $(this.game.elem).find('.monitor').html("<h3>"+ this.category + " for $" + this.value +"</h3> <p>"+ this.question +"</p>");
    $(this.game.elem).find('.monitor').toggleClass('on');
    this.game.whiteNoise.turnOff();
  },

  parseAnswer: function(){
    var words = this.rawAnswer.split(' ');
    if (words.length >= 2) {
      words = utils.stripWords(words);
    }
    return words;
  }
};

new Game();

// utils.displayTv();
// whiteNoise.turnOff();
