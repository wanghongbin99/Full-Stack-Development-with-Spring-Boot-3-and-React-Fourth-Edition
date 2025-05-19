import { useState } from "react";
import "./App.css";
import axios from "axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import Repositories from "./Repositories";

type HelloComponentProps = {
  sname: string;
  age: number;
};

type Repository = {
  id: number;
  full_name: string;
  html_url: string;
  description: string;
};
const queryClient = new QueryClient();

function HelloComponent({ sname, age }: HelloComponentProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const handleClick = () => {
    axios
      .get(`https://api.github.com/search/repositories?q=${keyword}`)
      .then((response) => {
        setRepositories(response.data.items);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <>
      <h1>
        Hello {sname}, World! {age}
      </h1>
      <input
        type="text"
        value={keyword}
        onChange={handleChange}
        placeholder="Search for repositories"
      />
      <button onClick={handleClick}>Search</button>

      <h2>Search Results:</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>URL</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {repositories.map((repo) => (
            <tr key={repo.id}>
              <td>{repo.id}</td>
              <td>{repo.full_name}</td>
              <td>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.html_url}
                </a>
              </td>
              <td>{repo.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

        <QueryClientProvider client={queryClient}>
            <Repositories q={keyword}/>
        </QueryClientProvider>

    </>
  );
}

export default HelloComponent;
