var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

$(document).ready(function()
{
  var image = [];
  var $form = $('.box');

  if (isAdvancedUpload) {
    $form.addClass('has-advanced-upload');
  }
  
  if (isAdvancedUpload) {

    var loaded_image;

    $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
    })
    .on('dragover dragenter', function() {
      $form.addClass('is-dragover');
    })
    .on('dragleave dragend drop', function() {
      $form.removeClass('is-dragover');
    })
    .on('drop', function(e) {
      var droppedFile = e.originalEvent.dataTransfer.files[0];
      console.log("Dropped: " + droppedFile.name + " MIME: " + droppedFile.type);
      var fr = new FileReader();
      fr.onload = function(ev2) {
          loaded_image = new Image();
          loaded_image.addEventListener("load", function() {
            //context.drawImage(loaded_image, 0, 0);
            console.log("Image "+droppedFile.name+" loaded");
          });
          loaded_image.src = ev2.target.result;
          $('#preview').attr('src', loaded_image.src).css("display", "block");
          $(".box__icon").hide();
      };
      if(droppedFile.type.includes("image") )
      {
        fr.readAsDataURL(droppedFile);
      }
    });
    $(".box__file").on("change", function(e)
    {
      var loadedFile = e.target.files[0]; // FileList object
      console.log("Loaded: " + loadedFile.name + " MIME: " + loadedFile.type);
      var fr = new FileReader();
      fr.onload = function(ev2) {
          loaded_image = new Image();
          loaded_image.addEventListener("load", function() {
            console.log("Image "+loadedFile.name+" loaded");
          });
          loaded_image.src = ev2.target.result;
          $('#preview').attr('src', loaded_image.src).css("display", "block");
          $(".box__icon").hide();
      };
      if(loadedFile.type.includes("image") )
      {
        fr.readAsDataURL(loadedFile);
      }
    });
    $("#slot1").on('click',function(e){
      var canvas  = document.getElementById("canvas_1");
      var context = canvas.getContext("2d");
      canvas.width = loaded_image.width;
      canvas.height = loaded_image.height;
      context.drawImage(loaded_image, 0, 0);
    });
    $("#slot2").on('click',function(e)
    {
      var canvas  = document.getElementById("canvas_2");
      var context = canvas.getContext("2d");
      canvas.width = loaded_image.width;
      canvas.height = loaded_image.height;
      context.drawImage(loaded_image, 0, 0);
    });
    $("#open_image").on("click", function(e)
    {
      $(".box").show();
    });
    $(".close").on("click", function(e)
    {
      $(this).parent().hide();
      $('#preview').attr('src','#').hide();
      loaded_image.src='#';
      $(".box__icon").show();
    });
  }
});
