import { BlockStack, Box, ChoiceList, Icon, Text, Image } from "@shopify/polaris";
import type { SliderProductType, SliderVariantType, SlideType } from "../types";
import { EditIcon } from "@shopify/polaris-icons";
import "./SliderPreviewSection.scss";
import { useCallback, useEffect, useState } from "react";
import { useAppBridge, Modal, TitleBar } from "@shopify/app-bridge-react";
import type { Product } from "@shopify/app-bridge/actions/ResourcePicker";
import getSymbolFromCurrency from "currency-symbol-map";
import productImage from "../../../../assets/product-image.png";

function truncateText(text: string, maxLength: number) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

interface SliderPreviewSectionItemProps {
    slide: SlideType;
    currencyCode: string;
    saveSlide: (slide: SlideType) => void;
    shop: string;
}

export default function SliderPreviewSectionItem({ slide, currencyCode, saveSlide, shop }: SliderPreviewSectionItemProps) {
    const [selectedProduct, setSelectedProduct] = useState<Omit<SliderProductType, "variant"> | null>(null);
    const [variants, setVariants] = useState<SliderVariantType[]>([]);
    const [variantsChoiceList, setVariantsChoiceList] = useState<{ label: string; value: string }[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<SliderVariantType | null>(null);
    const currencySymbol = getSymbolFromCurrency(currencyCode);

    const shopify = useAppBridge();

    const handleChangeVariant = useCallback(
        (value: string[]) => {
            const variant = variants.find((v) => v.shopifyVariantId === value[0]);

            if (variant) {
                setSelectedVariant(variant);
            }
        },
        [variants],
    );

    const updateSlide = () => {
        if (!selectedVariant || !selectedProduct) return;

        saveSlide({
            videoId: slide.videoId,
            videoUrl: slide.videoUrl,
            product: {
                ...selectedProduct,
                variant: selectedVariant,
            },
        });
    };

    const onClickSaveVariant = () => {
        updateSlide();
        shopify.modal.hide("variants-modal" + slide.videoId);
    };

    const onClickCancelSavingVariants = () => {
        if (slide.product) {
            const { variant, ...prod } = slide.product;
            setSelectedProduct(prod);
            setVariants([variant]);
            setSelectedVariant(variant);
        } else {
            setSelectedProduct(null);
            setVariants([]);
            setVariantsChoiceList([]);
            setSelectedVariant(null);
        }
        shopify.modal.hide("variants-modal" + slide.videoId);
    };

    const onClickAddProduct = () => {
        shopify
            .resourcePicker({
                type: "product",
                multiple: false,
                action: "add",
                filter: {
                    variants: false,
                },
                selectionIds: slide.product?.shopifyProductId ? [{ id: slide.product.shopifyProductId }] : undefined,
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
                setSelectedVariant(variantList[0]);

                if (variantList.length > 1) {
                    shopify.modal.show("variants-modal" + slide.videoId);
                } else {
                    updateSlide();
                }
            });
    };

    useEffect(() => {
        if (selectedProduct) return;

        if (slide.product) {
            const { variant, ...prod } = slide.product;
            setSelectedProduct(prod);
            setVariants([variant]);
            setSelectedVariant(variant);
        } else {
            setSelectedProduct(null);
            setVariants([]);
            setVariantsChoiceList([]);
            setSelectedVariant(null);
        }
    }, [currencySymbol, selectedProduct, slide]);

    return (
        <>
            <div key={slide.videoId} className="slider__slide">
                <video src={slide.videoUrl} autoPlay loop muted playsInline className="slider__video" />
                <button type="button" className="slider__edit-btn" onClick={onClickAddProduct}>
                    <Icon tone="inherit" source={EditIcon} />
                </button>

                {selectedProduct && selectedVariant ? (
                    <div className="slider__product-info-container">
                        <div className="slider__product-info">
                            <Image width="48px" height="48px" alt={selectedProduct.title} source={selectedProduct.thumbnailUrl || productImage} />
                            <div className="slider__text-container">
                                <div>
                                    <div>{truncateText(selectedProduct.title, 12)}</div>
                                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                        <span style={{ fontWeight: "600" }}>
                                            {currencySymbol} {selectedVariant.price}
                                        </span>
                                        {selectedVariant.compareAtPrice ? (
                                            <span style={{ textDecoration: "line-through" }}>
                                                {currencySymbol} {selectedVariant.compareAtPrice}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <div style={{ width: "52px" }}>
                                    <a href={`https://${shop}/products/${selectedProduct.handle}`} target="blank" className="slider__product-button">
                                        Shop now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <Modal variant="small" id={"variants-modal" + slide.videoId}>
                <Box padding="400">
                    <BlockStack inlineAlign="center" gap="200">
                        <Text as="h2" variant="headingMd" alignment="center">
                            {selectedProduct?.title}
                        </Text>
                        <ChoiceList title="Select Variant" choices={variantsChoiceList} selected={[selectedVariant?.shopifyVariantId as string]} onChange={handleChangeVariant} />
                    </BlockStack>
                </Box>

                <TitleBar title="Variants">
                    <button variant="primary" onClick={onClickSaveVariant}>
                        Confirm
                    </button>
                    <button onClick={onClickCancelSavingVariants}>Cancel</button>
                </TitleBar>
            </Modal>
        </>
    );
}
