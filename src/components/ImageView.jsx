import { useState, useEffect, useRef } from "react";

// https://stackoverflow.com/questions/54972131/im-trying-to-get-this-cursor-effect-on-react
const ImageView = ({ src, dimensions }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({});

  const cursorRef = useRef(null);
  const animationFrame = null;

  const handleEnter = () => {
    console.log("enter");
    setIsHovering(true);
  }

  const handleLeave = () => {
    console.log("leave");
    setIsHovering(false);
  }

  const handleHover = (event) => {
    console.log("pos: ", event.clientX, event.clientY);
    console.log(dimensions);
    const offsetY = 20;
    const offsetX = 20;

    const translateX = event.clientX;
    const translateY = event.clientY - offsetY - dimensions.height;
    // need to edit translate pixels to be relative to the image
    //  - cursor div will always start under the bottom left of the image
    //  - need to translate up based on the image height + half of the div's height
    cursorRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
  };

  return (
    <div>
      <img 
        className="mx-auto w-fit h-[98%] border-solid border-2 border-gray-500 cursor-crosshair"
        id="capture-image"
        src={src}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onMouseMove={(event) => handleHover(event)}
        alt="Captured screen" 
      />
      <div 
        className={`absolute h-[75px] w-[75px] bg-slate-300 rounded-full z-50 ${isHovering ? "block" : "hidden"}`}
        ref={cursorRef}
      />
    </div>
  );
};

export default ImageView;