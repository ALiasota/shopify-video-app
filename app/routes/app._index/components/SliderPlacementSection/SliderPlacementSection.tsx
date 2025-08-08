import { BlockStack, Card, Box, Select, Text, Layout } from "@shopify/polaris";
import type { SliderObjectType } from "../types";
import { SliderPlacementTypeEnum } from "../types";

const placementOptions = [
    { label: "Home page", value: SliderPlacementTypeEnum.HOME },
    { label: "Product page", value: SliderPlacementTypeEnum.PRODUCT },
    { label: "Collection page", value: SliderPlacementTypeEnum.COLLECTION },
];

interface SliderPlacementSectionProps {
    selectedPlacement: SliderPlacementTypeEnum;
    updateSliderField: <K extends keyof SliderObjectType>(field: K, value: SliderObjectType[K]) => void;
}

export default function SliderPlacementSection({ selectedPlacement, updateSliderField }: SliderPlacementSectionProps) {
    return (
        <Layout.Section>
            <Card>
                <BlockStack gap="400">
                    <Text as="h2" variant="headingMd">
                        Placement
                    </Text>
                    <Box>
                        <Select
                            options={placementOptions}
                            value={selectedPlacement}
                            onChange={(value) => updateSliderField("placement", value as SliderPlacementTypeEnum)}
                            label={"Select where the video slider will be displayed"}
                        />
                    </Box>
                </BlockStack>
            </Card>
        </Layout.Section>
    );
}
