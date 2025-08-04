import type { AdminContext } from "@shopify/shopify-app-remix/server";
import { logger } from "../logger.server";
import type { SliderLayoutTypeEnum, SliderPlacementTypeEnum } from "app/routes/app._index/components/types";

export interface MetafieldSlider {
    layout: SliderLayoutTypeEnum;
    placement: SliderPlacementTypeEnum;
    videosPerRow: string;
    slides: {
        videoUrl: string;
        productHandle?: string;
    }[];
}

export const updateShopMetafield = async (graphql: AdminContext["admin"]["graphql"], shopId: string, metafieldData: MetafieldSlider[]) => {
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
            logger.error("Shopify Metafield Error:", { errors });
            throw new Error(errors.map((e: any) => e.message).join(", "));
        }
        return data?.data?.metafieldsSet?.metafields?.[0] ?? false;
    } catch (error) {
        logger.error("Shopify Metafield Error:", { error });
        throw new Response(JSON.stringify({ error: error }), { status: 500 });
    }
};
