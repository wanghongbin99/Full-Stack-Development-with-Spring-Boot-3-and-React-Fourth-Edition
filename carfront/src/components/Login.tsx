import { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Carlist from "./Carlist.tsx";

type User = {
  username: string;
  password: string;
};

function Login() {
  const [user, setUser] = useState<User>({
    username: "",
    password: "",
  });
  const [isAuthenticated, setAuth] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  const handleLogin = () => {
    axios
      .post("/login", user, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        const jwtToken = res.headers.authorization;
        console.log("JWT Token:", jwtToken);
        if (jwtToken !== null) {
          sessionStorage.setItem("jwt", jwtToken.substring(6));
          setAuth(true);
        }
      })
      .catch((err) => console.error(err));
  };
  if (isAuthenticated) {
    console.log("User is authenticated");
    return <Carlist />;
  } else {
    return (
      <Stack spacing={2} alignItems="center" mt={2}>
        <TextField name="username" label="Username" onChange={handleChange} />
        <TextField
          type="password"
          name="password"
          label="Password"
          onChange={handleChange}
        />
        <Button variant="outlined" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Stack>
    );
  }
}

export default Login;
