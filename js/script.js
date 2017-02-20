// defined venue object
var venueObj={};

$(document).ready(function() {
  //start with no location
  $('#locationTxt').val("");
  //allow user to search when they hit the enter key when locationTxt is in focus
  $('#locationTxt').keyup(function(e){
    if(e.keyCode == 13){
      searchForVenues();
    }
  });
  $('#locationSearchBtn').click(function(e){
    searchForVenues();
  });
})

function searchForVenues(){
  //Clear aout any previous results
  $("#venueResults .container").empty();
  $("#venueResults .container").removeClass("notSearched").removeClass("error");
  //Check to see if text field is empty
  if($('#locationTxt').val().trim()== ""){
    var venueP = $("<p>", {"text": "You haven't entered a location - Please search for recommended venues in a specific a location using the form above"});
    $("#venueResults .container").append(venueP);
    $("#venueResults .container").addClass("error");
  } else {
    //get JSON from location search
    $.getJSON('https://api.foursquare.com/v2/venues/explore?ll=44.3,37.2&near='+$('#locationTxt').val()+'&oauth_token=QLG3JFV1VK2JGZ2E0S3YUAXFLSCOFW0VYT43SHSB5EGBWOKD&v=20170219', function(data) {
      venueObj=data.response.groups[0].items;
      //display venue list
      for(var i=0; i<venueObj.length; i++){
        var venueType;
        var venueCurrent=venueObj[i].venue;
        if(venueCurrent.categories.length!=0){
          venueType=venueCurrent.categories[0].name;
        } else {
          venueType="Unknown venue type";
        }
        var venueRow = $("<div>", {"class": "row"});
        var venueCol = $("<div>", {"class": "col-xs-12"})
        var venuePanel = $("<div>", {"class": "panel"})
        venueRow.append(venueCol);
        venueCol.append(venuePanel);
        //add name and type of venue to page
        var venueTitle = $("<h3>", {"text": venueCurrent.name+" "});
        venueTitle.append($("<span>", {"class": "label label-default", "text": venueType}))
        venuePanel.append(venueTitle)

        //add address of venue to page if one exists
        if(venueCurrent.location){
          var venueLocationDetails="";
          if(venueCurrent.location.address){
            venueLocationDetails=venueCurrent.location.address
          }
          venueLocationDetails=concatAddress(venueCurrent.location.city,venueLocationDetails);
          venueLocationDetails=concatAddress(venueCurrent.location.state,venueLocationDetails);
          venueLocationDetails=concatAddress(venueCurrent.location.postalCode,venueLocationDetails);
          if(venueLocationDetails!=""){
            venueLocation=$("<p>", {"text":venueLocationDetails});
            venuePanel.append(venueLocation)
          }
        }

        var contactDetails=$("<div>", {"class":"contactDetails"});
        //add url of venue to page if one exists
        if(venueCurrent.url){
          var venueURL=$("<a>", {"href": venueCurrent.url+" ", "text": venueCurrent.url, "target":"_blank"});
          var website=$("<span>", {"class": "website"});
          website.append("Website: ").append(venueURL).append(".");
          contactDetails.append(website);
        }
        //add phone number of venue to page if one exists
        if(venueCurrent.contact.formattedPhone){
          var venuePhone=$("<span>", {"text": "Telephone: "+ venueCurrent.contact.formattedPhone+".", "class": "telephone"});
          contactDetails.append(venuePhone);
        }
        //add twitter link of venue to page if one exists
        if(venueCurrent.contact.twitter){
          var venueTwitter=$("<a>", {"href": "https://twitter.com/"+venueCurrent.contact.twitter, "text":"@"+venueCurrent.contact.twitter, "target":"_blank"});
          var twitter=$("<span>", {"class": "twitter"});
          twitter.append("Twitter: ").append(venueTwitter).append(".");
          contactDetails.append(twitter);
        }
        venuePanel.append(contactDetails)
        $("#venueResults .container").append(venueRow);
      }
    })
    //do this when location doesn't exist
    .fail(function() {
      var venueP = $("<p>", {"text": "We cannot find the location you are searching for - Please try again using the form above"});
      $("#venueResults .container").append(venueP);
      $("#venueResults .container").addClass("error");
   })
  }
}

//add steps of address if they exist
function concatAddress(locationDetails,venueLocationDetails){
  if(locationDetails){
    var addressPart=locationDetails;
    if(venueLocationDetails!=""){
      addressPart = addComma(addressPart);
    }
    venueLocationDetails = venueLocationDetails.concat(addressPart);
  }
  return venueLocationDetails;
}

//add commas - used for addresses in multiple part
function addComma(str){
  return ", "+str;
}

//add space - used for contact details in multiple part
function addSpace(contactDetails, str){
  if(contactDetails.text()!="") {
    return " "+str;
  }
}
