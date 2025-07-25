import type { AdminContext } from "@shopify/shopify-app-remix/server";
import { logger } from "app/service/logger.server";

export async function getShopifyVideoById(graphql: AdminContext["admin"]["graphql"], id: string) {
    const response = await graphql(
        `
            #graphql
            query GetVideoById($id: ID!) {
                node(id: $id) {
                    ... on Video {
                        id
                        alt
                        createdAt
                        fileStatus
                        fileErrors {
                            code
                            details
                            message
                        }
                        sources {
                            format
                            height
                            mimeType
                            url
                            width
                        }
                        preview {
                            image {
                                url
                            }
                            status
                        }
                    }
                }
            }
        `,
        {
            variables: { id },
        },
    );
    const json = await response.json();

    if (!json.data?.node) {
        logger.error("Video not found", {
            id,
        });
        throw new Response("Video not found", { status: 404 });
    }

    return json.data.node;
}
