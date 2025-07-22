import { BlockStack, Text, Select, Box, Layout, Grid, InlineStack, Icon } from "@shopify/polaris";
import thumbnailsImage from "../../../../assets/slider-layout/thumbnails.png";
import carouselImage from "../../../../assets/slider-layout/carousel.png";
import singleImage from "../../../../assets/slider-layout/single.png";
import stackImage from "../../../../assets/slider-layout/stack.png";
import type { SliderObjectType } from "../types";
import { SliderLayoutTypeEnum } from "../types";
import SliderLayoutItem from "../SliderLayoutItem/SliderLayoutItem";
import { ChevronDownIcon } from "@shopify/polaris-icons";

const layoutOptions = [
    {
        title: "Carousel",
        type: SliderLayoutTypeEnum.CAROUSEL,
        description: "Standard video display with the ability to show 2–6 videos in a line, scrollable left–right, allowing you to add as many videos as needed.",
        img: carouselImage,
    },
    {
        title: "Stack",
        type: SliderLayoutTypeEnum.STACK,
        description: "Videos play within the feed as a spotlight rather than in a video player.",
        img: stackImage,
    },
    {
        title: "Single",
        type: SliderLayoutTypeEnum.SINGLE,
        description: "The video will be displayed fixed in the bottom-right or bottom-left corner.",
        img: singleImage,
    },

    {
        title: "Thumbnails",
        type: SliderLayoutTypeEnum.THUMBNAILS,
        description: "Video previews displayed as circular thumbnails. Open in a video player on click.",
        img: thumbnailsImage,
    },
];

const videosPerRowOptions = [
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
];

interface SliderLayoutSectionProps {
    updateSliderField: <K extends keyof SliderObjectType>(field: K, value: SliderObjectType[K]) => void;
    selectedOption: SliderLayoutTypeEnum;
    videosPerRow: string;
}

export default function SliderLayoutSection({ updateSliderField, selectedOption, videosPerRow }: SliderLayoutSectionProps) {
    return (
        <Layout.Section>
            <Box width="100%" background="bg-surface" borderRadius="400" borderColor="border-brand" borderWidth="050" padding="0">
                <BlockStack gap="400">
                    <Box paddingInline="400" paddingBlockStart="400">
                        <Text as="h2" variant="headingMd">
                            Layout
                        </Text>
                    </Box>

                    <Box paddingInline="400">
                        <Grid columns={{ xs: 1, sm: 1, md: 4, lg: 4, xl: 4 }}>
                            {layoutOptions.map((option) => (
                                <SliderLayoutItem
                                    onOptionClick={(optionType: SliderLayoutTypeEnum) => updateSliderField("layoutType", optionType)}
                                    selectedOption={selectedOption}
                                    key={option.type}
                                    option={option}
                                />
                            ))}
                        </Grid>
                    </Box>

                    <Box paddingInline="400">
                        <BlockStack gap="100">
                            <Text as="h3" variant="bodyMd" fontWeight="medium">
                                Videos Per Row
                            </Text>
                            <Box>
                                <Select
                                    options={videosPerRowOptions}
                                    value={videosPerRow}
                                    onChange={(value) => updateSliderField("videosPerRow", value)}
                                    label={"Select how many videos to display per row"}
                                />
                            </Box>
                        </BlockStack>
                    </Box>

                    <Box background={"bg-surface-tertiary"} borderEndEndRadius="400" borderEndStartRadius="400" paddingInline="400" paddingBlock="200">
                        <InlineStack align="space-between">
                            <Text as="h2" variant="headingMd">
                                Preview
                            </Text>
                            <Box>
                                <Icon source={ChevronDownIcon} />
                            </Box>
                        </InlineStack>
                    </Box>
                </BlockStack>
            </Box>
        </Layout.Section>
    );
}
