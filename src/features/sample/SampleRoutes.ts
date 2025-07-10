import type {FeatureRoute} from "../../routes/types.ts";


const chatRoutes:FeatureRoute[] = [
    {
        index:true,
        async lazy(){
            const {default:Homepage}= await import("../Feed/pages/HomePage.tsx");
            return { Component: Homepage}
        }
    },

];

export default chatRoutes;