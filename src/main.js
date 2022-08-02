const contenedorQR = document.getElementById("contenedorQR");
const formulario = document.getElementById("formulario");

const QR = new QRCode(contenedorQR);

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    QR.makeCode(formulario.link.value);
});

var app = ( function () {
  var canvas = document.getElementById( 'canvas' ),
      context = canvas.getContext( '2d' ),

      // API
      public = {};      

      // Public methods goes here...
      public.loadPicture = function () {
          var imageObj = document.querySelector("#contenedorQR > img");

          imageObj.onload = function () {                            
              if(imageObj.naturalWidth > 1920){
                  canvas.height = imageObj.naturalHeight/3;
                  canvas.width = imageObj.naturalWidth/3;
              } else if(imageObj.naturalWidth >= 1280){
                  canvas.height = imageObj.naturalHeight/2;
                  canvas.width = imageObj.naturalWidth/2;
              } else {
                  canvas.height = imageObj.naturalHeight;
                  canvas.width = imageObj.naturalWidth;
              }                            
              context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
          }
      };

      public.getImgData = function () {
          return context.getImageData( 0, 0, canvas.width, canvas.height );
      };

      // Filters
      public.filters = {};      

      let colorPicker = document.querySelector("#input-color");
      let color = "#000000";
      let colorRed = 00;
      let colorGreen = 00;
      let colorBlue = 00;

      colorPicker.addEventListener(('change'), (e) => {
        color = colorPicker.value;
        let hex_code = color.split("");
        let red = parseInt(hex_code[1]+hex_code[2],16);
        colorRed = red;
        let green = parseInt(hex_code[3]+hex_code[4],16);
        colorGreen = green;
        let blue = parseInt(hex_code[5]+hex_code[6],16);
        colorBlue = blue;
        let rgb = red+","+green+","+blue;
        color = rgb;
      })

      public.filters.darkAlpha = function () {
        var imageData = app.getImgData(),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height;
    
        for ( var i = 0; i < numPixels; i++ ) {
            var r = pixels[ i * 4 ];
            var g = pixels[ i * 4 + 1 ];
            var b = pixels[ i * 4 + 2 ];
            var a = pixels[ i * 4 + 3 ];
            var j = 50;

            pixels[ i * 4 ] = r;
            pixels[ i * 4 + 1 ] = g;
            pixels[ i * 4 + 2 ] = b;
            pixels[ i * 4 + 3 ] = ((r < j) && (g < j) && (b < j) && (a > j)) ? 0 : a;
        }

        context.putImageData( imageData, 0, 0 );
      };

      public.filters.lightAlpha = function () {
        var imageData = app.getImgData(),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height;
    
        for ( var i = 0; i < numPixels; i++ ) {
            var r = pixels[ i * 4 ];
            var g = pixels[ i * 4 + 1 ];
            var b = pixels[ i * 4 + 2 ];
            var a = pixels[ i * 4 + 3 ];
            var j = 200;

            pixels[ i * 4 ] = r;
            pixels[ i * 4 + 1 ] = g;
            pixels[ i * 4 + 2 ] = b;
            pixels[ i * 4 + 3 ] = ((r > j) && (g > j) && (b > j) && (a > 0)) ? 0 : a;
        }

        context.putImageData( imageData, 0, 0 );
      };

      public.filters.blackToColor = function () {
        var imageData = app.getImgData(),
            pixels = imageData.data,
            numPixels = imageData.width * imageData.height;
    
        for ( var i = 0; i < numPixels; i++ ) {
            var r = pixels[ i * 4 ];
            var g = pixels[ i * 4 + 1 ];
            var b = pixels[ i * 4 + 2 ];

            pixels[ i * 4 ] = ((r <= g + 10 || r >= g - 10) && (r <= b + 10 || r >= b - 10) && r < 50) ? colorRed : r;
            pixels[ i * 4 + 1 ] = ((g <= r + 10 || g >= r - 10) && (g <= b + 10 || g >= b - 10) && g < 50) ? colorGreen : g;
            pixels[ i * 4 + 2 ] = ((b <= r + 10 || b >= r - 10) && (b <= g + 10 || b >= g - 10) && g < 50) ? colorBlue : b;
        }

        context.putImageData( imageData, 0, 0 );
      };

      public.save = function () {
          var link = window.document.createElement( 'a' ),
              url = canvas.toDataURL(),
              filename = 'screenshot.jpg';
      
          link.setAttribute( 'href', url );
          link.setAttribute( 'download', filename );
          link.style.visibility = 'hidden';
          window.document.body.appendChild( link );
          link.click();
          window.document.body.removeChild( link );
      };

      return public;
} () );