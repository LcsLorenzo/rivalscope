/// <reference types="vite/client" />
import { StartClient }  from "@tanstack/react-start/client";
import { hydrateRoot }  from "react-dom/client";
import "./styles/globals.css";

hydrateRoot(document, <StartClient />);
