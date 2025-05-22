import { Car } from "../types.ts";
import DialogContent from "@mui/material/DialogContent";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
type CarDialogContentProps = {
  car: Car;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function CarDialogContent({ car, handleChange }: CarDialogContentProps) {
  return (
    <DialogContent>
        <Stack spacing={2} mt={1} direction="column">
      <TextField
        label="Brand"
        name="brand"
        value={car.brand}
        onChange={handleChange}
      />
      <br />
      <TextField
        label="Model"
        name="model"
        value={car.model}
        onChange={handleChange}
      />
      <br />
      <TextField
        label="Color"
        name="color"
        value={car.color}
        onChange={handleChange}
      />
      <br />
      <TextField
        label="Year"
        name="modelYear"
        value={car.modelYear}
        onChange={handleChange}
      />
      <br />
      <TextField
        label="Reg.nr"
        name="registrationNumber"
        value={car.registrationNumber}
        onChange={handleChange}
      />
      <br />
      <TextField
        label="Price"
        name="price"
        type="number"
        value={car.price}
        onChange={handleChange}
      />
      </Stack>
    </DialogContent>
  );
}
export default CarDialogContent;
