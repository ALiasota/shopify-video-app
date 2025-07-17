import { useLocation, useNavigate } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { Layout, Page, Text, Button, Card, Box, TextField, BlockStack, ButtonGroup } from "@shopify/polaris";
import { useState } from "react";

export default function AddVideo() {
    const [title, setTitle] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    return (
        <Page backAction={{ content: "Back", url: "/app" }} title={"Add video slider"} narrowWidth>
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

                            <Box paddingBlockEnd="1000" paddingBlockStart="1000" borderRadius="200" borderColor="border" borderWidth="025" background="bg-surface">
                                <BlockStack gap="200" align="center" inlineAlign="center">
                                    <ButtonGroup>
                                        <Button>Upload new</Button>
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
    );
}
