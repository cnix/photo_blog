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
      var request = base_url + method + o.api_key + o.set_id + extras + o.format;
      
      $.getJSON(request,
        function(data) {
          
          $.each(data.photoset.photo, function(i,item) {
            if (o.potd_id) {
              if (regex.test(item.tags)) {
                photo = item;
              };
            } else {
              photo = item;
            };
          build_markup(photo,container);
          })            

          // var static_photo_url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
          // var photo_page_url = 'http://flickr.com/photos/seadated/' + photo.id;
          // var image_container = "<h2>" + photo.title + "</h2>"
          // image_container += "<a href='" + photo_page_url + "'>";
          // image_container += "<img src=\"" + static_photo_url + "\" /></a>";
          // $(image_container).appendTo(container);
          
        }
      )

    })
  }
  
  function build_markup(photo,container) {
    var static_photo_url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
    var photo_page_url = 'http://flickr.com/photos/seadated/' + photo.id;
    var image_container = "<h2>" + photo.title + "</h2>"
    image_container += "<a href='" + photo_page_url + "'>";
    image_container += "<img src=\"" + static_photo_url + "\" /></a>";
    $(image_container).appendTo(container);
  }
  
})(jQuery);

jQuery(document).ready(function($) {

  if ( $('.photo').length ) {
    
    var potd_id = 'day' + $('div#content > div.photo:first-child').attr('id');
    
    $("#image").flickr_load({ 
      method: 'flickr.photosets.getPhotos',
      extras: 'tags',
      potd_id: potd_id
     });

    // $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + api_key + '&photoset_id=' + set_365_id + '&extras=tags&format=json&jsoncallback=?',
    //   function (data) {
    // 
    //     $.each(data.photoset.photo, function(i,item) {
    //       if (regex.test(item.tags)) {
    //         photo = item;
    //       };
    //     })
    //     $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key=' + api_key + '&photo_id=' + photo.id + '&format=json&jsoncallback=?',
    //       function (data) {
    //         description = data.photo.description._content.split("\n").join("</p><p>");
    //         image_description = "<p>" + description + "</p>";
    //         static_photo_url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
    //         photo_page_url = 'http://flickr.com/photos/seadated/' + photo.id;
    //         image_container = "<a href='" + photo_page_url + "'>";
    //         image_container += "<img src=\"" + static_photo_url + "\" /></a>";
    //         $("#image").append(image_container);
    //         $("h2").append(photo.title);
    //         $("#image").append(image_description);
    //       }
    //     )
    //   }
    // )
    
  };
  
  if ( $('#index').length ) {
    
    $("#index").flickr_load({
      method: 'flickr.photosets.getPhotos',
      per_page: '&per_page=5'
    })

    // $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + api_key + '&photoset_id=' + set_365_id + '&per_page=5&page=1&format=json&jsoncallback=?',
    //   function(data) {
    //     $.each(data.photoset.photo, function(i,item) {
    // 
    //       $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key=' + api_key + '&photo_id=' + item.id + '&format=json&jsoncallback=?',
    //         function(data) {
    //           permalink = item.title.toLowerCase().split(' ').join('/');
    //           static_photo_url = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
    //           photo_page_url = 'http://flickr.com/photos/seadated/' + item.id;
    //           post_id = item.title.split(' ')[1];
    // 
    //           image_container = "<div class='post' id='" + post_id + "'><h2><a href='/" + permalink + "'>" + item.title + "</a></h2>";
    //           image_container += "<a href='" + photo_page_url + "'>";
    //           image_container += "<img src=\"" + static_photo_url + "\" /></a><p>";
    //           image_container += data.photo.description._content.split("\n").join("</p><p>");;
    //           image_container += "</p></div>"
    // 
    //           $("#index").prepend(image_container);
    //         }
    //       );
    //       
    //     })
    //   }
    // )
    
  };

})