import type { ActionFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";
import { requireMerchantFromAdmin } from "app/service/require-merchant-from-admin";
import { uploadToShopifyFiles } from "app/service/shopify/video/upload-to-shopify-files";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        merchant,
        context: {
            admin: { graphql },
        },
    } = await requireMerchantFromAdmin(request);

    const formData = await request.formData();
    const file = formData.get("video");

    if (!file || typeof file === "string") {
        return data({ error: "No file uploaded" }, { status: 400 });
    }

    const videoData = await uploadToShopifyFiles(graphql, file);
    return data({ ok: true, videoData });
};
