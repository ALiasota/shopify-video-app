import type { AdminContext } from "@shopify/shopify-app-remix/server";
import { logger } from "app/service/logger.server";

export async function deleteShopifyVideosByIds(graphql: AdminContext["admin"]["graphql"], ids: string[]) {
    const response = await graphql(
        `
            #graphql
            mutation DeleteFiles($ids: [ID!]!) {
                fileDelete(fileIds: $ids) {
                    deletedFileIds
                    userErrors {
                        field
                        message
                    }
                }
            }
        `,
        {
            variables: { ids },
        },
    );
    const json = await response.json();

    if (json.data?.fileDelete?.userErrors?.length) {
        const errors = json.data.fileDelete.userErrors.map((e: any) => e.message);
        logger.error("Error deleting videos:", {
            ids,
            errors,
        });
        throw new Response("Error deleting videos: " + errors.join("; "), { status: 500 });
    }

    return json.data?.fileDelete?.deletedFileIds || [];
}
