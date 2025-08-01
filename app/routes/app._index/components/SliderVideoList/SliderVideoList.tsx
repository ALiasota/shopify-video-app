import { BlockStack, Button, Checkbox, Grid, InlineStack } from "@shopify/polaris";
import SliderVideoListItem from "../SliderVideoListItem/SliderVideoListItem";
import { useEffect, useState } from "react";
import SliderPreviewVideo from "../SliderPreviewVideo/SliderPreviewVideo";
import type { VideoDB } from "drizzle/schema.server";
import type { SliderObjectType, SlideType } from "../types";

interface ListItem {
    video?: VideoDB;
    moreVideosNumber?: number;
}

interface SliderVideoListProps {
    videos: Required<VideoDB>[];
    currencyCode: string;
    slides: SlideType[];
    updateSliderField: <K extends keyof SliderObjectType>(field: K, value: SliderObjectType[K]) => void;
    maxSlidesCount: number;
    minSlidesCount: number;
}

export default function SliderVideoList({ videos, currencyCode, slides, updateSliderField, maxSlidesCount, minSlidesCount }: SliderVideoListProps) {
    const [showFullList, setShowFullList] = useState(false);
    const [listToDisplay, setListToDisplay] = useState<ListItem[]>([]);
    const [preview, setPreview] = useState<null | SlideType>(null);

    const onClickShowAll = () => {
        setShowFullList(true);
    };

    const updateSlides = (slide: SlideType) => {
        let updatedSlides = slides;

        if (!slide.product && slides.some((item) => item.videoId === slide.videoId)) {
            updatedSlides = updatedSlides.filter((item) => item.videoId !== slide.videoId);
        } else if (slides.some((item) => item.videoId === slide.videoId)) {
            updatedSlides = updatedSlides.map((item) => {
                if (item.videoId === slide.videoId) {
                    return slide;
                }
                return item;
            });
        } else {
            updatedSlides = [...updatedSlides, slide];
        }
        updateSliderField("slides", updatedSlides);

        if (preview) setPreview(null);
    };

    const onClickRemove = () => {
        // setAllVideos(allVideos.filter((video) => !video.checked));
    };

    const onClickPreview = (id: string) => {
        if (id === preview?.videoId) {
            setPreview(null);
        } else {
            const previewItem = slides.find((item) => item.videoId === id);
            setPreview(previewItem || { videoId: id });
        }
    };

    useEffect(() => {
        let list: ListItem[] = [];
        if (showFullList) {
            list = videos.map((video) => ({ video }));
        } else {
            if (videos.length > 11) {
                const moreVideosNumber = videos.length - 10;
                const eleventh = videos[10];
                list = [...videos.slice(0, 10).map((video) => ({ video })), { video: eleventh, moreVideosNumber }];
            } else {
                list = videos.map((video) => ({ video }));
            }
        }

        setListToDisplay(list);
    }, [videos, showFullList]);

    return (
        <>
            <BlockStack gap="200">
                {slides.length ? (
                    <InlineStack align="space-between">
                        <Checkbox label={`${slides.length} video${slides.length > 1 ? "s" : ""} selected`} checked={"indeterminate"} onChange={() => updateSliderField("slides", [])} />
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
                            onClickCheck={updateSlides}
                            onClickPreview={onClickPreview}
                            checked={slides.some((slide) => slide.videoId === item.video?.id)}
                            disableAdd={slides.length >= maxSlidesCount}
                        />
                    ))}
                </Grid>
                {preview && <SliderPreviewVideo videos={videos} preview={preview} currencyCode={currencyCode} saveSlide={updateSlides} disableAdd={slides.length >= maxSlidesCount} />}
            </BlockStack>
        </>
    );
}
