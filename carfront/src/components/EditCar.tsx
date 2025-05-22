import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Car, CarResponse,CarEntry } from "../types.ts";
import CarDialogContent from "./CarDialogContent.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCar } from "../api/carapi.ts";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
type FormProps = {
  cardata: CarResponse;
};
function EditCar({ cardata }: FormProps) {
  const [open, setOpen] = useState(false);
  const [car, setCar] = useState<Car>({
    brand: cardata.brand,
    model: cardata.model,
    color: cardata.color,
    registrationNumber: cardata.registrationNumber,
    modelYear: cardata.modelYear,
    price: cardata.price,
  });
  // Get query client
  const queryClient = useQueryClient();
  // Use useMutation hook
  const { mutate } = useMutation(updateCar, {
    onSuccess: () => {
      queryClient.invalidateQueries(["cars"]);
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const handleClickOpen = () => {
    setCar({
      brand: cardata.brand,
      model: cardata.model,
      color: cardata.color,
      registrationNumber: cardata.registrationNumber,
      modelYear: cardata.modelYear,
      price: cardata.price,
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCar({ ...car, [event.target.name]: event.target.value });
  };
  const handleSave = () => {
    // Call the API to save the car data
    console.log("Car data saved:", car);
    const url = new URL(cardata._links.self.href).pathname;
    //const path = new URL(url).pathname;
    const carEntry: CarEntry = { car, url };
    mutate(carEntry);
    setCar({
      brand: "",
      model: "",
      color: "",
      registrationNumber: "",
      modelYear: 0,
      price: 0,
    });
    // Close the modal form
    handleClose();
  };
  return (
    <>
      <Tooltip title="Edit car" arrow>
        <IconButton size="small" onClick={handleClickOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit car</DialogTitle>
        <CarDialogContent car={car} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default EditCar;
