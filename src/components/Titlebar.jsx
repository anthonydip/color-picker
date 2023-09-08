import { AiOutlineClose, AiOutlineBorder, AiOutlineMinus } from "react-icons/ai";

const Titlebar = () => {

  const handleClose = () => {
    console.log("closing");
  }

  return (
    <div className="flex justify-between items-center bg-slate-900 h-8">
      <div className="h-8 w-[7.5rem]">
        {/* Icon? */}
      </div>
      <p className="text-slate-400">Color Picker</p>
      <div>
        <button
          className="h-8 w-10 hover:bg-slate-600 active:bg-slate-500"
          onClick={handleClose}
        >
          <AiOutlineMinus className="text-slate-400 mx-auto" />
        </button>
        <button
          className="h-8 w-10 hover:bg-slate-600 active:bg-slate-500"
          onClick={handleClose}
        >
          <AiOutlineBorder className="text-slate-400 mx-auto" />
        </button>
        <button
          className="h-8 w-10 hover:bg-red-600 active:bg-red-700 text-slate-400 hover:text-white"
          onClick={handleClose}
        >
          <AiOutlineClose className="mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default Titlebar;