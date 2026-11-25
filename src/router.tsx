import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Cross-fade between pages where the browser supports the View
    // Transitions API; other browsers navigate exactly as before.
    defaultViewTransition: true,
  });

  // After the first client-side page change, mark the document so the
  // fixed header does not replay its load-in animation on every page.
  if (typeof document !== "undefined") {
    router.subscribe("onBeforeNavigate", (event) => {
      if (event.fromLocation && event.pathChanged) {
        document.documentElement.dataset["navigated"] = "true";
      }
    });
  }

  return router;
};
