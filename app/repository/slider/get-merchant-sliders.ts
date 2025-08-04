import { db } from "app/clients/db.server";
import type { SliderStatusEnum } from "app/routes/app._index/components/types";

export const getMerchantSliders = (merchantId: number, status: SliderStatusEnum) =>
    db.query.slidersTable.findMany({
        where: (slider, { eq, and }) => and(eq(slider.status, status), eq(slider.merchantId, merchantId)),
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
