import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "react-query";
import { IContainer } from "../shared/interfaces/IContainer";

export const Route = createLazyFileRoute("/")({
  component: Index,
});
function Index() {
  const { isLoading, error, data } = useQuery<IContainer[], Error>(
    "repoData",
    () =>
      fetch("http://localhost:3000/api/v1/containers/all").then((res) =>
        res.json()
      )
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  console.log(data);
  return (
    <>
      <div className="p-2">
        <h3 className="text-3xl">Welcome Home!</h3>
      </div>
      <div>
        {data?.map((container) => (
          <>
            <div id={container.Id}>
              <h2>Container Details</h2>
              <p>ID: {container.Id}</p>
              <p>Names: {container.Names[0]}</p>
              <p>Image: {container.Image}</p>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
