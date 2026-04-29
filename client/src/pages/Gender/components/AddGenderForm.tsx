import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import GenderService from "../../../services/GenderService";
import type { GenderFieldErrors } from "../../../Interfaces/GenderInterface";
interface AddGenderFormprops {
  onGenderAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddGenderForm: FC<AddGenderFormprops> = ({
  onGenderAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<GenderFieldErrors>({});

  const handleStoreGender = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const clientErrors: GenderFieldErrors = {};

      if (!gender.trim()) {
        clientErrors.gender = ["The gender field is required."];
      }

      if (Object.keys(clientErrors).length > 0) {
        setErrors(clientErrors);
        return;
      }

      setErrors({});
      setLoadingStore(true);

      const res = await GenderService.storeGender({ gender });

      if (res.status === 200) {
        setGender("");
        setErrors({});

        onGenderAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occured during store gender: ",
          res.data,
        );
      }
    } catch (error: unknown) {
      const axiosLikeError = error as { response?: { status?: number; data?: unknown } };
      if (axiosLikeError.response?.status === 422) {
        const data = axiosLikeError.response.data;
        if (typeof data === "object" && data !== null && "errors" in data) {
          const maybeErrors = (data as { errors?: GenderFieldErrors }).errors;
          if (maybeErrors) setErrors(maybeErrors);
        }
      } else {
        console.error(
          "Unexpected server error occured during store gender: ",
          error,
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };
  return (
    <>
      <form onSubmit={handleStoreGender}>
        <div className="mb-4">
          <FloatingLabelInput
            label="Gender"
            type="text"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            autoFocus
            errors={errors.gender}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton
            label="Save Gender"
            loading={loadingStore}
            loadingLabel="Saving Gender..."
          />
        </div>
      </form>
    </>
  );
};

export default AddGenderForm;
