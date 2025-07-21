import { BlockStack, Text, Box, Image, Grid, Tooltip } from "@shopify/polaris";
import { useState } from "react";
import { SliderLayoutTypeEnum } from "../types";

interface VideoSliderLayoutItemProps {
    option: {
        title: string;
        type: SliderLayoutTypeEnum;
        description: string;
        img: string;
    };
    onOptionClick: (optionType: SliderLayoutTypeEnum) => void;
    selectedOption: SliderLayoutTypeEnum;
}

export default function VideoSliderLayoutItem({ option, onOptionClick, selectedOption }: VideoSliderLayoutItemProps) {
    const [titleHover, setTitleHover] = useState(false);

    return (
        <Grid.Cell>
            <BlockStack gap="200">
                <Box overflowX="hidden" overflowY="hidden" borderRadius="200" borderColor={selectedOption === option.type ? "input-border-active" : "border"} borderWidth="050">
                    <div
                        onClick={() => onOptionClick(option.type)}
                        style={{
                            height: "120px",
                            cursor: selectedOption === option.type ? "default" : "pointer",
                            display: "flex",
                            justifyContent: option.type === SliderLayoutTypeEnum.SINGLE ? "end" : "center",
                            alignItems: option.type === SliderLayoutTypeEnum.SINGLE ? "end" : "center",
                        }}
                    >
                        <Image alt={option.title} source={option.img} />
                    </div>
                </Box>
                <Tooltip preferredPosition="below" content={option.description} hasUnderline>
                    <div onMouseEnter={() => setTitleHover(true)} onMouseLeave={() => setTitleHover(false)}>
                        <Text alignment="center" as="p" tone="subdued" variant="bodyLg" fontWeight={titleHover ? "bold" : "regular"}>
                            {option.title}
                        </Text>
                    </div>
                </Tooltip>
            </BlockStack>
        </Grid.Cell>
    );
}
