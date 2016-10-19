
var addListeners = {
  game: function(self){
    $(self.elem)
      .one('click', '.controls-1', function(){
        self.displayScoreCard();
        self.getQuestion();
      });
  },
  question: function(self){
    $(self.elem)
    .one('submit', '.answer-box', function(event){
      event.preventDefault();
      var answer = $('.answer-field').val();
      $('.answer-field').val('');
      $(self.elem).find('.answer-box').toggleClass('popUp');
      self.question.win = self.question.checkAnswer(answer);
      self.store();
      self.summonTrebek();
    });
  }
};

//contructors:

var Game = function(stats){
  this.question = {};
  this.stats = stats || {
    score: 0,
    right: 0,
    wrong: 0
  };
  this.whiteNoise = whiteNoise;
  this.elem = this.display();
  addListeners.game(this);
  this.whiteNoise.turnOn();
  console.log(this);
};

Game.prototype = {

  store: function(){
    localStorage.setItem('jeopardy', JSON.stringify(this.stats));
  },

  display: function(){

    var tv = utils.template('#TV');
    return $(tv).prependTo('main');

  },

  displayScoreCard: function(){

    this.displayStats();
    this.scoreAnimation("EXTREME JEOPARDY!");
    $(this.elem).find('.scoreCard').fadeIn();

  },

  scoreAnimation: function(msg){

    $(this.elem).find('.scoreAlert')
      .text(msg)
      .show()
      .animate({
          top: '-70px'
        }, 800, 'linear', function(){
      $(this).fadeOut('fast', function(){
        $(this).css('top', '0px');
      });
    });

  },

  displayStats: function(){

    var card = $(this.elem).find('.stats');
    for (var item in this.stats){
      var thisClass = '.' + item;
      var thisItem = $(card).find(thisClass);
      var value = item === 'score' ? '$' + this.stats[item] : this.stats[item];
      $(thisItem).slideDown((function(){
        $(thisItem).text(item + ': '+ value).slideDown();
      }).bind(this));
    }

    console.log(this.stats);
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
  console.log(this.game);
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
          this.game.stats.score += Number(this.value);
          this.game.stats.right++;
          this.game.scoreAnimation('+$' + this.value);
          this.game.displayStats();
          return 'right';
        }
      }
    }
    this.game.stats.score -= Number(this.value);
    this.game.stats.wrong++;
    this.game.scoreAnimation('-$' + this.value);
    this.game.displayStats();
    return 'wrong';
  }

};

window.onload = function(){
  var stats = JSON.parse(localStorage.getItem('jeopardy'));
  new Game(stats);
};
