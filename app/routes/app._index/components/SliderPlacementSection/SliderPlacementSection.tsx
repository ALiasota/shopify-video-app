import { BlockStack, Card, Box, Banner, Button, Select, Text, Layout } from "@shopify/polaris";
import { AlertCircleIcon } from "@shopify/polaris-icons";
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
                    <Banner tone="warning" icon={AlertCircleIcon}>
                        <BlockStack gap="200">
                            <Text as="span" variant="bodyMd">
                                To display the video slider on your store, you need to add the Video Slider app extension to your theme.
                            </Text>
                            <Box>
                                <Button onClick={() => {}}>Go to theme editor</Button>
                            </Box>
                        </BlockStack>
                    </Banner>

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
