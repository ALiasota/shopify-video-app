import { Text, Button, BlockStack, ButtonGroup, FormLayout, TextField, Popover } from "@shopify/polaris";
import { useCallback, useState } from "react";

interface AddFromUrlProps {
    addUrl: (url: string) => void;
}

export default function AddFromUrl({ addUrl }: AddFromUrlProps) {
    const [popoverActive, setPopoverActive] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");

    const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

    const onAddUrl = () => {
        addUrl(videoUrl);
        setVideoUrl("");
        togglePopoverActive();
    };

    const activator = (
        <Button onClick={togglePopoverActive} variant="tertiary">
            Add from URL
        </Button>
    );

    return (
        <Popover active={popoverActive} activator={activator} onClose={togglePopoverActive} ariaHaspopup={false} sectioned>
            <FormLayout>
                <Text variant="headingSm" as="h5">
                    Add video from URL
                </Text>
                <TextField placeholder="https://" label="YouTube or Vimeo URL" value={videoUrl} onChange={setVideoUrl} autoComplete="off" />
                <BlockStack align="center" inlineAlign="end">
                    <ButtonGroup>
                        <Button onClick={togglePopoverActive}>Cancel</Button>
                        <Button onClick={onAddUrl} variant="primary" disabled={!videoUrl.length}>
                            Add video
                        </Button>
                    </ButtonGroup>
                </BlockStack>
            </FormLayout>
        </Popover>
    );
}
