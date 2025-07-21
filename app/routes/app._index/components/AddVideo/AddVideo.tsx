import { useLocation, useNavigate } from "@remix-run/react";
import { SaveBar, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { Layout, Page, Text, Button, Card, Box, TextField, BlockStack, ButtonGroup } from "@shopify/polaris";
import { useEffect, useState } from "react";
import SliderVideoList from "../SliderVideoList/SliderVideoList";
import { videos } from "../videos";

export default function AddVideo() {
    const [title, setTitle] = useState("");
    const [stage, setStage] = useState<"start" | "slider">("start");
    const location = useLocation();
    const navigate = useNavigate();
    const shopify = useAppBridge();
    const params = new URLSearchParams(location.search);

    useEffect(() => {
        if (stage === "slider") {
            shopify.saveBar.show("slider-save-bar");
        }
    }, [stage]);

    return (
        <>
            <SaveBar id="slider-save-bar">
                <button variant="primary" onClick={() => shopify.saveBar.hide("slider-save-bar")}></button>
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
                                <TextField label="Title" value={title} onChange={setTitle} autoComplete="off" helpText="Helps you identify video slider, not visible to your customers" />
                            </Box>
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
                                    {stage === "slider" && <SliderVideoList videos={videos} />}
                                </Box>
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                    <Layout.Section>
                        <BlockStack gap="100" align="center" inlineAlign="end">
                            <Button variant="primary">Save</Button>
                        </BlockStack>
                    </Layout.Section>
                </Layout>
            </Page>
        </>
    );
}
