import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DeepOcean from "./pages/DeepOcean";
import DivideTeam from "./pages/DivideTeam";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deep-ocean" element={<DeepOcean />} />
            <Route path="/deep-ocean/divide-team" element={<DivideTeam />} />
        </Routes>
    );
};

export default App;
