import { Car } from "../types";
import DialogContent from "@mui/material/DialogContent";
type CarDialogContentProps = {
  car: Car;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function CarDialogContent({ car, handleChange }: CarDialogContentProps) {
  return (
    <DialogContent>
      <input
        placeholder="Brand"
        name="brand"
        value={car.brand}
        onChange={handleChange}
      />
      <br />
      <input
        placeholder="Model"
        name="model"
        value={car.model}
        onChange={handleChange}
      />
      <br />
      <input
        placeholder="Color"
        name="color"
        value={car.color}
        onChange={handleChange}
      />
      <br />
      <input
        placeholder="Year"
        name="modelYear"
        value={car.modelYear}
        onChange={handleChange}
      />
      <br />
      <input
        placeholder="Reg.nr"
        name="registrationNumber"
        value={car.registrationNumber}
        onChange={handleChange}
      />
      <br />
      <input
        placeholder="Price"
        name="price"
        type="number"
        value={car.price}
        onChange={handleChange}
      />
    </DialogContent>
  );
}
export default CarDialogContent;
