$("#encrypt-btn-main").on("click", function() {
  $("#encrypt-btn-clicked").trigger("click");
});
$("#encrypt-btn-clicked").change(function(){
  window.location.replace("./encrypt.html");
});


$("#decrypt-btn-main").on("click", function() {
  //$("#decrypt-btn-clicked").trigger("click");
  window.location.replace("./decrypt.html");
});
$("#decrypt-btn-clicked").change(function(){
  // var file = $("#decrypt-btn-clicked").val();
  // window.location.replace("./decrypt.html?file=" + file);
  window.location.replace("./decrypt.html");
});


$("#new_pair-btn-main").on("click", function() {
  window.location.replace("./new_pair.html");
});


$("#import-btn-main").on("click", function() {
  $("#import-btn-clicked").trigger("click");
});
$("#import-btn-clicked").change(function(){
  window.location.replace("./import.html");
});