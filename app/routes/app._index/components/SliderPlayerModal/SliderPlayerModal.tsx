import { Box } from "@shopify/polaris";
import { Modal, TitleBar } from "@shopify/app-bridge-react";
import type { VideoType } from "../types";
import { useEffect, useState } from "react";

interface SliderPlayerModalProps {
    videos: VideoType[];
    products: any[];
    previewId: string | null;
}

export default function SliderPlayerModal({ videos, products, previewId }: SliderPlayerModalProps) {
    const [selectedVideo, setSelectedVideo] = useState<null | VideoType>(null);

    useEffect(() => {
        const video = videos.find((video) => video.id === previewId);

        if (video) {
            setSelectedVideo(video);
        }
    }, [previewId, videos]);

    return (
        <>
            {selectedVideo && (
                <Modal variant="max" id="slider-video-modal">
                    <TitleBar title={selectedVideo.filename}></TitleBar>
                    <Box background="bg-inverse" minHeight="80vh">
                        <Box background="bg-surface" minHeight="80vh">
                            <video src={selectedVideo.videoUrl} poster={selectedVideo.thumbnailUrl} width="100%" height="auto" style={{ background: "#111" }} controls />
                        </Box>
                        {/* <Grid columns={{ sm: 6 }}>
                            <Grid.Cell columnSpan={{ sm: 6 }}>
                                <Box background="bg-surface" minHeight="80vh">
                                    <video src={selectedVideo.videoUrl} poster={selectedVideo.thumbnailUrl} width="100%" height="auto" style={{ background: "#111" }} controls />
                                </Box>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ sm: 2 }}>
                                <Box background="bg-surface" minHeight="80vh">
                                    <video src={selectedVideo.videoUrl} poster={selectedVideo.thumbnailUrl} width="100%" height="auto" style={{ background: "#111" }} controls />
                                </Box>
                            </Grid.Cell>
                        </Grid> */}
                    </Box>
                </Modal>
            )}
        </>
    );
}
