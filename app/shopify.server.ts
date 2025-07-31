import "@shopify/shopify-app-remix/adapters/node";
import { ApiVersion, AppDistribution, shopifyApp } from "@shopify/shopify-app-remix/server";
import { DrizzleSessionStoragePostgres } from "drizzle/DrizzleSessionStorage";
import { db } from "./clients/db.server";
import { sessionsTable } from "drizzle/schema.server";
import { logger } from "./service/logger.server";
import { getOrCreateMerchant, type AfterAuthOptions } from "./repository/merchant/get-or-create-merchant";

const afterAuth = async ({ session, admin }: AfterAuthOptions) => {
    try {
        logger.info("Running afterAuth for shop", { shop: session.shop });
        await getOrCreateMerchant({ session, admin });
    } catch (error) {
        logger.error("Error while executing afterAuth", error);
    }
};

const shopify = shopifyApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
    apiVersion: ApiVersion.January25,
    scopes: process.env.SCOPES?.split(","),
    appUrl: process.env.SHOPIFY_APP_URL || "",
    authPathPrefix: "/auth",
    sessionStorage: new DrizzleSessionStoragePostgres(db, sessionsTable),
    distribution: AppDistribution.AppStore,
    hooks: { afterAuth },
    future: {
        unstable_newEmbeddedAuthStrategy: true,
        removeRest: true,
    },
    ...(process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
