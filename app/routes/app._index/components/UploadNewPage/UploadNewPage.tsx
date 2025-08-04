import { TitleBar } from "@shopify/app-bridge-react";
import { Banner, Layout, Page, Text, Button, Card, EmptyState } from "@shopify/polaris";
import createVideoImage from "../../../../assets/create-video.png";
import { useLocation, useNavigate } from "react-router-dom";

export default function UploadNewPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    return (
        <Page>
            <TitleBar title="Video Slider"></TitleBar>
            <Layout>
                <Layout.Section>
                    <Banner tone="warning" title="Video Slider is disabled for live theme" onDismiss={() => {}}>
                        <Text as="span">Enable the Video Slider App Embed in Shopify’s Theme Editor to start using the app.</Text>
                        <div style={{ marginTop: 16 }}>
                            <Button
                                onClick={() => {
                                    /* open theme settings */
                                }}
                            >
                                Open Theme Settings
                            </Button>
                        </div>
                    </Banner>
                </Layout.Section>
                <Layout.Section>
                    <Card padding="1000">
                        <EmptyState
                            heading="Create shoppable video slider"
                            action={{
                                content: "Add video slider",
                                onAction: () => {
                                    params.set("tab", "add-slider");
                                    navigate(`?${params.toString()}`, { replace: true });
                                },
                            }}
                            image={createVideoImage}
                        >
                            <p>Engage customers with dynamic video sliders that inspire and drive sales. Start by adding your first video slider!</p>
                        </EmptyState>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
