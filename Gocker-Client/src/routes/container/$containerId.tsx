import { createFileRoute } from "@tanstack/react-router";
import { IContainer } from "../../shared/interfaces/IContainer";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/container/$containerId")({
  component: RouteComponent,
});
const fetchContainer = async (containerId: string): Promise<IContainer> => {
  return await fetch(
    "http://localhost:3000/api/v1/containers/" + containerId
  ).then(async (res) => {
    return await res.json();
  });
};
function RouteComponent() {
  const { containerId } = Route.useParams();
  const { status, data } = useQuery({
    queryKey: ["containers"],
    queryFn: () => fetchContainer(containerId),
    refetchInterval: 15000,
  });
  if (status == "pending") return "Loading...";
  if (status == "error") return "An error has occurred: " + status;
  return (
    <>
      <div id={data.Id}>
        <h2>Container Details</h2>
        <a href={"/container/" + data.Id}>ID: {data.Id}</a>
        <p>
          Names:{" "}
          {
            //@ts-expect-error property not implemented
            data.Name
          }
        </p>
        <p>Image: {data.Image}</p>
      </div>
    </>
  );
}
