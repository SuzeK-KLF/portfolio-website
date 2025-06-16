import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DeepOcean from "./pages/deepOcean/DeepOcean";
import DivideTeam from "./pages/DivideTeam";
import TeamBuilding from "./pages/teamBuilding/TeamBuilding";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deep-ocean" element={<DeepOcean />} />
            <Route path="/deep-ocean/divide-team" element={<DivideTeam />} />
            <Route path="/deep-ocean/team-building" element={<TeamBuilding />} />
        </Routes>
    );
};

export default App;
