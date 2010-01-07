(function($) {

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
      var fail = undefined;
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

})(jQuery);

jQuery(document).ready(function($) {

  // Display single large result for daily view
  if ( $('.photo').length ) {
    
    var potd_id = 'day' + $('div#content > div.photo:first-child').attr('id');
    
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

})