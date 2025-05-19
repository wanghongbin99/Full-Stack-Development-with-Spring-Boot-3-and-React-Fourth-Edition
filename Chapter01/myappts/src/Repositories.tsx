import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Repository {
  id: number;
  full_name: string;
  html_url: string;
}

interface GitHubResponse {
  items: Repository[];
}

function Repositories(props: { q: string }) {
  const { data, error, isLoading } = useQuery<GitHubResponse>({
    queryKey: ["repositories", props.q], // Pass query key as an array
    queryFn: () =>
      axios
        .get(`https://api.github.com/search/repositories?q=${props.q}`)
        .then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Repositories</h2>
      <ul>
        {data?.items.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.full_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Repositories;