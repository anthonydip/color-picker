import { useState, useEffect } from 'react';
import Titlebar from './components/Titlebar';
import ImageView from './components/ImageView';
import { hexToRGBA } from './utils/hexToRGBA';
import { IoCopyOutline } from 'react-icons/io5';
import Alert from './components/Alert';

const App = () => {
  const [image, setImage] = useState(null);
  const [hoverColor, setHoverColor] = useState("#ffffff");
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertTimeout, setAlertTimeout] = useState(null);

  useEffect(() => {
    // Receive capture image from main process
    window.ipcRender.receive('capture-image', (image) => {
      setImage(image);
    });

    // Remove ipcRender listeners when app is exited
    window.addEventListener("beforeunload", (event) => {
      window.ipcRender.removeAllListeners('capture-image');
    });
  }, []);

  const copyHexToClipboard = () => {
    // Check if alert is already opened
    if(isAlertOpen) {
      setAlertTimeout(clearTimeout(alertTimeout));
      setIsAlertOpen(false);
      setAlertText("");
    }

    setIsAlertOpen(true);
    setAlertText("Copied HEX to clipboard!");
    navigator.clipboard.writeText(selectedColor.toUpperCase());

    setAlertTimeout(setTimeout(() => {
      setIsAlertOpen(false);
    }, 3000));
  };

  const copyRGBToClipboard = () => {
    // Check if alert is already opened
    if(isAlertOpen) {
      setAlertTimeout(clearTimeout(alertTimeout));
      setIsAlertOpen(false);
      setAlertText("");
    }

    setIsAlertOpen(true);
    setAlertText("Copied RGB to clipboard!");
    navigator.clipboard.writeText(hexToRGBA(selectedColor));

    setAlertTimeout(setTimeout(() => {
      setIsAlertOpen(false);
    }, 3000));
  };

  return (
    <main>
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
                      <div className="flex items-center justify-between ml-5 text-white bg-[#2c3b54] min-w-[240px] w-[50%] text-sm rounded-lg p-2 shadow-md">
                        <span className="truncate">HEX: {selectedColor.toUpperCase()}</span>
                        <IoCopyOutline onClick={copyHexToClipboard} className="cursor-pointer" size="1.2rem" />
                      </div>
                    </div>

                    {/* Selected color */}
                    <div className="flex items-center mx-auto">
                      <div className={`min-w-[40px] w-[40px] h-[40px] rounded-lg transition-colors`} style={{ backgroundColor: selectedColor }} />

                      {/* RGBA */}
                      <div className="flex items-center justify-between ml-5 text-white bg-[#2c3b54] min-w-[240px] w-[50%] text-sm rounded-lg p-2 shadow-md">
                        <span className="truncate">RGB: {hexToRGBA(selectedColor)}</span>
                        <IoCopyOutline onClick={copyRGBToClipboard} className="cursor-pointer" size="1.2rem" />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </>
          )}
      </div>
      
      <Alert alertText={alertText} isAlertOpen={isAlertOpen} />
    </main>
  );
};

export default App;
