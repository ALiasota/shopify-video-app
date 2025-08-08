import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data, useLoaderData } from "@remix-run/react";
import { requireMerchantFromAdmin } from "app/service/require-merchant-from-admin";
import { getMerchantSliders } from "app/repository/slider/get-merchant-sliders";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { merchant } = await requireMerchantFromAdmin(request);
    const sliders = await getMerchantSliders(merchant.id);
    console.log(sliders);
    return data({ ok: true, sliders, currencyCode: merchant.currencyCode });
};

export const action = async ({ request }: ActionFunctionArgs) => {
    return data({ ok: true });
};

export default function Sliders() {
    const { data } = useLoaderData<typeof loader>();

    return <>Sliders</>;
}
