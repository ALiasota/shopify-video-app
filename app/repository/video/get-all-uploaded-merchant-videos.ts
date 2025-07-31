import { db } from "app/clients/db.server";
import { eq, and } from "drizzle-orm";
import { videosTable } from "drizzle/schema.server";

export const getAllUploadedMerchantVideos = async (merchantId: number) => {
    const videos = await db.query.videosTable.findMany({
        where: and(eq(videosTable.status, "READY"), eq(videosTable.merchantId, merchantId)),
    });
    return videos;
};
