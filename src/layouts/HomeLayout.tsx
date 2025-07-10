import HomeBottomNav from "../features/Feed/Components/HomeBottomNav.tsx";
import {Outlet} from "react-router-dom";

const HomeLayout:React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen-safe">
            <div className="flex-grow overflow-hidden pb-24">
                <Outlet/>
            </div>
            <HomeBottomNav/>
        </div>
    )
}

export default HomeLayout