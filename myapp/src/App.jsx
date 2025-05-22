import { useEffect, useState, useRef } from "react";
import "./App.css";
import useTitle from "./useTitle";
import AuthContext from "./AuthContext";
import MyList from "./MyList";
import MyForm from "./MyForm";
function App(props) {
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);
  const [name, setName] = useState({
    firstName: "John",
    lastName: "Johnson",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useTitle(`${count} - ${name.firstName} ${name.lastName} - ${props.name}`);
  useEffect(() => {
    console.log("Hello from useEffect" + count);
    setName({
      firstName: "Hongbin",
      lastName: "Wang",
    });
    return () => {
      console.log("Goodbye from useEffect" + count);
    };
  }, [count]);

  return (
    <AuthContext.Provider value={isLoggedIn}>
      <input ref={inputRef} type="text" />
      <h1>Hello World, {props.name}, {`Login Status ${isLoggedIn}`}</h1>
      <h2>This is my first component {count}</h2>
      <button
        onClick={() => {
          setCount(count + 1);
          setIsLoggedIn(!isLoggedIn);
          console.log("Hello from button" + count);
          inputRef.current.focus();
          inputRef.current.value = "Hello from button";

        }}
      >
        Click me
      </button>
      <p>
        {name.firstName} {name.lastName}
      </p>
      <p>
        <MyList items={["Item 1", "Item 2", "Item 3"]} />
      </p>
      <MyForm />
    </AuthContext.Provider>
  );
}

export default App;
