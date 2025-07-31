import { db } from "app/clients/db.server";
import type { InsertVideo } from "drizzle/schema.server";
import { videosTable } from "drizzle/schema.server";

export const createVideo = async (videoData: InsertVideo) => {
    const video = (await db.insert(videosTable).values(videoData).returning())[0];

    return video;
};
