import { BlockStack, Box, Button, ChoiceList, Icon, InlineStack, Text } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { AlertCircleIcon, ProductIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import type { VideoDB } from "drizzle/schema.server";
import { formatDateToStr } from "app/utils/formatDateToStr";
import type { Product } from "@shopify/app-bridge/actions/ResourcePicker";
import getSymbolFromCurrency from "currency-symbol-map";

interface SliderPreviewVideoProps {
    videos: Required<VideoDB>[];
    previewId: string;
    currencyCode: string;
}

export default function SliderPreviewVideo({ videos, previewId, currencyCode }: SliderPreviewVideoProps) {
    const [selectedVideo, setSelectedVideo] = useState<null | Required<VideoDB>>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [variantsList, setVariantsList] = useState<{ label: string; value: string }[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const currencySymbol = getSymbolFromCurrency(currencyCode);

    const shopify = useAppBridge();

    const onClickAddProduct = () => {
        shopify
            .resourcePicker({
                type: "product",
                multiple: false,
                action: "add",
                filter: {
                    variants: false,
                },
            })
            .then((selected: any) => setSelectedProduct(selected[0]));
    };

    const handleChangeVariant = useCallback((value: string[]) => setSelectedVariant(value[0]), []);

    useEffect(() => {
        const video = videos.find((video) => video.id === previewId);

        if (video) {
            setSelectedVideo(video);
        }
    }, [previewId, videos]);

    useEffect(() => {
        if (!selectedProduct) return;

        const variantItems = selectedProduct.variants.map((variant) => ({
            label: variant.displayName + " - " + variant.price + " " + currencySymbol,
            value: variant.id!,
        }));

        setVariantsList(variantItems);
        setSelectedVariant(selectedProduct.variants[0].id!);
    }, [currencySymbol, selectedProduct]);

    return (
        <>
            {selectedVideo ? (
                <Box>
                    <InlineStack wrap={false} gap="400">
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "70%", height: "100%" }}>
                            <video src={selectedVideo.videoUrl!} poster={selectedVideo.thumbnailUrl!} width="100%" height="auto" controls />
                        </div>

                        <Box width="30%">
                            <BlockStack gap="400">
                                <Box borderRadius="200" padding="400" borderColor="border" borderWidth="025">
                                    <BlockStack gap="300" align="start">
                                        <InlineStack gap="200" align="start" wrap={false}>
                                            <div>
                                                <Icon source={AlertCircleIcon} />
                                            </div>
                                            <Text as="h2" variant="headingMd">
                                                Information
                                            </Text>
                                        </InlineStack>
                                        <BlockStack gap="200" align="start">
                                            <Text as="p" variant="bodyMd" fontWeight="medium">
                                                Name
                                            </Text>
                                            <Box padding="200" overflowX="hidden" borderRadius="200" borderColor="border" borderWidth="025">
                                                <Text as="p" variant="bodyMd">
                                                    {selectedVideo.filename}
                                                </Text>
                                            </Box>
                                        </BlockStack>
                                        <BlockStack gap="200" align="start">
                                            <Text as="h2" variant="headingMd">
                                                Details
                                            </Text>
                                            <Text as="p" variant="bodyMd">
                                                {`${selectedVideo.format?.toUpperCase()} • ${selectedVideo.width} × ${selectedVideo.height} • ${(selectedVideo.size! / 1024).toFixed(2)} kB`}
                                            </Text>
                                            <Text as="p" variant="bodyMd">
                                                Added {formatDateToStr(String(selectedVideo.createdAt))}
                                            </Text>
                                        </BlockStack>
                                    </BlockStack>
                                </Box>
                                <Box borderRadius="200" padding="400" borderColor="border" borderWidth="025">
                                    <BlockStack gap="400">
                                        <InlineStack gap="200" align="start" wrap={false}>
                                            <div>
                                                <Icon source={ProductIcon} />
                                            </div>
                                            <Text as="h2" variant="headingMd">
                                                Product
                                            </Text>
                                        </InlineStack>
                                        <Button variant="primary" onClick={onClickAddProduct}>
                                            Browse
                                        </Button>
                                        {selectedProduct ? (
                                            <BlockStack gap="200">
                                                <Text as="h2" variant="headingMd" alignment="center">
                                                    {selectedProduct.title}
                                                </Text>
                                                <ChoiceList title="Select Variant" choices={variantsList} selected={[selectedVariant!]} onChange={handleChangeVariant} />
                                            </BlockStack>
                                        ) : (
                                            <BlockStack gap="200" align="center">
                                                <Text as="h2" variant="headingMd" alignment="center">
                                                    No products yet
                                                </Text>
                                                <Text as="p" variant="bodySm" alignment="center">
                                                    Search or browse to add products to this video and make it shoppable.
                                                </Text>
                                            </BlockStack>
                                        )}
                                    </BlockStack>
                                </Box>
                                <BlockStack gap="100" align="center" inlineAlign="end">
                                    <Button variant="primary">Save</Button>
                                </BlockStack>
                            </BlockStack>
                        </Box>
                    </InlineStack>
                </Box>
            ) : null}
        </>
    );
}
