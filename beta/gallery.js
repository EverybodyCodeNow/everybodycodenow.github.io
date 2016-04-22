function getPhotos(photoset_id) {
    //get pictures for each photoset
    $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=30326df98ef709db64dd9cebe1702492&user_id=137000489%40N06&format=json&nojsoncallback=1&photoset_id=" + photoset_id).done(function(data) {
        var pictures = data.photoset.photo;
        for (var i = 0; i < pictures.length; ++i) {
            var photo = pictures[i];
            var farmid = photo.farm;
            var serverid = photo.server;
            var imageid = photo.id;
            var imagesecret = photo.secret;
            var flickrAPI_farmURL = "https://farm" + farmid + ".staticflickr.com/" + serverid + "/" + imageid + "_" + imagesecret + "_q.jpg";
            $('#'+photoset_id).append("<img src='" + flickrAPI_farmURL + "'>");
            console.log("success" + photoset_id);
        }
    });
}
$().ready(function() {
    //Get all the albums
    $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=30326df98ef709db64dd9cebe1702492&user_id=137000489%40N06&format=json&nojsoncallback=1").done(function(data) {
        var photosets = data.photosets.photoset;
        for (var x = 0; x < photosets.length; ++x) {
            var photoset_name = photosets[x].title['_content'];
            var photoset_id = photosets[x].id;
            $('#gallery_albums').append("<div id='"+photoset_id+"' class='album'><h3>"+photoset_name+"</h3></div>");
            getPhotos(photoset_id);
        }
    });
});
