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
      <main className="w-screen h-screen">
        <div className="p-2">
          <h3 className="text-3xl font-semibold">
            Currently running{" "}
            <b className="text-[var(--tertiary)]">
              {Array.isArray(data) && data.length}
            </b>{" "}
            Containers
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 m-2 justify-items-center">
          {Array.isArray(data) &&
            data.map((container: IContainer) => (
              <div
                id={container.Id}
                key={container.Id}
                className="bg-[var(--complementary-dark)] space-y-2 mb-5 rounded-md w-fit p-5 border-2 border-[var(--outline-variant)]"
              >
                <p className="text-xl font-semibold text-center">
                  {container.Names[0]}
                </p>
                <p>ID: {container.Id}</p>
                <p>
                  State:
                  <p
                    style={{
                      color:
                        container.State === "running"
                          ? "green"
                          : container.State === "stopped"
                            ? "red"
                            : "black",
                      display: "inline",
                      marginLeft: "0.5em",
                    }}
                  >
                    {container.State.charAt(0).toUpperCase() +
                      container.State.slice(1)}
                  </p>
                </p>
                <p>Status: {container.Status}</p>
                <p>Image: {container.Image}</p>
                <span className="inline-flex justify-center w-full">
                  <Link
                    className=" rounded-md italic text-[var(--primary)] transition-all hover:text-[var(--primary-variant-3)]"
                    to="/container/$containerId"
                    params={{ containerId: container.Id }}
                  >
                    Details
                  </Link>
                </span>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
