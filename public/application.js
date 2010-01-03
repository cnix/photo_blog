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
        $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key=' + api_key + '&photo_id=' + photo.id + '&format=json&jsoncallback=?',
          function (data) {
            description = data.photo.description._content.split("\n").join("</p><p>");
            image_description = "<p>" + description + "</p>";
            static_photo_url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
            photo_page_url = 'http://flickr.com/photos/seadated/' + photo.id;
            image_container = "<a href='" + photo_page_url + "'>";
            image_container += "<img src=\"" + static_photo_url + "\" /></a>";
            $("#image").append(image_container);
            $("h2").append(photo.title);
            $("#image").append(image_description);
          }
        )
      }
    )
    
  };
  
  if ( $('#index').length ) {
    $.getJSON('http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + api_key + '&photoset_id=' + set_365_id + '&per_page=5&page=1&format=json&jsoncallback=?',
      function(data) {
        $.each(data.photoset.photo, function(i,item) {

          $.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key=' + api_key + '&photo_id=' + item.id + '&format=json&jsoncallback=?',
            function(data) {
              permalink = item.title.toLowerCase().split(' ').join('/');
              static_photo_url = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
              photo_page_url = 'http://flickr.com/photos/seadated/' + item.id;
              post_id = item.title.split(' ')[1];

              image_container = "<div class='post' id='" + post_id + "'><h2><a href='/" + permalink + "'>" + item.title + "</a></h2>";
              image_container += "<a href='" + photo_page_url + "'>";
              image_container += "<img src=\"" + static_photo_url + "\" /></a><p>";
              image_container += data.photo.description._content.split("\n").join("</p><p>");;
              image_container += "</p></div>"

              $("#index").prepend(image_container);
            }
          );
          
        })
      }
    )
    
  };

})