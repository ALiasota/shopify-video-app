import { db } from "app/clients/db.server";
import { eq, sql } from "drizzle-orm";
import type { InsertVideo } from "drizzle/schema.server";
import { videosTable } from "drizzle/schema.server";

export const updateVideo = async (id: string, videoData: Partial<InsertVideo>) => {
    const video = db
        .update(videosTable)
        .set({ ...videoData, updatedAt: sql`now()::timestamp` })
        .where(eq(videosTable.id, id));

    return video;
};
