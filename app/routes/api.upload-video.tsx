import type { ActionFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";
import { requireMerchantFromAdmin } from "app/service/require-merchant-from-admin";
import { uploadToShopifyVideo } from "app/service/shopify/video/upload-to-shopify-video";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        // merchant,
        context: {
            admin: { graphql },
        },
    } = await requireMerchantFromAdmin(request);

    const formData = await request.formData();
    const file = formData.get("video");

    if (!file || typeof file === "string") {
        return data({ error: "No file uploaded" }, { status: 400 });
    }

    const videoData = await uploadToShopifyVideo(graphql, file);
    return data({ ok: true, videoData });
};
