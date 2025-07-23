import { db } from "app/clients/db.server";
import { eq } from "drizzle-orm";
import { merchantTable } from "drizzle/schema.server";

export const getMerchantByShop = async (shop: string) => {
    const result = await db.query.merchantTable.findFirst({
        where: eq(merchantTable.shop, shop),
    });

    if (!result) {
        throw new Error(`Merchant not found for shop ${shop}`);
    }

    return result;
};
