import { db } from "app/clients/db.server";
import { eq } from "drizzle-orm";
import { merchantsTable } from "drizzle/schema.server";

export const getMerchantByShop = async (shop: string) => {
    const result = await db.query.merchantsTable.findFirst({
        where: eq(merchantsTable.shop, shop),
    });

    if (!result) {
        throw new Error(`Merchant not found for shop ${shop}`);
    }

    return result;
};
