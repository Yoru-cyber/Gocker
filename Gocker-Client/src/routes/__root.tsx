import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex space-x-2 border-b-2 border-[var(--outline-variant)]">
        <Link
          to="/"
          className="[&.active]:font-bold [&.active]:text-[var(--secondary)]"
        >
          Home
        </Link>{" "}
        <Link
          to="/container"
          className="[&.active]:font-bold [&.active]:text-[var(--secondary)]"
        >
          Containers
        </Link>
        <Link
          to="/about"
          className="[&.active]:font-bold [&.active]:text-[var(--secondary)]"
        >
          About
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
