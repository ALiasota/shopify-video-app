import { db } from "app/clients/db.server";
import type { SliderObjectType, SliderProductType, SliderVariantType } from "app/routes/app._index/components/types";
import { logger } from "app/service/logger.server";
import { inArray } from "drizzle-orm";
import { productsTable, productVariantsTable, slidersTable, slidesTable } from "drizzle/schema.server";

export const createSlider = async (sliderObject: SliderObjectType, merchantId: number) => {
    const variants: Array<SliderVariantType & { shopifyProductId: string; videoId: string }> = [];

    let products = sliderObject.slides
        .filter((slide) => !!slide.product)
        .map((slide) => {
            const product = slide.product as SliderProductType;
            const { variant, ...prod } = product;
            variants.push({ ...variant, shopifyProductId: prod.shopifyProductId, videoId: slide.videoId });
            return { ...prod, merchantId };
        });

    const shopifyProductIds = products.map((prod) => prod.shopifyProductId);

    return await db.transaction(async (tx) => {
        const slider = (
            await tx
                .insert(slidersTable)
                .values({
                    merchantId,
                    title: sliderObject.title,
                    handle: sliderObject.handle,
                    status: sliderObject.status,
                    placement: sliderObject.placement,
                    layout: sliderObject.layout,
                    videosPerRow: sliderObject.videosPerRow,
                    autoScrollSeconds: sliderObject.autoScrollSeconds,
                })
                .returning()
        )[0];

        const insertedSlides = await tx
            .insert(slidesTable)
            .values(
                sliderObject.slides.map((slide) => ({
                    sliderId: slider.id,
                    videoId: slide.videoId,
                })),
            )
            .returning({ id: slidesTable.id, videoId: slidesTable.videoId });

        const productsDb = await db
            .select({ id: productsTable.id, shopifyProductId: productsTable.shopifyProductId })
            .from(productsTable)
            .where(inArray(productsTable.shopifyProductId, shopifyProductIds));

        products = products.filter((prod) => !productsDb.some((prodDb) => prodDb.shopifyProductId === prod.shopifyProductId));

        const insertedProducts = products.length ? await tx.insert(productsTable).values(products).returning({ id: productsTable.id, shopifyProductId: productsTable.shopifyProductId }) : [];

        const prodIds = [...productsDb, ...insertedProducts];

        const variantsToInsert = variants.map((variant) => {
            const { shopifyProductId, videoId, ...variantData } = variant;

            const prod = prodIds.find((pr) => pr.shopifyProductId === shopifyProductId);
            if (!prod) {
                logger.error("Could not find product", {
                    shopifyProductId,
                });
                throw new Error("Could not find product");
            }

            const slide = insertedSlides.find((slide) => slide.videoId === videoId);
            if (!slide) {
                logger.error("Could not find slide with video", {
                    videoId,
                });
                throw new Error("Could not find slide with video");
            }

            return { ...variantData, productId: prod.id, slideId: slide.id };
        });

        if (variantsToInsert.length) {
            await tx.insert(productVariantsTable).values(variantsToInsert);
        }

        return slider;
    });
};
