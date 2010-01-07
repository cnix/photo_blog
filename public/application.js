(function($) {
  
  // core extensions
  $.extend({
    // determines if an object is empty
    // $.isEmpty({})             // => true
    // $.isEmpty({user: 'rph'})  // => false
    isEmpty: function(obj) {
      for (var i in obj) { return false }
      return true
    }
  })
  
  $.flickr = {
    url: function(method,params) {
      return 'http://api.flickr.com/services/rest/?method=' + method + '&format=json' +
        '&api_key=' + $.flickr.settings.api_key + ($.isEmpty(params) ? '' : '&' + $.param(params)) + '&jsoncallback=?'      
    },
  }
  
  $.flickr.photos = function(method, options) {
    var options = $.extend($.flickr.settings, options || {}),
        elements = $.flickr.self, photos

    return elements.each(function() {
      $.getJSON($.flickr.url(method, options), function(data) {
        photos = (data.photos === undefined ? data.photoset : data.photos)
        // elements.append($.flickr.thumbnail.process(photos))
      })
    })
  }
  
  $.flickr.paginate = function(options) {
    var last = $(this).flickr().photosetsGetPhotos({photoset_id:'72157622994576777'});
    alert('last = '+last);
    var start = $.flickr.paginate.numerify(options.start);
    var prev = (start-1);
    var next = (start+1);
    $(options.up).attr('href','/day/'+next);
    $(options.down).attr('href','/day/'+prev);
  }
  
  $.flickr.paginate.numerify = function(potd_id) {
    var arr = potd_id.split('day');
    id = arr[1] * 1;
    return id;
  }
  
  // namespace to hold available API methods
  // note: options available to each method match that of Flickr's docs
  $.flickr.methods = {
    // http://www.flickr.com/services/api/flickr.photos.getRecent.html
    photosGetRecent: function(options) {
      $.flickr.photos('flickr.photos.getRecent', options)
    },
    // http://www.flickr.com/services/api/flickr.photos.getContactsPublicPhotos.html
    photosGetContactsPublicPhotos: function(options) {
      $.flickr.photos('flickr.photos.getContactsPublicPhotos', options)
    },
    // http://www.flickr.com/services/api/flickr.photos.search.html
    photosSearch: function(options) {
      $.flickr.photos('flickr.photos.search', options)
    },
    // http://www.flickr.com/services/api/flickr.photosets.getPhotos.html
    photosetsGetPhotos: function(options) {
      $.flickr.photos('flickr.photosets.getPhotos', options)
    },
    photosGetInfo: function(options) {
      $flickr.photos('flickr.photos.getInfo', options)
    }
  }

  $.fn.flickr_load = function(settings,callback) {
    var defaults = {
      api_key: '&api_key=9c9a2608064330707e0efd8b6816510b',
      user_id: '&user_id=79337593@N00',
      set_id: '&photoset_id=72157622994576777',
      format: '&format=json&jsoncallback=?'      
    }
    
    var options = $.extend(defaults, settings);
    var container = this;
    
    return this.each(function() {
      var o = options;
      var base_url = 'http://api.flickr.com/services/rest/?method=';
      var method = o.method;
      var extras = "&extras=" + o.extras;
      var regex = new RegExp(o.potd_id);
      var request = base_url + method + o.api_key + o.set_id + extras + o.format;
      
      $.getJSON(request,
        function(data) {
          for (var i=0; i < data.photoset.photo.length; i++) {
            if (o.potd_id) {
              if (regex.test(data.photoset.photo[i].tags)) {
                photo = data.photoset.photo[i];
                build_markup(photo,container);
                break;              
              } else {
                continue;              
              }
            } else {
              photo = data.photoset.photo[i];
              build_markup(photo,container);
            }
          };
          
        }
      )

    })
  }
  
  function build_markup(photo,container) {
    if (container.attr('id') == 'image') {
      var static_photo_url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
      var photo_page_url = 'http://flickr.com/photos/seadated/' + photo.id;
      var image_container = "<h2>" + photo.title + "</h2>"
      image_container += "<a href='" + photo_page_url + "'>";
      image_container += "<img src=\"" + static_photo_url + "\" /></a>";
      $(image_container).appendTo(container);
    } else if (container.attr('id') == 'index') {
      var permalink = photo.title.toLowerCase().split(' ').join('/');
      var static_photo_url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
      var photo_page_url = 'http://flickr.com/photos/seadated/' + photo.id;
      var post_id = photo.title.split(' ')[1];
      var image_container = "<div class='post' id='" + post_id + "'><h2><a href='/" + permalink + "'>" + photo.title + "</a></h2>";
      image_container += "<a href='" + photo_page_url + "'>";
      image_container += "<img src=\"" + static_photo_url + "\" /></a><p>";
      image_container += "</p></div>"
      $(image_container).prependTo(container);
      
      // get_description(photo);
    } else {
     $('<p>Something went wrong</p>').appendTo(container); 
    }
  }
  
  $.fn.paginate = function() {
    var self = $(this);
    // if (self.attr('class')=='page_down') {
    //   
    // };
    switch(self.attr('class')) {
     case 'page_down' : return 'down'
     case 'page_up'   : return 'up' 
    }
      
  }
  
  // the plugin
  $.fn.flickr = function(options) {
    $.flickr.self = $(this)
    
    // base configuration
    $.flickr.settings = $.extend({
      api_key: '9c9a2608064330707e0efd8b6816510b'
    }, options || {})
    
    return $.flickr.methods
  }

})(jQuery);

jQuery(document).ready(function($) {

  var potd_id = 'day' + $('div#content > div.photo:first-child').attr('id');
  
  // Display single large result for daily view
  if ( $('.photo').length ) {
    
    $("#image").flickr_load({ 
      method: 'flickr.photosets.getPhotos',
      extras: 'tags',
      potd_id: potd_id
     });
    
  };
  
  // Display many results for index page
  if ( $('#index').length ) {
    
    $("#index").flickr_load({
      method: 'flickr.photosets.getPhotos',
      per_page: '&per_page=5'
    })

  };
  
  $.flickr.paginate({
    up: '.up',
    down: '.down',
    start: potd_id
  })

})