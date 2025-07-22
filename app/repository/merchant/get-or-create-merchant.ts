import "@shopify/shopify-app-remix/adapters/node";

import type { Session, shopifyApp } from "@shopify/shopify-app-remix/server";
import { db } from "app/clients/db.server";
import { getShopifyShopData } from "app/service/shopify/get-shopify-data";
import { eq } from "drizzle-orm";
import { merchantTable } from "drizzle/schema.server";

const createMerchant = async (session: Session, shopifyData: Awaited<ReturnType<typeof getShopifyShopData>>) => {
    const merchant = await db
        .insert(merchantTable)
        .values({
            shop: session.shop,
            shopId: shopifyData.shop.id,
            email: shopifyData.shop.email,
        })
        .returning();

    return merchant[0];
};

export const getOrCreateMerchant = async ({ session, admin }: AfterAuthOptions) => {
    const merchant = await db.query.merchantTable.findFirst({
        where: eq(merchantTable.shop, session.shop),
    });

    if (merchant) {
        return merchant;
    }

    const shopifyData = await getShopifyShopData(admin.graphql);
    const createdMerchant = await createMerchant(session, shopifyData);

    return createdMerchant;
};

export type AfterAuthOptions = Parameters<NonNullable<NonNullable<Parameters<typeof shopifyApp>[0]["hooks"]>["afterAuth"]>>[0];
