var utils = {
  template: function(source, context){
    source = $(source).html();
    var template = Handlebars.compile(source);
    context = {} || context;
    var html = template(context);
    return html;
  },

  loader: {
    isLoading: false,
    show: function(){
      this.isLoading = true;
      // display loading icon
    },
    hide: function(){
      this.isLoading = false;
      // remove loading icon
    }
  },

  ignoreWords: [
    'the',
    'a',
    'of',
    'and',
    'is',
    'or',
    '&',
    '$'
  ],

  stripWords: function(array){

    for (var index = array.length - 1; index >= 0; index--){
      array[index] = array[index].toLowerCase();
      for (var ignoreIndex = 0; ignoreIndex < utils.ignoreWords.length; ignoreIndex++){
        if (array[index] === utils.ignoreWords[ignoreIndex]){
          array.splice(index, 1);
        }
      }
    }
    return array;
  },

  capitalize: function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

};
