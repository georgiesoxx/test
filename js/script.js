var venueObj={};

$(document).ready(function() {
  $('#locationTxt').keyup(function(e){
    if(e.keyCode == 13){
      searchForVenues();
    }
  });
})

function searchForVenues(){
  if($('#locationTxt').val().trim()== ""){
    console.log("no search criteria entered")
  } else {
  $.getJSON('https://api.foursquare.com/v2/venues/search?ll=44.3,37.2&near='+$('#locationTxt').val()+'&oauth_token=QLG3JFV1VK2JGZ2E0S3YUAXFLSCOFW0VYT43SHSB5EGBWOKD&v=20170219', function(data) {
      venueObj=data;
      console.log(venueObj)
    })
    .fail(function() {
      console.log("location doesn't exist");
   })
  }
}
