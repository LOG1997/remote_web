import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import MainPopup from "@/components/MainPopup";
// import Counter from "@/components/Counter.tsx";
// Remember to import Mantine's styles
// import "@mantine/core/styles.css";

// Nothing special here
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      {/*<Counter />*/}
      <MainPopup />
    </MantineProvider>
  </React.StrictMode>,
);
