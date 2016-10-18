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

  displayTv: function(){
    var tv = utils.template('#TV');
    $(tv).appendTo('main').each(function(){
      whiteNoise.turnOn();
    });
  }
};
