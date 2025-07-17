import { BlockStack, Box, Button, ButtonGroup, Grid, Text } from "@shopify/polaris";

import VideoListFilter from "../VideoListFilter/VideoListFilter";
import { useEffect, useState } from "react";
import type { FilterOptionsType, VideoType } from "../types";
import { SortedOptionsEnum, ViewTypeEnum } from "../types";
import AddFromUrl from "../AddFromUrl/AddFromUrl";
import { videos } from "./videos";

const initFilterOptions = {
    queryValue: null,
    minSize: null,
    maxSize: null,
    selectedProduct: null,
    viewType: ViewTypeEnum.GRID,
    sortSelected: [SortedOptionsEnum.DATE_ASC],
};
function filterVideos(videos: VideoType[], filterOptions: FilterOptionsType) {
    return videos.filter((video) => {
        let queryCheck = true;
        let sizeCheck = true;
        let productCheck = true;

        if (filterOptions.queryValue?.length) {
            queryCheck = video.filename.toLowerCase().includes(filterOptions.queryValue.toLowerCase());
        }

        if (filterOptions.maxSize && filterOptions.minSize) {
            sizeCheck = video.size <= Number(filterOptions.maxSize) && video.size >= Number(filterOptions.minSize);
        } else if (filterOptions.maxSize) {
            sizeCheck = video.size <= Number(filterOptions.maxSize);
        } else if (filterOptions.minSize) {
            sizeCheck = video.size >= Number(filterOptions.minSize);
        }

        if (filterOptions.selectedProduct?.length) {
            productCheck = video.productIds.includes(filterOptions.selectedProduct);
        }

        if (!queryCheck || !sizeCheck || !productCheck) return false;

        return true;
    });
}

function sortVideos(videos: VideoType[], sort: SortedOptionsEnum) {
    const compareDate = (a: VideoType, b: VideoType) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    const compareName = (a: VideoType, b: VideoType) => a.filename.localeCompare(b.filename, undefined, { sensitivity: "base" });

    const compareSize = (a: VideoType, b: VideoType) => a.size - b.size;

    switch (sort) {
        case SortedOptionsEnum.DATE_ASC:
            return videos.sort(compareDate);

        case SortedOptionsEnum.DATE_DESC:
            return videos.sort((a, b) => compareDate(b, a));

        case SortedOptionsEnum.NAME_ASC:
            return videos.sort(compareName);

        case SortedOptionsEnum.NAME_DESC:
            return videos.sort((a, b) => compareName(b, a));

        case SortedOptionsEnum.SIZE_ASC:
            return videos.sort(compareSize);

        case SortedOptionsEnum.SIZE_DESC:
            return videos.sort((a, b) => compareSize(b, a));

        default:
            return videos;
    }
}

export default function VideoList() {
    const [filterOptions, setFilterOptions] = useState<FilterOptionsType>(initFilterOptions);
    const [filteredVideos, setFilteredVideos] = useState(videos);

    useEffect(() => {
        const filtered = filterVideos(videos, filterOptions);
        const sorted = sortVideos(filtered, filterOptions.sortSelected[0]);

        setFilteredVideos(sorted);
    }, [filterOptions]);

    return (
        <Box padding="200" width="100%">
            <VideoListFilter setFilterOptions={setFilterOptions} />
            <Grid columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
                <Grid.Cell>
                    <Box paddingBlockEnd="1000" paddingBlockStart="1000" borderRadius="200" borderColor="border" borderWidth="025" background="bg-surface">
                        <BlockStack gap="200" align="center" inlineAlign="center">
                            <ButtonGroup>
                                <Button>Upload new</Button>
                                <AddFromUrl addUrl={(url: string) => console.log(url)} />
                            </ButtonGroup>
                            <Text as="p" variant="bodySm">
                                Accepts .mp4, .mov and .webm
                            </Text>
                        </BlockStack>
                    </Box>
                </Grid.Cell>
                {/* <Grid.Cell>
                    <p>gfdgfdg</p>
                </Grid.Cell> */}
            </Grid>
        </Box>
    );
}
