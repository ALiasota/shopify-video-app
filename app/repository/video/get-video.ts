import { db } from "app/clients/db.server";
import { eq } from "drizzle-orm";
import { videosTable } from "drizzle/schema.server";

export const getVideo = async (id: string) => {
    const video = await db.query.videosTable.findFirst({
        where: eq(videosTable.id, id),
    });
    return video;
};
