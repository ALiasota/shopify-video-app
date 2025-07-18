import { Box, Checkbox, Grid, InlineStack, Text, Image } from "@shopify/polaris";
import type { VideoType } from "../types";
import { useCallback, useState } from "react";

function formatDuration(duration: number) {
    const min = Math.floor(duration / 60);
    const sec = duration % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

function truncateText(text: string, maxLength = 13) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
}

interface GridListItemProps {
    video: VideoType;
    // updateChecked: (id: string) => void;
}

export default function GridListItem({ video }: GridListItemProps) {
    const [focused, setFocused] = useState(false);
    const [checked, setChecked] = useState(false);
    const handleCheck = useCallback((newChecked: boolean) => setChecked(newChecked), []);

    return (
        <Grid.Cell>
            <div
                onMouseEnter={() => setFocused(true)}
                onMouseLeave={() => setFocused(false)}
                style={{
                    cursor: "pointer",
                    borderRadius: "12px",
                    backgroundColor: focused ? "#30303014" : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    height: "184px",
                    padding: "16px",
                }}
            >
                <Box position="relative" overflowX="hidden" overflowY="hidden" borderRadius="200" borderColor="border" borderWidth="025">
                    <Image height={"104px"} width={"104px"} alt={video.filename} source={video.thumbnailUrl} />
                    <div style={{ position: "absolute", top: 0, width: "100%", padding: "5px", color: "white" }}>
                        <InlineStack blockAlign="center" align="space-between" wrap={false}>
                            <Checkbox checked={checked} onChange={handleCheck} label="" />
                            <Text tone="inherit" as="span" fontWeight="bold">
                                {formatDuration(video.duration)}
                            </Text>
                        </InlineStack>
                    </div>
                </Box>

                <Text as="p" fontWeight="medium" truncate>
                    {truncateText(video.filename)}
                </Text>
                <Text fontWeight="medium" tone="subdued" as="p">
                    {video.format.toUpperCase()}
                </Text>
            </div>
        </Grid.Cell>
    );
}
