import { db } from "app/clients/db.server";
import type { SliderStatusEnum } from "app/routes/app._index/components/types";

export const getMerchantSliders = (merchantId: number, status?: SliderStatusEnum) => {
    return db.query.slidersTable.findMany({
        where: (slider, { eq, and }) => {
            const conditions = [eq(slider.merchantId, merchantId)];

            if (status) {
                conditions.push(eq(slider.status, status));
            }

            return and(...conditions);
        },
        with: {
            slides: {
                with: {
                    video: true,
                    variant: {
                        with: { product: true },
                    },
                },
            },
        },
    });
};
