import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { setTokenInHeader } from "./api";

setTokenInHeader();

createRoot(document.getElementById("root")).render(<App />);
