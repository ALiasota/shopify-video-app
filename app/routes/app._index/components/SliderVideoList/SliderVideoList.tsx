import { Grid } from "@shopify/polaris";
import type { VideoType } from "../types";
import SliderVideoListItem from "../SliderVideoListItem/SliderVideoListItem";

interface SliderVideoListProps {
    videos: VideoType[];
}

export default function SliderVideoList({ videos }: SliderVideoListProps) {
    return (
        <Grid columns={{ xs: 1, sm: 1, md: 6, lg: 6, xl: 6 }}>
            {videos.map((video) => (
                <SliderVideoListItem key={video.id} video={video} />
            ))}
            <SliderVideoListItem video={videos[0]} moreVideosNumber={4} />
            <SliderVideoListItem />
        </Grid>
    );
}
