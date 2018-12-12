var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();

var undoData;

$(document).ready(function()
{
  $(".dialog").prepend('<svg class="close" version="1.1" viewBox="0 0 12 12" width="12" height="12" xmlns="http://www.w3.org/2000/svg"> <line x1="1" y1="11" x2="11" y2="1" stroke="blue" stroke-width="2"/><line x1="1" y1="1" x2="11" y2="11" stroke="blue" stroke-width="2"/> </svg>');
  
  var $form = $('#open_dialog');

  if (isAdvancedUpload) {
    $form.addClass('has-advanced-upload');
  }
  
  if (isAdvancedUpload) {

    var loaded_image = new Image();

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
      $("#open_dialog").show();
    });
    $(".close").on("click", function(e)
    {
      $(this).parent().hide();
      //$('#preview').attr('src','#').hide();
      //loaded_image.src='#';
      //$(".box__icon").show();
    });
    $("#scroll_sync").on("click", function(e)
    {
      $(this).toggleClass("selected");
      $("#img_1, #img_2").toggleClass("syncscroll").attr("name","canvas");
      syncscroll.reset();
    });
    $("#binarize").on("click", function(e)
    {
      $("#binarize_dialog").show();
    });
    $("#threshold_range").on("change input", function()
    {
      $("#threshold").val($(this).val());
    });
    
    $("#mask").on("click", function(e)
    {
      $("#mask_dialog").show();
    });
    $("#demask").on("click", function(e)
    {
      $("#demask_dialog").show();
    });
    
    $("#binarize_apply").on("click", function()
    {
      var imageArray = getImageArray ( document.getElementById("canvas_1") );
      imageArray.data = binarize ( $("#threshold").val(), imageArray.data );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = imageArray.width;
      canvas2.height = imageArray.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(imageArray,0,0);
    });
    
    $("#grayscale").on("click", function()
    {
      var imageArray = getImageArray ( document.getElementById("canvas_1") );
      imageArray.data = grayscale ( imageArray.data );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = imageArray.width;
      canvas2.height = imageArray.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(imageArray,0,0);
    });
    
    $("#red_c, #green_c, #blue_c").on("click", function(e)
    {
      var imageArray = getImageArray ( document.getElementById("canvas_1") );
      imageArray.data = rgb ( imageArray.data, e.target.id[0] );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = imageArray.width;
      canvas2.height = imageArray.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(imageArray,0,0);
    });
    
    var histo = new Chart(document.getElementById("histograph").getContext("2d"), {
      type: 'line',
      data: {
        labels: [0],
        datasets:[{
          label: 'rgb',
          backgroundColor: "#000000",
          borderColor: "#000000",
          data: [0],
          fill: true,
          pointRadius: 0,
          borderWidth: 1
        },{
          label: 'r',
          backgroundColor: "#ff0000",
          borderColor: "#ff0000",
          data: [0],
          fill: true,
          pointRadius: 0,
          borderWidth: 1
        },{
          label: 'g',
          backgroundColor: "#27902e",
          borderColor: "#27902e",
          data: [0],
          fill: true,
          pointRadius: 0,
          borderWidth: 1
        },{
          label: 'b',
          backgroundColor: "#84b7ff",
          borderColor: "#84b7ff",
          data: [0],
          fill: true,
          pointRadius: 0,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        title: {
          display: false,
          text: 'Histogram'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: false,
            scaleLabel: {
              display: true,
              labelString: 'Intensity Value'
            }
          }],
          yAxes: [{
            display: false,
            scaleLabel: {
              display: true,
              labelString: 'Frequency'
            }
          }]
        }
      }
    });
    
    $("#histogram").on("click", function(e)
    {
      var imageArray = getImageArray ( document.getElementById("canvas_1") );
      var histodata = getHistogram ( imageArray.data );
      
      $("#histogram_dialog").show();
      
      var lab256 = [];
      for(var i=0;i<256;i++) lab256[i] = i;
      histo.data.labels = lab256;
      
      histo.data.datasets[0].data = histodata.rgb;
      histo.data.datasets[1].data = histodata.r;
      histo.data.datasets[2].data = histodata.g;
      histo.data.datasets[3].data = histodata.b;
      
      histo.update();
      
      var histo_prop = histogram_properties(histodata, imageArray);
      
      console.log(histo_prop);
    });
    
    Array.prototype.reshape = function(rows, cols) {
      var copy;
      for (var r = 0; r < rows; r++) {
        var row = [];
        for (var c = 0; c < cols; c++) {
          var i = r * cols + c;
          if (i < this.length) {
            row.push(this[i]);
          }
        }
        copy.push(row);
      }
      return copy;
    };
    
    $("#aadd").on("click",function()
    {
      var imageArray1 = getImageArray ( document.getElementById("canvas_1") );
      var imageArray2 = getImageArray ( document.getElementById("canvas_2") );
      var newImage = pixelAdd( imageArray1, imageArray2 );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = newImage.width;
      canvas2.height = newImage.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(newImage,0,0);
    });
    $("#asub").on("click",function()
    {
      var imageArray1 = getImageArray ( document.getElementById("canvas_1") );
      var imageArray2 = getImageArray ( document.getElementById("canvas_2") );
      var newImage = pixelSubstract( imageArray1, imageArray2 );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = newImage.width;
      canvas2.height = newImage.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(newImage,0,0);
    });
    
    $("#amul").on("click",function()
    {
      var imageArray1 = getImageArray ( document.getElementById("canvas_1") );
      var imageArray2 = getImageArray ( document.getElementById("canvas_2") );
      var newImage = pixelMultiply( imageArray1, imageArray2 );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = newImage.width;
      canvas2.height = newImage.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(newImage,0,0);
    });
    
    $("#lnot").on("click",function()
    {
      var imageArray = getImageArray ( document.getElementById("canvas_1") );
      imageArray.data = pixelNot ( imageArray.data );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = imageArray.width;
      canvas2.height = imageArray.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(imageArray,0,0);
    });
    
    $("#land").on("click",function()
    {
      var imageArray1 = getImageArray ( document.getElementById("canvas_1") );
      var imageArray2 = getImageArray ( document.getElementById("canvas_2") );
      var newImage = pixelAnd( imageArray1, imageArray2 );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = newImage.width;
      canvas2.height = newImage.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(newImage,0,0);
    });
    
    $("#lor").on("click",function()
    {
      var imageArray1 = getImageArray ( document.getElementById("canvas_1") );
      var imageArray2 = getImageArray ( document.getElementById("canvas_2") );
      var newImage = pixelOr( imageArray1, imageArray2 );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = newImage.width;
      canvas2.height = newImage.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(newImage,0,0);
    });
    
    $("#lxor").on("click",function()
    {
      var imageArray1 = getImageArray ( document.getElementById("canvas_1") );
      var imageArray2 = getImageArray ( document.getElementById("canvas_2") );
      var newImage = pixelXor( imageArray1, imageArray2 );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = newImage.width;
      canvas2.height = newImage.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(newImage,0,0);
    });
    
    $("#right_move, #left_move").on("click", function(e)
    {
      switch(e.target.id[0])
      {
        case 'r':
          var imageArray = getImageArray ( document.getElementById("canvas_1") );
          var canvas2 = document.getElementById("canvas_2");
          canvas2.width = imageArray.width;
          canvas2.height = imageArray.height;
          var ctx2 = canvas2.getContext("2d");
          ctx2.putImageData(imageArray,0,0);
        break;
        case 'l':
          var imageArray = getImageArray ( document.getElementById("canvas_2") );
          var canvas2 = document.getElementById("canvas_1");
          canvas2.width = imageArray.width;
          canvas2.height = imageArray.height;
          var ctx2 = canvas2.getContext("2d");
          ctx2.putImageData(imageArray,0,0);
        break;
      }
    });
    $("#mask_apply").on("click",function(e)
    {
      var mask_matrix = [];
      $("[name='mask']").each(function(index)
      {
        mask_matrix[index] = parseInt($(this).val())  ;
      });
      var imageArray = getImageArray ( document.getElementById("canvas_1") );
      imageArray = pixelConvolution ( imageArray, mask_matrix );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = imageArray.width;
      canvas2.height = imageArray.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(imageArray,0,0);
    });
    
    $("#dilation_apply").on("click",function(e)
    {
      var mask_matrix = [];
      $("[name='demask']").each(function(index)
      {
        mask_matrix[index] = parseInt($(this).val())  ;
      });
      var imageArray = getImageArray ( document.getElementById("canvas_1") );
      imageArray = pixelDilation ( imageArray, mask_matrix );
      var canvas2 = document.getElementById("canvas_2");
      canvas2.width = imageArray.width;
      canvas2.height = imageArray.height;
      var ctx2 = canvas2.getContext("2d");
      ctx2.putImageData(imageArray,0,0);
    });
  }
});
