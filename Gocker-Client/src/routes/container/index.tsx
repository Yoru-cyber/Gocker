import { createFileRoute, Link } from "@tanstack/react-router";
import { IContainer } from "../../shared/interfaces/IContainer";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/container/")({
  component: Index,
});
const fetchContainers = async (): Promise<IContainer[]> => {
  return await fetch("http://localhost:3000/api/v1/containers/all").then(
    async (res) => {
      return await res.json();
    }
  );
};
function Index() {
  const { status, data } = useQuery({
    queryKey: ["containers"],
    queryFn: () => fetchContainers(),
    refetchIntervalInBackground: true,
    refetchInterval: 30000,
  });

  if (status == "pending") return "Loading...";

  if (status == "error") return "An error has occurred: " + status;
  return (
    <>
      <div className="p-2">
        <h3 className="text-3xl">
          Containers: {Array.isArray(data) && data.length}
        </h3>
      </div>
      <div>
        {Array.isArray(data) &&
          data.map((container: IContainer) => (
            <div
              id={container.Id}
              key={container.Id}
              className="bg-[var(--complementary-dark)] space-y-2 mb-5 rounded-md w-fit p-5"
            >
              <h2>Container Details</h2>
              <p>ID: {container.Id}</p>
              <p>Names: {container.Names[0]}</p>
              <p>State: {container.State}</p>
              <p>Status: {container.Status}</p>
              <p>Image: {container.Image}</p>
              <Link
                className=" rounded-md italic text-[var(--primary)]"
                to="/container/$containerId"
                params={{ containerId: container.Id }}
              >
                Details
              </Link>
            </div>
          ))}
      </div>
    </>
  );
}
