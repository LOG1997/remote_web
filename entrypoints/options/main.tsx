import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { MainOptions } from "@/components/Options";
import '@/styles/tailwind.css';
import { Toaster } from "@/components/ui/sonner";

ReactDOM.createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <Toaster />
            <MainOptions />
        </MantineProvider>
    </React.StrictMode>,
);
