import { BlockStack, Button, Checkbox, Grid, InlineStack } from "@shopify/polaris";
import type { VideoType } from "../types";
import SliderVideoListItem from "../SliderVideoListItem/SliderVideoListItem";
import { useEffect, useState } from "react";

interface ListItem {
    video?: VideoType;
    moreVideosNumber?: number;
    checked: boolean;
}

interface SliderVideoListProps {
    videos: VideoType[];
}

export default function SliderVideoList({ videos }: SliderVideoListProps) {
    const [allVideos, setAllVideos] = useState<{ video: VideoType; checked: boolean }[]>([]);
    const [checkedLength, setCheckedLength] = useState(0);
    const [showFullList, setShowFullList] = useState(false);
    const [listToDisplay, setListToDisplay] = useState<ListItem[]>([]);

    const onClickShowAll = () => {
        setShowFullList(true);
    };

    const onClickCheck = (id: string) => {
        setAllVideos((prevState) =>
            prevState.map((video) => {
                if (video.video.id === id) {
                    return { ...video, checked: !video.checked };
                }
                return video;
            }),
        );
    };

    const OnClickRemove = () => {
        setAllVideos(allVideos.filter((video) => !video.checked));
    };

    useEffect(() => {
        let list: ListItem[] = [];
        if (showFullList) {
            list = [...allVideos, { checked: false }];
        } else {
            if (allVideos.length > 11) {
                const moreVideosNumber = allVideos.length - 10;
                const eleventh = allVideos[10];
                list = [...allVideos.slice(0, 10), { ...eleventh, moreVideosNumber }, { checked: false }];
            } else {
                list = [...allVideos, { checked: false }];
            }
        }

        setListToDisplay(list);
    }, [allVideos, showFullList]);

    useEffect(() => {
        setAllVideos(videos.map((video) => ({ video, checked: false })));
    }, [videos]);

    useEffect(() => {
        setCheckedLength(allVideos.filter((video) => video.checked).length);
    }, [allVideos]);

    return (
        <BlockStack gap="100">
            {checkedLength ? (
                <InlineStack align="space-between">
                    <Checkbox
                        label={`${checkedLength} video${checkedLength > 1 ? "s" : ""} selected`}
                        checked={"indeterminate"}
                        onChange={() => setAllVideos(allVideos.map((video) => ({ ...video, checked: false })))}
                    />
                    <Button onClick={OnClickRemove} variant="plain" tone="critical">
                        Remove
                    </Button>
                </InlineStack>
            ) : null}
            <Grid columns={{ xs: 1, sm: 1, md: 6, lg: 6, xl: 6 }}>
                {listToDisplay.map((item) => (
                    <SliderVideoListItem
                        key={item.video?.id || "0"}
                        video={item.video}
                        moreVideosNumber={item.moreVideosNumber}
                        onClickShowAll={onClickShowAll}
                        onClickCheck={onClickCheck}
                        checked={item.checked}
                    />
                ))}
            </Grid>
        </BlockStack>
    );
}
