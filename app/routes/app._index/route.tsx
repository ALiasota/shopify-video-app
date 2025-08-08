import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import StartPage from "./components/StartPage/StartPage";
import { data, useLoaderData, useLocation } from "@remix-run/react";
import AddSlider from "./components/AddSlider/AddSlider";
import SelectVideoPage from "./components/SelectVideoPage/SelectVideoPage";
import { getAllUploadedMerchantVideos } from "app/repository/video/get-all-uploaded-merchant-videos";
import { requireMerchantFromAdmin } from "app/service/require-merchant-from-admin";
import type { VideoDB } from "drizzle/schema.server";
import { SliderStatusEnum, type SliderLayoutTypeEnum, type SliderObjectType, type SliderPlacementTypeEnum } from "./components/types";
import { createSlider } from "app/repository/slider/create-slider";
import { updateShopMetafield } from "app/service/shopify/add-shop-metafields";
import { getMerchantSliders } from "app/repository/slider/get-merchant-sliders";

const TAB_ITEMS = ["start-page", "add-slider"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { merchant } = await requireMerchantFromAdmin(request);

    const videos = await getAllUploadedMerchantVideos(merchant.id);

    return data({ ok: true, videos, currencyCode: merchant.currencyCode, shop: merchant.shop });
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

    if (slider.status === SliderStatusEnum.ACTIVE) {
        const activeSliders = await getMerchantSliders(merchant.id, SliderStatusEnum.ACTIVE);

        if (activeSliders.some((sl) => sl.placement === slider.placement)) {
            return data({ ok: false, message: `There is already active slider with a placement: ${slider.placement}` });
        }

        const metafieldData = [
            ...activeSliders.map((sl) => ({
                placement: sl.placement as SliderPlacementTypeEnum,
                layout: sl.layout as SliderLayoutTypeEnum,
                videosPerRow: sl.videosPerRow,
                autoScrollSeconds: sl.autoScrollSeconds,
                slides: sl.slides.map((slItem) => ({
                    videoUrl: slItem.video.videoUrl!,
                    productHandle: slItem.variant?.product.handle,
                })),
            })),
            {
                placement: slider.placement,
                layout: slider.layout,
                videosPerRow: slider.videosPerRow,
                autoScrollSeconds: slider.autoScrollSeconds,
                slides: slider.slides.map((slItem) => ({
                    videoUrl: slItem.videoUrl,
                    productHandle: slItem.product?.handle,
                })),
            },
        ];

        await updateShopMetafield(graphql, merchant.shopId, metafieldData);
    }

    const createdSlider = await createSlider(slider, merchant.id);

    return data({ ok: true, createdSlider });
};

export default function Index() {
    const { data } = useLoaderData<typeof loader>();

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const currentTab = params.get("tab") || TAB_ITEMS[0];

    return (
        <>
            {currentTab === "start-page" && <StartPage />}
            {currentTab === "add-slider" && <AddSlider currencyCode={data.currencyCode} videos={data.videos as unknown as VideoDB[]} shop={data.shop} />}
            {currentTab === "select-video" && <SelectVideoPage />}
        </>
    );
}
