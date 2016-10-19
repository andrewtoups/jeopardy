
var addListeners = {
  game: function(self){
    $(self.elem)
      .one('click', '.controls-1', function(){
        self.getQuestion();
      });
  },
  question: function(self){
    $(self.elem)
    .one('submit', '.answer-box', function(event){
      event.preventDefault();
      var answer = $('.answer-field').val();
      $('.answer-field').val('');
      console.log('gonna check that answer: ' + answer);
      $(self.elem).find('.answer-box').toggleClass('popUp');
      self.question.win = self.question.checkAnswer(answer);
      self.summonTrebek();
    });
  }
};

//contructors:

var Game = function(){
  this.question = {};
  this.score = 0;
  this.whiteNoise = whiteNoise;
  this.elem = this.display();
  addListeners.game(this);
  this.whiteNoise.turnOn();
};

Game.prototype = {

  display: function(){
    var tv = utils.template('#TV');
    return $(tv).prependTo('main');
  },

  getQuestion: function(){
    $.get('http://jservice.io/api/random').done((function(response){
      this.data = response;
      if (this.data[0].question !== '' &&
      this.data[0].question.length <= 80 &&
      this.data[0].value !== null){
        if (this.question.win) {
          $(this.elem).find('.monitor').toggleClass(this.question.win);
          this.monitorOff(function(){
            this.question = new Question(this);
          });
        } else {
        this.question = new Question(this);
        }
      } else {
        this.getQuestion();
      }
    }).bind(this));
  },

  summonTrebek: function(){
    var msg = "<p>"+ utils.capitalize(this.question.win) +"!</p>";
    this.whiteNoise.turnOn();
    this.monitorOff(function(){
      $(this.elem).find('.monitor').html(msg).toggleClass(this.question.win);
      this.monitorOn(function(){
        // $(this.elem).find('.monitor').toggleClass(this.question.win);
        // this.monitorOff();
        this.getQuestion();
      });
    });
  },

  monitorOn: function(callback){
    callback = callback || function(){this.whiteNoise.turnOff();};
    $(this.elem).find('.monitor').fadeIn((callback).bind(this));
  },

  monitorOff: function(callback){
    callback = callback || function(){$(this).hide();};
    $(this.elem).find('.monitor').fadeOut(callback.bind(this));
  }
};

var Question = function(gameObj){
  this.game = gameObj;
  this.parent = this.game.elem;
  this.rawAnswer = this.game.data[0].answer;
  this.answer = this.parseAnswer(this.rawAnswer);
  this.question = this.game.data[0].question;
  this.category = this.game.data[0].category.title;
  this.value = this.game.data[0].value;
  this.display();
  addListeners.question(this.game);
  console.log(this);
};

Question.prototype = {

  display: function(){
    var msg = "<h3>"+ this.category + " for $" + this.value +"</h3> <p>"+ this.question +"</p>";
    $(this.parent).find('.monitor').html(msg);
    this.game.monitorOn();
    $(this.parent).find('.answer-box').toggleClass('popUp');
  },

  parseAnswer: function(answer){
    var words = answer.split(' ');
    if (words.length >= 2) {
      words = utils.stripWords(words);
    } else {
      words[0] = words[0].toLowerCase();
    }
    return words;
  },

  checkAnswer: function(userAnswer){
    userAnswer = this.parseAnswer(userAnswer);
    for (var userIndex = 0; userIndex < userAnswer.length; userIndex++){
      for (var answerIndex = 0; answerIndex < this.answer.length; answerIndex++){
        if (userAnswer[userIndex] === this.answer[answerIndex]){
          this.game.score += Number(this.value);
          console.log("score: "+ this.game.score);
          return 'right';
        }
      }
    }
    this.game.score -= Number(this.value);
    console.log("score: "+ this.game.score);
    return 'wrong';
  }

};

window.onload = function(){
  console.log('loaded');
  new Game();
};
