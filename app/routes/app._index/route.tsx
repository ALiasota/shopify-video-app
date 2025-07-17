import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../../shopify.server";
import StartPage from "./components/StartPage/StartPage";
import { useLocation } from "@remix-run/react";
import AddVideo from "./components/AddVideo/AddVideo";
import SelectVideoPage from "./components/SelectVideoPage/SelectVideoPage";

const TAB_ITEMS = ["start-page", "add-video"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);

    return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);

    return {
        admin,
    };
};

export default function Index() {
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const currentTab = params.get("tab") || TAB_ITEMS[0];

    return (
        <>
            {currentTab === "start-page" && <StartPage />}
            {currentTab === "add-video" && <AddVideo />}
            {currentTab === "select-video" && <SelectVideoPage />}
        </>
    );
}
