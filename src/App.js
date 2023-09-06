import { useState, useEffect } from 'react';

const App = () => {
  const [image, setImage] = useState(null);
  const [boundaries, setBoundaries] = useState(null);

  // Set up listeners from the main process only on page-load
  useEffect(() => {
    // Receive capture image from main process
    window.ipcRender.receive('capture-image', (image) => {
      // console.log("image: " + image);
      setImage(image);
    });

    // Receive capture boundaries from main process
    window.ipcRender.receive('capture-boundaries', (data) => {
      // console.log("boundaries: ", data);
      setBoundaries(data);
    });
  }, []);

  useEffect(() => {
    console.log("image has updated");
    // if (image && boundaries) {
    //   cropImage(image, boundaries);
    // };
  }, [image, boundaries]);

  return (
    <div>
      {image && (
        <img id="capture-image" src={image} alt="Captured screen" />
      )}
      <p id="test">test</p>
    </div>
  );
};

export default App;
