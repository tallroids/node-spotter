function highlight(locationId){
  console.log("Highlight Location Id: ", locationId)
}

function displayLocations(locations){
  $('#locations').text('');
    locations.forEach(function(location){
    $('#locations').append("<h3><a href='#' onclick='highlight(" + location.id + ")'>" + location.title + "</a></h3>")
    $('#locations').append("<p>" + location.description + "</p>")
  })
}

function filter(categoryId){
  console.log("Filter Category Id: ", categoryId)
  $.get("/api/getLocationsByCategoryId/" + categoryId, function(result) {
  if (typeof(result) == 'object' && result.success){
    displayLocations(result.locations);
  } else {
    $("#locations").text("Could not retrieve locations.");
  }
});
}

function showPage(page){
  if(page.toLowerCase() == 'favorites'){
    $('#locations').text('')
    $.get("/api/getFavorites", function(result) {
      if (typeof(result) == 'object' && result.success){
          displayLocations(result.locations);
      } else {
          $("#locations").text("Could not retrieve locations.");
      }
    });
  $('#pageName').text(page)
  } else if(page == 'home') {
    getLocations();
  }
  $('#sidenav-overlay').click();
}

$.get("/api/getCategories", function(result) {
  if (typeof(result) == 'object' && result.success){
      result.categories.forEach(function(category){
        $('#categories').append("<h3><a href='#' onclick='filter(" + category.id + ")'>" + category.title + "</a></h3>")
      })
  } else {
      $("#categories").text("Could not retrieve categories.");
  }
});

function getLocations(){ 
  $('#locations').text('')
  $.get("/api/getLocations", function(result) {
    if (typeof(result) == 'object' && result.success){
      displayLocations(result.locations);
    } else {
      $("#locations").text("Could not retrieve locations.");
    }
  });
}
getLocations();