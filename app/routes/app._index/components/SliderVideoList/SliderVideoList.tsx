import { BlockStack, Button, Checkbox, Grid, InlineStack } from "@shopify/polaris";
import SliderVideoListItem from "../SliderVideoListItem/SliderVideoListItem";
import { useEffect, useState } from "react";
import SliderPreviewVideo from "../SliderPreviewVideo/SliderPreviewVideo";
import { useAppBridge } from "@shopify/app-bridge-react";
import type { VideoDB } from "drizzle/schema.server";

interface ListItem {
    video?: Required<VideoDB>;
    moreVideosNumber?: number;
    checked: boolean;
}

interface SliderVideoListProps {
    videos: Required<VideoDB>[];
    currencyCode: string;
}

export default function SliderVideoList({ videos, currencyCode }: SliderVideoListProps) {
    const [allVideos, setAllVideos] = useState<{ video: Required<VideoDB>; checked: boolean }[]>([]);
    const [checkedLength, setCheckedLength] = useState(0);
    const [showFullList, setShowFullList] = useState(false);
    const [listToDisplay, setListToDisplay] = useState<ListItem[]>([]);
    const [previewId, setPreviewId] = useState<null | string>(null);

    const shopify = useAppBridge();

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

    const onClickRemove = () => {
        setAllVideos(allVideos.filter((video) => !video.checked));
    };

    const onClickPreview = (id: string) => {
        if (id === previewId) {
            setPreviewId(null);
        } else {
            setPreviewId(id);
        }
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

    useEffect(() => {
        if (previewId) shopify.modal.show("slider-video-modal");
    }, [previewId]);

    return (
        <>
            <BlockStack gap="200">
                {checkedLength ? (
                    <InlineStack align="space-between">
                        <Checkbox
                            label={`${checkedLength} video${checkedLength > 1 ? "s" : ""} selected`}
                            checked={"indeterminate"}
                            onChange={() => setAllVideos(allVideos.map((video) => ({ ...video, checked: false })))}
                        />
                        <Button onClick={onClickRemove} variant="plain" tone="critical">
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
                            onClickPreview={onClickPreview}
                            checked={item.checked}
                        />
                    ))}
                </Grid>
                {previewId && <SliderPreviewVideo videos={videos} previewId={previewId} currencyCode={currencyCode} />}
            </BlockStack>
        </>
    );
}
