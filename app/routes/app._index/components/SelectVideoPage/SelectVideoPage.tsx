import { TitleBar } from "@shopify/app-bridge-react";
import { Text, Button, Box, Image, BlockStack, ButtonGroup, Page, Layout, Card } from "@shopify/polaris";
import selectVideoImage from "../../../../assets/select-video-modal.png";
import { useState } from "react";
import VideoList from "../VideoList/VideoList";
import AddFromUrl from "../AddFromUrl/AddFromUrl";

export default function SelectVideoPage() {
    const [videos, setVideos] = useState<any[]>([]);

    const addUrl = (url: string) => {
        setVideos((prev) => [...prev, url]);
    };

    return (
        <Page backAction={{ content: "Back", url: "/app" }} title={"Add video slider"}>
            <TitleBar title="Video Slider"></TitleBar>
            <Layout>
                <Layout.Section>
                    <Card>
                        {videos.length ? (
                            <VideoList />
                        ) : (
                            <BlockStack gap="200" align="center" inlineAlign="center">
                                <Image source={selectVideoImage} width="226px" alt="Create Video" />
                                <Text variant="headingLg" as="h2">
                                    No videos yet
                                </Text>
                                <Box width="400px">
                                    <Text alignment="center" as="p">
                                        Upload videos to make selection. You’ll also be able to reuse the videos in other areas of Shopify
                                    </Text>
                                </Box>

                                <ButtonGroup>
                                    <Button variant="primary">Upload video</Button>
                                    <AddFromUrl addUrl={addUrl} />
                                </ButtonGroup>
                            </BlockStack>
                        )}
                    </Card>
                </Layout.Section>

                <Layout.Section>
                    <BlockStack gap="100" align="center" inlineAlign="end">
                        <Button variant="primary">Add</Button>
                    </BlockStack>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
