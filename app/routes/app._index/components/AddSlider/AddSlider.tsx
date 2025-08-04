import { useLocation, useNavigate, useFetcher } from "@remix-run/react";
import { SaveBar, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { Layout, Page, Text, Button, Card, Box, TextField, BlockStack, ButtonGroup, Banner, Select, InlineStack } from "@shopify/polaris";
import { useEffect, useState } from "react";
import SliderVideoList from "../SliderVideoList/SliderVideoList";

import SliderLayoutSection from "../SliderLayoutSection/SliderLayoutSection";
import type { SliderObjectType } from "../types";
import { SliderLayoutTypeEnum, SliderPlacementTypeEnum, SliderStatusEnum } from "../types";
import type { VideoDB } from "drizzle/schema.server";
import { AlertCircleIcon } from "@shopify/polaris-icons";
import SliderPlacementSection from "../SliderPlacementSection/SliderPlacementSection";

const maxSlidesCount = 6;
const minSlidesCount = 4;

const statusOptions = [
    { label: "Active", value: SliderStatusEnum.ACTIVE },
    { label: "Draft", value: SliderStatusEnum.DRAFT },
];

const initSliderOject = {
    title: "",
    handle: "",
    status: SliderStatusEnum.ACTIVE,
    placement: SliderPlacementTypeEnum.HOME,
    layout: SliderLayoutTypeEnum.CAROUSEL,
    videosPerRow: "4",
    slides: [],
};

interface AddSliderProps {
    videos: VideoDB[];
    currencyCode: string;
}

export default function AddSlider({ videos, currencyCode }: AddSliderProps) {
    const [sliderObject, setSliderObject] = useState<SliderObjectType>(initSliderOject);
    const [stage, setStage] = useState<"start" | "slider">("start");
    const [disabled, setDisabled] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();
    const shopify = useAppBridge();
    const params = new URLSearchParams(location.search);
    const fetcher = useFetcher<any>();

    const isLoading = fetcher.state !== "idle";

    const updateSliderField = <K extends keyof SliderObjectType>(field: K, value: SliderObjectType[K]) => {
        setSliderObject((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onClickSave = () => {
        const payload = {
            title: sliderObject.title,
            handle: sliderObject.title + Math.floor(Math.random() * 90) + 10,
            status: sliderObject.status,
            layout: sliderObject.layout,
            placement: sliderObject.placement,
            videosPerRow: sliderObject.videosPerRow,
            slides: JSON.stringify(sliderObject.slides),
        };
        try {
            fetcher.submit(payload, {
                method: "POST",
                encType: "application/json",
            });
        } catch {
            shopify.toast.show("Error saving slider");
        }
    };

    useEffect(() => {
        if (stage === "slider") {
            shopify.saveBar.show("slider-save-bar");
        }
    }, [stage]);

    useEffect(() => {
        if (!sliderObject.title.length || sliderObject.slides.length < minSlidesCount) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [sliderObject]);

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.data.ok) {
                shopify.toast.show("Slider saved!");
                params.set("tab", "start-page");
                navigate(`?${params.toString()}`, { replace: true });
                shopify.saveBar.hide("slider-save-bar");
            } else {
                shopify.toast.show(fetcher.data.data.message || "Error saving slider");
            }
        }
    }, [fetcher.data]);

    return (
        <>
            <SaveBar id="slider-save-bar">
                <button loading={isLoading ? true : undefined} variant="primary" disabled={disabled} onClick={onClickSave}></button>
                <button
                    onClick={() => {
                        params.set("tab", "start-page");
                        navigate(`?${params.toString()}`, { replace: true });
                        shopify.saveBar.hide("slider-save-bar");
                    }}
                ></button>
            </SaveBar>

            <Page backAction={{ content: "Back", url: "/app", onAction: () => shopify.saveBar.hide("slider-save-bar") }} title={"Add video slider"}>
                <TitleBar title="Video Slider"></TitleBar>
                <Layout>
                    <Layout.Section>
                        <Card>
                            <Box paddingBlockEnd="200">
                                <InlineStack wrap={false} gap="400">
                                    <Box width="90%">
                                        <TextField
                                            label="Title"
                                            value={sliderObject.title}
                                            onChange={(value: string) => updateSliderField("title", value)}
                                            autoComplete="off"
                                            helpText="Helps you identify video slider, not visible to your customers"
                                        />
                                    </Box>

                                    {/* <Box> */}
                                    <Select options={statusOptions} value={sliderObject.status} onChange={(value) => updateSliderField("status", value as SliderStatusEnum)} label={"Status"} />
                                    {/* </Box> */}
                                </InlineStack>
                            </Box>
                            {(sliderObject.slides.length < minSlidesCount || sliderObject.slides.length >= maxSlidesCount) && stage === "slider" && (
                                <Banner tone="warning" icon={AlertCircleIcon}>
                                    <BlockStack gap="200">
                                        <Text as="span" variant="bodyMd">
                                            {sliderObject.slides.length >= maxSlidesCount
                                                ? "You have reached the maximum limit of slides"
                                                : `You need to add between ${minSlidesCount} and ${maxSlidesCount} slides.`}
                                        </Text>
                                    </BlockStack>
                                </Banner>
                            )}
                            <BlockStack gap="100" align="center">
                                <Text variant="bodyMd" as="p">
                                    Videos
                                </Text>

                                <Box
                                    paddingBlockEnd="1000"
                                    paddingBlockStart={stage === "start" ? "1000" : "0"}
                                    borderRadius="200"
                                    borderColor="border"
                                    borderWidth={stage === "start" ? "025" : "0"}
                                    background="bg-surface"
                                >
                                    {stage === "start" && (
                                        <BlockStack gap="200" align="center" inlineAlign="center">
                                            <ButtonGroup>
                                                <Button
                                                    onClick={() => {
                                                        setStage("slider");
                                                    }}
                                                >
                                                    Upload new
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        params.set("tab", "select-video");
                                                        navigate(`?${params.toString()}`, { replace: true });
                                                    }}
                                                    variant="tertiary"
                                                >
                                                    Select existing
                                                </Button>
                                            </ButtonGroup>
                                            <Text as="p" variant="bodySm">
                                                Accepts .mp4, .mov and .webm
                                            </Text>
                                        </BlockStack>
                                    )}
                                    {stage === "slider" && (
                                        <SliderVideoList
                                            currencyCode={currencyCode}
                                            videos={videos}
                                            slides={sliderObject.slides}
                                            updateSliderField={updateSliderField}
                                            maxSlidesCount={maxSlidesCount}
                                            minSlidesCount={minSlidesCount}
                                        />
                                    )}
                                </Box>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                    {stage === "slider" && (
                        <>
                            <SliderLayoutSection updateSliderField={updateSliderField} selectedOption={sliderObject.layout} videosPerRow={sliderObject.videosPerRow} />
                            <SliderPlacementSection updateSliderField={updateSliderField} selectedPlacement={sliderObject.placement} />
                        </>
                    )}

                    <Layout.Section>
                        <BlockStack gap="100" align="center" inlineAlign="end">
                            <Button disabled={disabled} loading={isLoading ? true : undefined} onClick={onClickSave} variant="primary">
                                Save
                            </Button>
                        </BlockStack>
                    </Layout.Section>
                </Layout>
            </Page>
        </>
    );
}
