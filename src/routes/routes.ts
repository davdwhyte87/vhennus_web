import type { FeatureRoute} from "./types.ts";
import {createBrowserRouter} from "react-router-dom"
import homeRoutes from "../features/Feed/HomeRoutes.ts";

const routes: FeatureRoute[] = [
    {
        path: "/",
        async lazy(){
            const {default: HomeLayout} = await import("../layouts/HomeLayout.tsx");
            return { Component:HomeLayout};
        },
        children: [
            ...homeRoutes,
            {
                path:"chats",
                async lazy(){
                    const {default:Homepage} = await import("../features/Feed/pages/HomePage.tsx");
                    return { Component:Homepage};
                }
            }

        ]
    }
];
const router = createBrowserRouter(routes);

export default router;