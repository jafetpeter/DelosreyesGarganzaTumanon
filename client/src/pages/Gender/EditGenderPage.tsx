import { useEffect } from "react";
import EditGenderForm from "./components/EditGenderForm";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";


const EditGenderPage = () => {
    useEffect(() => {
        document.title = "Gender Edit Page";
    }, []);

    const {
      message: toastMessage,
      isFailed: toastMessageIsFailed,
      isVisible: toastMessageIsVisible,
      showToastMessage,
      closeToastMessage,
    } = useToastMessage("", false, false);
  return (
    <>
        <ToastMessage
          message={toastMessage}
          isFailed={toastMessageIsFailed}
          isVisible={toastMessageIsVisible}
          onClose={closeToastMessage}
        />
        <EditGenderForm onGenderUpdated={showToastMessage}/>
    </>
  )
}

export default EditGenderPage