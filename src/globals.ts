

export var gl: WebGL2RenderingContext;
export function setGL(_gl: WebGL2RenderingContext) {
  gl = _gl;
}

export function readTextFile(file: string): string
{
    var text = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            //console.log("check type get inside");
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                //console.log("check type get inside");
                var allText = rawFile.responseText;
                text = allText;
            }
        }
    }
    rawFile.send(null);

    //console.log('text is: ' + text);
    return text;
}


export function parseTxt(file: string): any 
{
  let raw: string = readTextFile(file);

  var lineArray = raw.split('\n');
  var offsetsArray = [];

  for (var i = 0; i < lineArray.length; i++) {
    var tmpArray = lineArray[i].split(/[ ,]+/);
    //console.log(lineArray[i]);
    offsetsArray.push(parseInt(tmpArray[0]));
    offsetsArray.push(parseInt(tmpArray[1]));
    offsetsArray.push(parseInt(tmpArray[2]));
  }

  return offsetsArray;
}

export function generateTexture(offsetsArray: Array<number>, size: number) : any
{
   
   var length = Math.pow(size, 3);
   var texture = new Array(length);

  //  console.log("offetArray: ");
  //  console.log(offsetsArray);
   texture.fill(-1);
   for(var i = 0; i < offsetsArray.length / 3; i++)
   {
      var x = offsetsArray[3 * i];
      var y = offsetsArray[3 * i + 1];
      var z = offsetsArray[3 * i + 2];

      var index = x + y * size + z * size * size;
      texture[index] = 1;
   }

   return texture;
}



export function handleFileSelect(evt:any) {
    var files = evt.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e:any) {
          var raw = e.target.result;
          // https://developer.mozilla.org/en/JavaScript_typed_arrays
          var rawBytes = new Uint8Array(raw);
          var hex = "";
          for (var cycle = 0 ; cycle < raw.byteLength ; cycle++) {
            hex += rawBytes[cycle].toString(16) + " ";
            // TODO: more elegance
            if (!((cycle + 1) % 8))
                hex += "\n";
          }
          // Render thumbnail.
          var span = document.createElement('pre');
          span.innerHTML = hex;
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);
      // Read in the image file as a data URL.
      reader.readAsArrayBuffer(f);
    }

    return f;
  }
