import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/Login.tsx";
import axios from "axios";
import { useEffect } from "react";
const queryClient = new QueryClient();
function App() {
  useEffect(() => {
    axios.interceptors.request.use((config) => {
      const token = sessionStorage.getItem("jwt");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }, []);
  return (
    <Container maxWidth="xl">
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Car Shop</Typography>
        </Toolbar>
      </AppBar>
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
    </Container>
  );
}

export default App;
