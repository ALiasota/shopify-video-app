import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import StartPage from "./components/StartPage/StartPage";
import { data, useLoaderData, useLocation } from "@remix-run/react";
import AddVideo from "./components/AddVideo/AddVideo";
import SelectVideoPage from "./components/SelectVideoPage/SelectVideoPage";
import { getAllUploadedMerchantVideos } from "app/repository/video/get-all-uploaded-merchant-videos";
import { requireMerchantFromAdmin } from "app/service/require-merchant-from-admin";
import type { VideoDB } from "drizzle/schema.server";
import type { SliderObjectType } from "./components/types";
import { createSlider } from "app/repository/slider/create-slider";
import { addShopMetafields } from "app/service/shopify/add-shop-metafields";

const TAB_ITEMS = ["start-page", "add-video"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { merchant } = await requireMerchantFromAdmin(request);

    const videos = await getAllUploadedMerchantVideos(merchant.id);

    return data({ ok: true, videos, currencyCode: merchant.currencyCode });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        merchant,
        context: {
            admin: { graphql },
        },
    } = await requireMerchantFromAdmin(request);
    const sliderData = await request.json();
    const slider: SliderObjectType = { ...sliderData, slides: JSON.parse(sliderData.slides) };

    const sliderId = await createSlider(slider, merchant.id);

    await addShopMetafields(graphql, merchant.shopId, slider);

    return data({ ok: true, sliderId });
};

export default function Index() {
    const { data } = useLoaderData<typeof loader>();

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const currentTab = params.get("tab") || TAB_ITEMS[0];

    return (
        <>
            {currentTab === "start-page" && <StartPage />}
            {currentTab === "add-video" && <AddVideo currencyCode={data.currencyCode} videos={data.videos as unknown as VideoDB[]} />}
            {currentTab === "select-video" && <SelectVideoPage />}
        </>
    );
}
