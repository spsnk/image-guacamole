var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

$(document).ready(function()
{
  var image = [];
  var $form;
  $form = $('.box');

  if (isAdvancedUpload) {
    $form.addClass('has-advanced-upload');
  }
  
  if (isAdvancedUpload) {

    var droppedFiles = false;
    var canvas  = document.getElementById("canvas_1");
    var context = canvas.getContext("2d");

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
      droppedFile = e.originalEvent.dataTransfer.files[0];
      console.log("Dropped: " + droppedFile.name + " MIME: " + droppedFile.type);
      var fr = new FileReader();
      fr.onload = function(ev2) {
          var img = new Image();
          img.addEventListener("load", function() {
            context.drawImage(img, 0, 0);
          });
          img.src = ev2.target.result;
          //$('#img1').attr('src', ev2.target.result);
      };
      if(droppedFile.type.includes("image") )
      {
        fr.readAsDataURL(droppedFile);
      }
    });
  }
});
