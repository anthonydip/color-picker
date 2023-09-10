import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Titlebar from './components/Titlebar';
import ImageView from './components/ImageView';

const App = () => {
  const [image, setImage] = useState(null);
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    // Receive capture image from main process
    window.ipcRender.receive('capture-image', (image) => {
      // console.log("image: " + image);
      setImage(image);
    });

    // Receive capture dimensions from main process
    window.ipcRender.receive('capture-dimensions', (data) => {
      // console.log("boundaries: ", data);
      console.log("data: ", data);
      setDimensions(data);
    });
  }, []);

  useEffect(() => {
    console.log("image has updated");
    console.log("dimensions: ", dimensions);
    // if (image && boundaries) {
    //   cropImage(image, boundaries);
    // };
  }, [image, dimensions]);

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
              <ImageView src={image} dimensions={dimensions}/>

              <div className="w-[100%] my-5 h-[1px] bg-gradient-to-br from-[#ba3a3c] to-[#5378a9]" />
            </>
          )}
      </div>
      
    </main>
  );
};

export default App;
