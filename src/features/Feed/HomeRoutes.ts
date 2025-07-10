import type {FeatureRoute} from "../../routes/types.ts";


const homeRoutes:FeatureRoute[] = [

    {
        path:"feed",
        async lazy(){
            const {default:Homepage}= await import("./pages/HomePage.tsx");
            return { Component: Homepage}
        }
    }
];

export default homeRoutes;