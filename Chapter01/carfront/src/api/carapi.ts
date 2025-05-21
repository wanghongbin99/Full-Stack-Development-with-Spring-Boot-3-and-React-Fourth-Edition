import { CarResponse, Car, CarEntry } from "../types";
import axios from "axios";
export const getCars = async (): Promise<CarResponse[]> => {
  const response = await axios.get(`/api/cars`);
  return response.data._embedded.cars;
};

export const deleteCar = async (link: string): Promise<CarResponse> => {
  console.log("Deleting car with link:", link);
  const response = await axios.delete(link);
  return response.data;
};

// Add a new car
export const addCar = async (car: Car): Promise<CarResponse> => {
  const response = await axios.post(`/api/cars`, car, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Update an existing car
export const updateCar = async (car: CarEntry): Promise<CarResponse> => {
  const response = await axios.put(car.url, car.car, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const login = async (user: {
  username: string;
  password: string;
}): Promise<string> => {
  const response = await axios.post("/login", user, {
    headers: { "Content-Type": "application/json" },
  });
  const jwtToken = response.headers.authorization;
  if (jwtToken !== null) {
    sessionStorage.setItem("jwt", jwtToken);
  }
  return jwtToken;
};
export const logout = async (): Promise<void> => {
  await axios.post("/logout");
  sessionStorage.removeItem("jwt");
};
