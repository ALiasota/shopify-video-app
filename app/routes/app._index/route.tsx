import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../../shopify.server";
import StartPage from "./components/StartPage/StartPage";

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
    return <StartPage />;
}
