import React from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  login: () => { isLoggedIn: true },
  logout: () => {isLoggedIn: false},
});

export default AuthContext;
