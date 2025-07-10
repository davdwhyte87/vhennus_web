import type {FeatureRoute} from "../../routes/types.ts";


const chatRoutes:FeatureRoute[] = [
    {
        index:true,
        async lazy(){
            const {default:AllChatsPage}= await import("./Pages/AllChatsPage.tsx");
            return { Component: AllChatsPage}
        }
    },

];

export default chatRoutes;