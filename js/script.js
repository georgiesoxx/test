// defined venue object
var venueObj={};

$(document).ready(function() {
  //allow user to search when they hit the enter key when locationTxt is in focus
  $('#locationTxt').keyup(function(e){
    if(e.keyCode == 13){
      searchForVenues();
    }
  });
})

function searchForVenues(){
  //Clear aout any previous results
  $("#venueResults ul").empty();
  $("#venueResults ul").removeClass("notSearched").removeClass("error");
  //Check to see if text field is empty
  if($('#locationTxt').val().trim()== ""){
    var venueLi = $("<li>", {"text": "You haven't entered a location - Please search for venues in a specific a location using the form above"});
    $("#venueResults ul").append(venueLi);
    $("#venueResults ul").addClass("error");
  } else {
    //get JSON from location search
    $.getJSON('https://api.foursquare.com/v2/venues/search?ll=44.3,37.2&near='+$('#locationTxt').val()+'&oauth_token=QLG3JFV1VK2JGZ2E0S3YUAXFLSCOFW0VYT43SHSB5EGBWOKD&v=20170219', function(data) {
      venueObj=data;
      //display venue list
      for(var i=0; i<venueObj.response.venues.length; i++){
        var venueType;
        if(venueObj.response.venues[i].categories.length!=0){
          venueType=venueObj.response.venues[i].categories[0].name;
        } else {
          venueType="Unknown venue type";
        }
        var venueLiHtml = venueObj.response.venues[i].name + " <span class='venueType'>(" + venueType +")</span>"
        var venueLi = $("<li>", {"html": venueLiHtml});
        $("#venueResults ul").append(venueLi);
      }
    })
    //do this when location doesn't exist
    .fail(function() {
      var venueLi = $("<li>", {"text": "We cannot find the location you are searching for - Please try again using the form above"});
      $("#venueResults ul").append(venueLi);
      $("#venueResults ul").addClass("error");
   })
  }
}
