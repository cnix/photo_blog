$(document).ready(function($) {
  
  var api_key = '9c9a2608064330707e0efd8b6816510b';
  var set_365_id = '72157622994576777';
  var user_id = '79337593@N00';

  if ( $('.photo').length ) {
    
    var potd_id = 'day' + $('div#content > div.photo:first-child').attr('id');
    var regex = new RegExp(potd_id);

    $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + api_key + '&photoset_id=' + set_365_id + '&extras=tags&format=json&jsoncallback=?',
      function (data) {

        $.each(data.photoset.photo, function(i,item) {
          if (regex.test(item.tags)) {
            photo = item;
          };
        })

        static_photo_url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
        photo_page_url = 'http://flickr.com/photos/seadated/' + photo.id;
        image_container = "<a href='" + photo_page_url + "'>";
        image_container += "<img src=\"" + static_photo_url + "\" /></a>";
        $("#image").append(image_container);
        $("h2").append(photo.title);
      }
    )
    
  };
  
  if ( $('#index').length ) {
    $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + api_key + '&photoset_id=' + set_365_id + '&per_page=5&page=1&format=json&jsoncallback=?',
      function(data) {
        
        $.each(data.photoset.photo, function(i,item) {
          static_photo_url = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
          photo_page_url = 'http://flickr.com/photos/seadated/' + item.id;
          image_container = "<div class='post'><h2>" + item.title + "</h2>";
          image_container += "<a href='" + photo_page_url + "'>";
          image_container += "<img src=\"" + static_photo_url + "\" /></a></div>";
          $("#index").append(image_container);
        })
      }
    )
    
  };

})