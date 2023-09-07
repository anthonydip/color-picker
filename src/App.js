import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Titlebar from './components/Titlebar';

const App = () => {
  const [image, setImage] = useState(null);
  const [boundaries, setBoundaries] = useState(null);

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
      {image && (
        <img id="capture-image" src={image} alt="Captured screen" />
      )}
    </main>
  );
};

export default App;
