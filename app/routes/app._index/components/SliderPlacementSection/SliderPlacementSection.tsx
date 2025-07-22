import { BlockStack, Card, Box, Banner, Button, Select, Text, Layout } from "@shopify/polaris";
import { AlertCircleIcon } from "@shopify/polaris-icons";
import type { SliderObjectType } from "../types";
import { PlacementTypeEnum } from "../types";

const placementOptions = [
    { label: "Home page", value: PlacementTypeEnum.HOME },
    { label: "Product page", value: PlacementTypeEnum.PRODUCT },
];

interface SliderPlacementSectionProps {
    selectedPlacement: PlacementTypeEnum;
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
                            onChange={(value) => updateSliderField("placement", value as PlacementTypeEnum)}
                            label={"Select where the video slider will be displayed"}
                        />
                    </Box>
                </BlockStack>
            </Card>
        </Layout.Section>
    );
}
