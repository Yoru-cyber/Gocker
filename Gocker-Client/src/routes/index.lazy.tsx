import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});
function Index() {
  return (
    <>
      <h1>Index</h1>
    </>
  );
}
