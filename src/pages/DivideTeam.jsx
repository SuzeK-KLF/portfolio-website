import { useEffect } from "react";
import { uploadPlayers } from "../utils/uploadPlayers";

const DivideTeam = () => {
    useEffect(() => {
        console.log('start uploding..')
        // uploadPlayers(); 
    }, []);
    return (
        <div>
            <h1>Team Divider</h1>
            {/* Your logic/UI for player input and team splitting */}
        </div>
    );
};

export default DivideTeam;
