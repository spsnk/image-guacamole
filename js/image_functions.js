function getImageArray ( canvas )
{
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData.data;
}

function binarize ( threshold, data )
{
  data = grayscale ( data );
  for (var i = 0; i < data.length; i += 4)
  {
    data[i]     = data[i] < threshold?0:255; // red
    data[i + 1] = data[i+1] < threshold?0:255; // green
    data[i + 2] = data[i+2] < threshold?0:255; // blue
    /* if( data[i] < threshold )
    {
      data[i]     = 0; // red
      data[i + 1] = 0; // green
      data[i + 2] = 0; // blue
    }
    else
    {
      data[i]     = 255; // red
      data[i + 1] = 255; // green
      data[i + 2] = 255; // blue
    } */
  }
  return data;
}

function grayscale ( data )
{
  for (var i = 0; i < data.length; i += 4)
  {
    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // get averague
    data[i]     = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  return data;
}