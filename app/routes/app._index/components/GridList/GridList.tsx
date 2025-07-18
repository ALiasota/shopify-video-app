import { Grid } from "@shopify/polaris";
import type { VideoType } from "../types";
import GridListItem from "../GridListItem/GridListItem";

interface GridListProps {
    videos: VideoType[];
}

export default function GridList({ videos }: GridListProps) {
    return (
        <Grid columns={{ xs: 1, sm: 1, md: 6, lg: 6, xl: 6 }}>
            {videos.map((video) => (
                <GridListItem key={video.id} video={video} />
            ))}
        </Grid>
    );
}
