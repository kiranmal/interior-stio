import { Toaster } from "sonner";

function Notification() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={3000}
    />
  );
}

export default Notification;