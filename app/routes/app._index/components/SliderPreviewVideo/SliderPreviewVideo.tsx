import { BlockStack, Box, Button, ChoiceList, Icon, InlineStack, Text } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { AlertCircleIcon, ProductIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import type { VideoDB } from "drizzle/schema.server";
import { formatDateToStr } from "app/utils/formatDateToStr";
import type { Product } from "@shopify/app-bridge/actions/ResourcePicker";
import getSymbolFromCurrency from "currency-symbol-map";
import type { SliderProductType, SliderVariantType, SlideType } from "../types";

interface SliderPreviewVideoProps {
    videos: VideoDB[];
    preview: SlideType;
    currencyCode: string;
    saveSlide: (slide: SlideType) => void;
    disableAdd: boolean;
}

export default function SliderPreviewVideo({ videos, preview, currencyCode, saveSlide, disableAdd }: SliderPreviewVideoProps) {
    const [selectedVideo, setSelectedVideo] = useState<null | VideoDB>(null);
    const [selectedProduct, setSelectedProduct] = useState<Omit<SliderProductType, "variant"> | null>(null);
    const [variants, setVariants] = useState<SliderVariantType[]>([]);
    const [variantsChoiceList, setVariantsChoiceList] = useState<{ label: string; value: string }[]>([]);
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
                selectionIds: preview.product?.shopifyProductId ? [{ id: preview.product?.shopifyProductId }] : undefined,
            })
            .then((selected: any) => {
                const prod: Product = selected[0];

                if (!prod) return;

                const variantList = prod.variants.map((variant) => ({
                    title: variant.displayName!,
                    price: variant.price!,
                    compareAtPrice: variant.compareAtPrice!,
                    shopifyVariantId: variant.id!,
                }));

                const variantItems = variantList.map((variant) => ({
                    label: variant.title + " - " + variant.price + " " + currencySymbol,
                    value: variant.shopifyVariantId,
                }));

                setSelectedProduct({
                    title: prod.title,
                    shopifyProductId: prod.id,
                    handle: prod.handle,
                    thumbnailUrl: prod.images[0]?.originalSrc,
                });
                setVariants(variantList);
                setVariantsChoiceList(variantItems);
                setSelectedVariant(variantItems[0]?.value);
            });
    };

    const handleChangeVariant = useCallback((value: string[]) => setSelectedVariant(value[0]), []);

    const onClickSave = () => {
        if (!selectedVideo || !selectedProduct || !selectedVariant) return;

        const variant = variants.find((v) => v.shopifyVariantId === selectedVariant);

        if (!variant) return;

        saveSlide({
            videoId: selectedVideo.id,
            product: {
                ...selectedProduct,
                variant,
            },
        });
    };

    useEffect(() => {
        const video = videos.find((video) => video.id === preview.videoId);

        if (video) {
            setSelectedVideo(video);
        }

        if (preview.product) {
            const { variant, ...prod } = preview.product;
            setSelectedProduct(prod);
            setVariants([variant]);
            setVariantsChoiceList([
                {
                    label: variant.title + " - " + variant.price + " " + currencySymbol,
                    value: variant.shopifyVariantId,
                },
            ]);
            setSelectedVariant(variant.shopifyVariantId);
        } else {
            setSelectedProduct(null);
            setVariants([]);
            setVariantsChoiceList([]);
            setSelectedVariant(null);
        }
    }, [currencySymbol, preview, videos]);

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
                                                {variantsChoiceList.length > 1 ? (
                                                    <ChoiceList title="Select Variant" choices={variantsChoiceList} selected={[selectedVariant!]} onChange={handleChangeVariant} />
                                                ) : (
                                                    <BlockStack gap="200" align="center">
                                                        <Text as="h2" variant="headingMd" alignment="center">
                                                            Variant
                                                        </Text>
                                                        <Text as="p" variant="bodySm" alignment="center">
                                                            {variantsChoiceList[0].label}
                                                        </Text>
                                                    </BlockStack>
                                                )}
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
                                    <Button disabled={!selectedVariant || selectedVariant === preview.videoId || disableAdd} onClick={onClickSave} variant="primary">
                                        Save
                                    </Button>
                                </BlockStack>
                            </BlockStack>
                        </Box>
                    </InlineStack>
                </Box>
            ) : null}
        </>
    );
}
