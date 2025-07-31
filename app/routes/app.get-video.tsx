import type { ActionFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";
import { getVideo } from "app/repository/video/get-video";
import { updateVideo } from "app/repository/video/update-video";
import { requireMerchantFromAdmin } from "app/service/require-merchant-from-admin";
import { getShopifyVideoById } from "app/service/shopify/video/get-shopify-video-by-id";
import { FileStatus } from "app/types/admin.types";

export const action = async ({ request }: ActionFunctionArgs) => {
    const {
        context: {
            admin: { graphql },
        },
    } = await requireMerchantFromAdmin(request);

    const { videoId } = await request.json();

    if (!videoId) return data({ error: "Video not found" }, { status: 404 });

    let video = await getVideo(videoId);

    if (!video) return data({ error: "Video not found" }, { status: 404 });

    if (video.status === FileStatus.Ready) return data({ ok: true, video });

    if (video.status === FileStatus.Failed) return data({ ok: false, video }, { status: 400 });

    const shopifyVideo = await getShopifyVideoById(graphql, video.shopifyVideoId);

    if (shopifyVideo.fileStatus === FileStatus.Ready) {
        await updateVideo(videoId, {
            duration: shopifyVideo.duration,
            thumbnailUrl: shopifyVideo.preview?.image?.url,
            videoUrl: shopifyVideo.sources[0].url,
            format: shopifyVideo.originalSource?.format,
            size: shopifyVideo.originalSource?.fileSize,
            width: shopifyVideo.originalSource?.width,
            height: shopifyVideo.originalSource?.height,
            status: shopifyVideo.fileStatus,
        });

        video = await getVideo(videoId);

        return data({ ok: true, video });
    } else {
        await updateVideo(videoId, { status: shopifyVideo.fileStatus });

        if (shopifyVideo.fileStatus === FileStatus.Failed) {
            return data({ ok: false, video: { ...video, status: shopifyVideo.fileStatus } }, { status: 400 });
        } else {
            return data({ ok: true, video: { ...video, status: shopifyVideo.fileStatus } });
        }
    }
};
