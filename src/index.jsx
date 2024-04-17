import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import r2wc from "@r2wc/react-to-web-component";
import CollectionDays from "./App";

// const binCollections = r2wc(CollectionDays, { props: { uprn: "" } });
const queryClient = new QueryClient();

// customElements.define("upcoming-bin-collections", CollectionDays);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CollectionDays />
    </QueryClientProvider>
  </StrictMode>,
);
