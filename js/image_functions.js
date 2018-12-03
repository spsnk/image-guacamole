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

function pixelAdd ( image1, image2 )
{
  var newHeight = image1.height<image2.height?image1.height:image2.height;
  var newWidth  = image1.width<image2.width?image1.width:image2.width;
  
  var buf1 = image1.data.buffer;
  var data1 = new Uint32Array(buf1);
  var buf2 = image2.data.buffer;
  var data2 = new Uint32Array(buf2);
  
  var newbuf  = new ArrayBuffer( newHeight * newWidth * 4 );
  var newbuf8 = new Uint8ClampedArray(newbuf);
  var newdata = new Uint32Array( newbuf );
  
  for (var index1 = 0, index2 = 0,i=0,j=0; i < newdata.length;)
  {
    newdata[i++] = data1[index1++]+data2[index2++];
    if(i%newWidth==0)
    {
      index1 = ++j * image1.width;
      index2 = j * image2.width;
    }
  }
  
  var newImage = new ImageData(newbuf8, newWidth, newHeight);
  
  return newImage;
}

function get2d ( imageData )
{
  var buf = new ArrayBuffer(imageData.data.length);
  var buf8 = new Uint8ClampedArray(buf);
  var data = new Uint32Array(buf);
  
  var newdata = new Uint32Array( imageData.width );
  
  for(var i=0,index=0;i<imageData.width;i++)
  {
    newdata[i] = new Uint32Array( imageData.height );
    for(var j=0;j<imageData.height;j++)
    {
      newdata[i][j] = data[index++];
    }
  }
  return newdata;
}
