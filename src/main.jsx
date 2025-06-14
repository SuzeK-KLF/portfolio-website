import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { App as AntApp } from "antd";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AntApp>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AntApp>
    </StrictMode>
);
