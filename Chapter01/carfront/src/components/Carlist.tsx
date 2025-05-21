import { useState } from "react";
import { CarResponse } from "../types.ts";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCars, deleteCar } from "../api/carapi.ts";
import { Snackbar } from "@mui/material";
import EditCar from "./EditCar.tsx";
import AddCar from "./AddCar.tsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
function Carlist() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(deleteCar, {
    onSuccess: () => {
      // Car deleted
      setOpen(true);
      console.log("Car deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (err: unknown) => {
      console.error(err);
    },
  });
  const columns: GridColDef[] = [
    { field: "brand", headerName: "Brand", width: 200 },
    { field: "model", headerName: "Model", width: 200 },
    { field: "color", headerName: "Color", width: 200 },
    { field: "registrationNumber", headerName: "Reg.nr.", width: 150 },
    { field: "modelYear", headerName: "Model Year", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
    {
      field: "edit",
      headerName: "",
      width: 90,
      renderCell: (params: GridCellParams) => <EditCar cardata={params.row} />,
    },

    {
      /**
       * Renders a delete button for each car row in the DataGrid.
       * When the button is clicked, it prompts the user for confirmation
       * and deletes the car if confirmed.
       *
       * @param {GridCellParams} params - The parameters for the cell, including the row data.
       * @returns {JSX.Element} The delete button component.
       */
      disableColumnMenu: true,
      renderCell: (params: GridCellParams) => (
        <IconButton
          size="small"
          aria-label="delete"
          color="error"
          onClick={() => {
            const carId = params.row._links.self.href;
            const path = new URL(carId).pathname;
            // Add your delete logic here
            if (window.confirm("Are you sure you want to delete this car?")) {
              console.log("Deleting car with ID:", path);
              mutate(path);
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      ),

      field: "delete",
      headerName: "",
      width: 90,
      sortable: false,
      filterable: false,

    },
  ];
  const { data, error, isSuccess } = useQuery<CarResponse[], Error>(
    ["cars"],
    getCars
  );
  if (!isSuccess) {
    return <span>Loading...</span>;
  } else if (error) {
    console.error("Error fetching cars:", error);
    return <div>Error fetching cars</div>;
  } else {
    return (
      <>
        <AddCar />
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row._links.self.href}
          showToolbar
        />
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          message="Car deleted successfully"
          action={<button onClick={() => setOpen(false)}>Close</button>}
        />
      </>
    );
  }
}

export default Carlist;
