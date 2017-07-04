function displayLocations(locations){
    locations.forEach(function(location){
    $('#locations').append("<h3>" + location.title + "</h3>")
    $('#locations').append("<p>" + location.description + "</p>")
  })
}

$.get("/api/getLocations", function(result) {
    if (typeof(result) == 'object'){
        displayLocations(result);
    } else {
        $("#locations").text("Could not retrieve locations.");
    }
  });