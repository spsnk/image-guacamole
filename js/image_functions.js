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

function histogram_properties ( histodata, imagedata )
{
  var histoprop = {
                     P        : [],
                     media    : 0,
                     varianza : 0,
                     asimetria: 0,
                     entropia : 0,
                     energia  : 0
                  }
  var total_pixels = imagedata.width * imagedata.height;
  for(var i = 0; i < 256; i++)
  {
    histoprop.P[i] = histodata.rgb[i] / total_pixels;
    histoprop.media += histodata.rgb[i] * histoprop.P[i];
  }
  for(var i = 0; i < 256; i++)
  {
    histoprop.varianza += Math.sqrt(Math.pow(histodata.rgb[i] - histoprop.media, 2) * histoprop.P[i]);
    histoprop.asimetria += Math.pow(histodata.rgb[i] - histoprop.media, 3) * histoprop.P[i];
    histoprop.energia += Math.pow(histoprop.P[i], 2);
    histoprop.entropia += histoprop.P[i] * Math.log2(histoprop.P[i]);
  }
  return histoprop;
}

function pixelAdd ( image1, image2 )
{
  var newHeight = image1.height<image2.height?image1.height:image2.height;
  var newWidth  = image1.width<image2.width?image1.width:image2.width;
  var data1 = image1.data;
  var data2 = image2.data;
  var newdata = new Uint8ClampedArray( newHeight * newWidth * 4 );
  for (var index1 = 0, index2 = 0,i=0,j=0; i < newdata.length;)
  {
    newdata[i++] = data1[index1++] + data2[index2++];
    newdata[i++] = data1[index1++] + data2[index2++];
    newdata[i++] = data1[index1++] + data2[index2++];
    newdata[i] = 255;
    i++;
    index1++;
    index2++;
    if(i%newWidth==0)
    {
      index1 = ++j * image1.width;
      index2 = j * image2.width;
    }
  }
  var newImage = new ImageData(newdata, newWidth, newHeight);
  return newImage;
}

function pixelSubstract ( image1, image2 )
{
  var newHeight = image1.height<image2.height?image1.height:image2.height;
  var newWidth  = image1.width<image2.width?image1.width:image2.width;
  var data1 = image1.data;
  var data2 = image2.data;
  var newdata = new Uint8ClampedArray( newHeight * newWidth * 4 );
  for (var index1 = 0, index2 = 0,i=0,j=0; i < newdata.length;)
  {
    newdata[i++] = data1[index1++] - data2[index2++];
    newdata[i++] = data1[index1++] - data2[index2++];
    newdata[i++] = data1[index1++] - data2[index2++];
    newdata[i] = 255;
    i++;
    index1++;
    index2++;
    if(i%newWidth==0)
    {
      index1 = ++j * image1.width;
      index2 = j * image2.width;
    }
  }
  var newImage = new ImageData(newdata, newWidth, newHeight);
  return newImage;
}


function pixelMultiply ( image1, image2 )
{
  var newHeight = image1.height<image2.height?image1.height:image2.height;
  var newWidth  = image1.width<image2.width?image1.width:image2.width;
  var data1 = image1.data;
  var data2 = image2.data;
  var newdata = new Uint8ClampedArray( newHeight * newWidth * 4 );
  for (var index1 = 0, index2 = 0,i=0,j=0; i < newdata.length;)
  {
    newdata[i++] = data1[index1++] * data2[index2++];
    newdata[i++] = data1[index1++] * data2[index2++];
    newdata[i++] = data1[index1++] * data2[index2++];
    newdata[i] = 255;
    i++;
    index1++;
    index2++;
    if(i%newWidth==0)
    {
      index1 = ++j * image1.width;
      index2 = j * image2.width;
    }
  }
  var newImage = new ImageData(newdata, newWidth, newHeight);
  return newImage;
}

function pixelNot ( data )
{
  for (var i = 0; i < data.length; i += 4)
  {
    data[i]     = 255 - data[i]; // red
    data[i + 1] = 255 - data[i + 1]; // green
    data[i + 2] = 255 - data[i + 2]; // blue
  }
  return data;
}

function pixelAnd ( image1, image2 )
{
  var newHeight = image1.height<image2.height?image1.height:image2.height;
  var newWidth  = image1.width<image2.width?image1.width:image2.width;
  var data1 = image1.data;
  var data2 = image2.data;
  var newdata = new Uint8ClampedArray( newHeight * newWidth * 4 );
  
  for (var index1 = 0, index2 = 0,i=0,j=0; i < newdata.length;)
  {
    newdata[i++] = data1[index1++] & data2[index2++];
    newdata[i++] = data1[index1++] & data2[index2++];
    newdata[i++] = data1[index1++] & data2[index2++];
    newdata[i] = 255;
    i++;
    index1++;
    index2++;
    if(i%newWidth==0)
    {
      index1 = ++j * image1.width;
      index2 = j * image2.width;
    }
  }
  
  var newImage = new ImageData(newdata, newWidth, newHeight);
  
  return newImage;
}


function pixelOr ( image1, image2 )
{
  var newHeight = image1.height<image2.height?image1.height:image2.height;
  var newWidth  = image1.width<image2.width?image1.width:image2.width;
  var data1 = image1.data;
  var data2 = image2.data;
  var newdata = new Uint8ClampedArray( newHeight * newWidth * 4 );
  for (var index1 = 0, index2 = 0,i=0,j=0; i < newdata.length;)
  {
    newdata[i++] = data1[index1++] | data2[index2++];
    newdata[i++] = data1[index1++] | data2[index2++];
    newdata[i++] = data1[index1++] | data2[index2++];
    newdata[i] = 255;
    i++;
    index1++;
    index2++;
    if(i%newWidth==0)
    {
      index1 = ++j * image1.width;
      index2 = j * image2.width;
    }
  }
  var newImage = new ImageData(newdata, newWidth, newHeight);
  return newImage;
}

function pixelXor ( image1, image2 )
{
  
  var newImage = pixelOr ( image1, image2 );
  
  newImage.data = pixelNot ( newImage.data );
  
  return newImage;
}

function pixelConvolution ( image1, mask )
{
  var data1 = image1.data;
  var h = image1.height;
  var w = image1.width;
  var newdata = new Uint8ClampedArray( h * w * 4 );
  for (var i=0; i < newdata.length;)
  {
    for(var inc = 0; inc < 3; inc++, i++)
    {
      newdata[i] =  (data1[ i-(w*4) - 4 ]) * mask[0] + 
                    (data1[ i-(w*4)     ]) * mask[1] + 
                    (data1[ i-(w*4) + 4 ]) * mask[2] +
                    (data1[ i       - 4 ]) * mask[3] +
                    (data1[ i           ]) * mask[4] +
                    (data1[ i       + 4 ]) * mask[5] +
                    (data1[ i+(w*4) - 4 ]) * mask[6] +
                    (data1[ i+(w*4)     ]) * mask[7] +
                    (data1[ i+(w*4) + 4 ]) * mask[8];
    }
    newdata[i++] = 255;
  }
  var newImage = new ImageData(newdata, w, h);
  return newImage;
}
