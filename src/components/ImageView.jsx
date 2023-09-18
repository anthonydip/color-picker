import { useState, useRef } from "react";
import { rgbaToHex } from "../utils/rgbaToHex";
import { getPixelColor } from "../utils/getPixelColor";

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
const ImageView = ({ src, hoverColor, setHoverColor, setSelectedColor }) => {
  const [isHovering, setIsHovering] = useState(false);

  const cursorRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const readImageData = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = imageRef.current.src;

    // Scale image to fit within 800x800
    // TODO: fix canvas sizing and image scaling
    if(img.width > 400 || img.height > 400) {
      canvas.width = 400;
      canvas.height = 400;

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.min(hRatio, vRatio);
      const centerShift_x = ( canvas.width - img.width*ratio ) / 2;
      const centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
      ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.drawImage(img, 0,0, img.width, img.height, centerShift_x,centerShift_y,img.width*ratio, img.height*ratio); 
    }
    else {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }    
  };

  const handleEnter = () => {
    setIsHovering(true);
  };

  const handleLeave = () => {
    setIsHovering(false);
  };

  const handleClick = (event) => {
    setSelectedColor(hoverColor)
  };

  // TO-DO: - seems like the color on the right and bottom edges of the canvas is #000000
  //        - need to fix getPixelColor
  //          - the image is displayed correctly, but on hover, looks like the color under the cursor position is off
  //          - seems like the real image/canvas is shifted to the left slightly?
  //          - the real color will show up correctly if you move the cursor a little to the left of the color you are actually trying to get
  const handleHover = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const rgba = getPixelColor(event, canvas, ctx);

    setHoverColor(rgbaToHex(rgba));

    const offsetY = 20;
    // const offsetX = 20;

    const translateX = event.clientX;
    const translateY = event.clientY - offsetY - imageRef.current.height;
    cursorRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
  };

  return (
    <div>
      <canvas 
        className="mx-auto border-solid border-2 border-gray-500 cursor-crosshair"
        ref={canvasRef}
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onMouseMove={(event) => handleHover(event)}
      />
      <img 
        className="hidden"
        ref={imageRef}
        src={src}
        onLoad={readImageData}
        alt="Captured screen"
      />
      <div 
        className={`absolute h-[100px] w-[100px] bg-slate-300 z-50 block rounded-full ${isHovering ? "block" : "hidden"}`}
        ref={cursorRef}
      />
    </div>
  );
};

export default ImageView;