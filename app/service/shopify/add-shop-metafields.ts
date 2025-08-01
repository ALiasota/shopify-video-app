import type { AdminContext } from "@shopify/shopify-app-remix/server";
import type { SliderObjectType } from "app/routes/app._index/components/types";

const updateShopMetafield = async (graphql: AdminContext["admin"]["graphql"], shopId: string, metafieldData: any) => {
    const metafieldInput = {
        namespace: "custom",
        key: "grodas_slider",
        type: "json",
        value: JSON.stringify(metafieldData),
        ownerId: shopId,
    };

    const variables = {
        metafields: [metafieldInput],
    };

    try {
        const response = await graphql(
            `
                #graphql
                mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
                    metafieldsSet(metafields: $metafields) {
                        metafields {
                            id
                            namespace
                            key
                            value
                            type
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `,
            { variables },
        );
        const data = await response.json();

        const errors = data?.data?.metafieldsSet?.userErrors;
        if (errors?.length) {
            throw new Error(errors.map((e: any) => e.message).join(", "));
        }
        return data?.data?.metafieldsSet?.metafields?.[0] ?? false;
    } catch (error) {
        console.error("Shopify Metafield Error:", error);
        throw new Response(JSON.stringify({ error: error }), { status: 500 });
    }
};

export const addShopMetafields = async (graphql: AdminContext["admin"]["graphql"], shopId: string, slider: SliderObjectType) => {
    const metafieldData = {
        layoutType: slider.layoutType,
        videosPerRow: slider.videosPerRow,
        slides: slider.slides.map((slide) => ({})),
    };
    return updateShopMetafield(graphql, shopId, metafieldData);
};
