import { AiOutlineClose, AiOutlineBorder, AiOutlineMinus } from "react-icons/ai";
import logo from "../assets/logo.ico";

const Titlebar = () => {

  const handleClose = () => {
    console.log("closing");
    window.ipcRender.send("main-close", "close");
  };

  const handleMinimize = () => {
    console.log("minimizing");
    window.ipcRender.send("main-minimize", "minimize");
  };

  const handleMaximize = () => {
    console.log("maximizing");
    window.ipcRender.send("main-maximize", "maximize");
  };

  return (
    <div className="flex justify-between items-center bg-slate-900 h-8">
      <div className="flex items-center h-8 w-[7.5rem]">
        <img src={logo} alt="logo" className="ml-2 h-5 w-5" />
      </div>
      <p className="text-slate-400">Color Picker</p>
      <div>
        <button
          className="h-8 w-10 hover:bg-slate-600 active:bg-slate-500"
          onClick={handleMinimize}
        >
          <AiOutlineMinus className="text-slate-400 mx-auto" />
        </button>
        <button
          className="h-8 w-10 hover:bg-slate-600 active:bg-slate-500"
          onClick={handleMaximize}
        >
          <AiOutlineBorder className="text-slate-400 mx-auto" />
        </button>
        <button
          className="h-8 w-10 hover:bg-red-600 active:bg-red-800 text-slate-400 hover:text-white active:text-white"
          onClick={handleClose}
        >
          <AiOutlineClose className="mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default Titlebar;