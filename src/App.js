import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Titlebar from './components/Titlebar';
import ImageView from './components/ImageView';
import { hexToRGBA } from './utils/hexToRGBA';

const App = () => {
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [hoverColor, setHoverColor] = useState("#ffffff");
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  useEffect(() => {
    // Receive capture image from main process
    window.ipcRender.receive('capture-image', (image) => {
      setImage(image);
    });

    // Receive capture dimensions from main process
    window.ipcRender.receive('capture-dimensions', (data) => {
      setDimensions(data);
    });
  }, []);

  return (
    <main>
      <Helmet>
        <style>
          {`
            body {
              background-color: #1e293b !important;
            }
          `}
        </style>
      </Helmet>
      <Titlebar />
      <div className="w-[95%] mx-auto mt-5">
          {image && (
            <>
              <ImageView src={image} hoverColor={hoverColor} setHoverColor={setHoverColor} setSelectedColor={setSelectedColor}/>

              <div className="w-[100%] my-5 h-[1px] bg-gradient-to-br from-[#ba3a3c] to-[#5378a9]" />

              {/* Color display */}
              <div className="mx-auto flex items-center justify-center">
                <div className="min-w-[322px] w-[50%] max-w-[430px] rounded-md bg-gradient-to-r from-[#ba3a3c] to-[#5378a9] p-[3px] shadow-2xl">
                  <div className="flex gap-3 flex-col h-full w-full justify-center bg-[#253247] p-2 pb-4 back">
                    <span className="text-center text-white -mt-1">Colors</span>

                    {/* Hover color */}
                    <div className="flex items-center mx-auto">
                      <div className={`min-w-[40px] w-[40px] h-[40px] rounded-lg transition-colors`} style={{ backgroundColor: hoverColor }} />

                      {/* HEX */}
                      <div className="ml-5 text-white bg-[#2c3b54] min-w-[240px] w-[50%] text-sm rounded-lg p-2 shadow-md">
                        <span className="truncate">HEX: {selectedColor.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Selected color */}
                    <div className="flex items-center mx-auto">
                      <div className={`min-w-[40px] w-[40px] h-[40px] rounded-lg transition-colors`} style={{ backgroundColor: selectedColor }} />

                      {/* RGBA */}
                      <div className="ml-5 text-white bg-[#2c3b54] min-w-[240px] w-[50%] text-sm rounded-lg p-2 shadow-md">
                        <span className="truncate">RGB: {hexToRGBA(selectedColor)}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              
              {/* <div className={`w-[100px] h-[100px] transition-colors`} style={{ backgroundColor: hoverColor }} />
              <div className={`w-[100px] h-[100px] transition-colors`} style={{ backgroundColor: selectedColor }} /> */}
            </>
          )}
      </div>
      
    </main>
  );
};

export default App;
