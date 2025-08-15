import { TriangleAlertIcon } from "lucide-react";
import Button from "./Button.jsx";

const ConfirmModal = ({
                        isOpen,
                        text = "You're going to delete user account",
                        onConfirm,
                        onCancel
                      }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-dark-06/70"
        onClick={onCancel}
      ></div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   bg-dark-12 w-80 rounded-2xl p-5 flex flex-col items-center justify-center"
      >
        <span className="text-2xl font-bold text-brown-60 my-2">
          <TriangleAlertIcon />
        </span>
        <p className="text-xl font-bold text-brown-60 text-center">{text}</p>

        <div className="w-full gap-2 mt-4 flex justify-between items-center">
          <Button
            className="!bg-brown-60 w-full"
            text="Ok"
            onClick={onConfirm}
          />
          <Button
            className="!bg-dark-06 w-full"
            text="Cancel"
            isTransparent
            onClick={onCancel}
          />
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
