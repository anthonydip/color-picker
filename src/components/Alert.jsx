import { BsCheckLg } from "react-icons/bs";
import { Transition } from "@headlessui/react";

const Alert = ({ alertText, isAlertOpen }) => {
  return (
    <>
      <Transition
        show={isAlertOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed left-[50%] bg-[#5378a9] bottom-0 -translate-y-[50%] -translate-x-[50%] p-4 rounded-xl flex items-center gap-2">
          <span className="text-center text-white text-sm">{alertText}</span>
          <BsCheckLg className="text-green-500" size="1.2rem" />
        </div>
      </Transition>
    </>
  );
};

export default Alert;