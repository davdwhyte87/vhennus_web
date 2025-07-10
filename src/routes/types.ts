import type {RouteObject} from "react-router-dom";

export type AppRoute = {
    name?: string;
    requiresAuth?: boolean;
} & RouteObject;


export type FeatureRoute = RouteObject & {
    name?: string;
    requiresAuth?: boolean;
    children?: FeatureRoute[];
};

export interface UserRouteParams {
    userId: string;
}