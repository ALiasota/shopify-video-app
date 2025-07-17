import { TitleBar } from "@shopify/app-bridge-react";
import { Banner, Layout, Page, Text, Button, Card, Image } from "@shopify/polaris";
import createVideoImage from "../../../../assets/create-video.png";
import { useLocation, useNavigate } from "react-router-dom";
import "./StartPage.scss";

export default function StartPage() {
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
                    <Card>
                        <div className="start-page__content">
                            <Image source={createVideoImage} width="142px" alt="Create Video" />
                            <div className="start-page__info">
                                <Text variant="headingLg" as="h2">
                                    Create shoppable video slider
                                </Text>
                                <Text alignment="center" as="p">
                                    Engage customers with dynamic video sliders that inspire and drive sales. Start by adding your first video slider!
                                </Text>
                                <Button
                                    onClick={() => {
                                        params.set("tab", "add-video");
                                        navigate(`?${params.toString()}`, { replace: true });
                                    }}
                                    variant="primary"
                                >
                                    Add video slider
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
