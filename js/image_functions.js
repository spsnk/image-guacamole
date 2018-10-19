function getImageArray ( canvas )
{
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData;
}

function histogram ( data )
{
  
}

function binarize ( threshold, data )
{
  for (var i = 0; i < data.length; i += 4)
  {
    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // get averague
    avg = avg < threshold ? 0 : 255;
    data[i]     = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
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

function rgb ( data , color )
{
  for (var i = 0; i < data.length; i += 4)
  {
    data[i]     = color == 'r'? data[i]:0; // red
    data[i + 1] = color == 'g'? data[i+1]:0; // green
    data[i + 2] = color == 'b'? data[i+2]:0; // blue
  }
  return data;
}

function getHistogram ( data )
{
  var histogram = {
                    rgb : Array.apply(null, Array(256)).map(Number.prototype.valueOf,0),
                    r   : Array.apply(null, Array(256)).map(Number.prototype.valueOf,0), 
                    g   : Array.apply(null, Array(256)).map(Number.prototype.valueOf,0),
                    b   : Array.apply(null, Array(256)).map(Number.prototype.valueOf,0)
                  }
  for (var i = 0; i < data.length; i += 4)
  {
    var avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // get averague
    histogram.rgb [ avg       ]++;
    histogram.r   [ data[i]   ]++;
    histogram.g   [ data[i+1] ]++;
    histogram.b   [ data[i+2] ]++;
  }
  return histogram;
}

function pixelAdd ( data1, data2 )
{
  for (var i = 0; i < data1.length; i += 4)
  {
    data1[i    ] += data2[i    ]; // red
    data1[i + 1] += data2[i + 1]; // green
    data1[i + 2] += data2[i + 2]; // blue
  }
  return data1;
}