import { Box, Checkbox, Grid, Image, Icon, Text } from "@shopify/polaris";
import type { VideoType } from "../types";
import { useCallback, useState } from "react";
import { PlusIcon } from "@shopify/polaris-icons";

interface GridListItemProps {
    video?: VideoType;
    moreVideosNumber?: number;
    onClickShowAll: () => void;
    onClickCheck: (id: string) => void;
    onClickPreview: (id: string) => void;
    checked: boolean;
}

export default function SliderVideoListItem({ video, moreVideosNumber, onClickShowAll, onClickCheck, onClickPreview, checked }: GridListItemProps) {
    const [focused, setFocused] = useState(false);
    const handleCheck = useCallback(() => {
        if (video) {
            onClickCheck(video.id);
        }
    }, [onClickCheck, video]);

    return (
        <Grid.Cell>
            <Box position="relative" overflowX="hidden" overflowY="hidden" borderRadius="200" borderColor="border" borderWidth="050">
                <div
                    onMouseEnter={() => setFocused(true)}
                    onMouseLeave={() => setFocused(false)}
                    onClick={() => {
                        if (moreVideosNumber) {
                            onClickShowAll();
                        } else if (video) {
                            onClickPreview(video.id);
                        }
                    }}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        height: "140px",
                        backgroundColor: focused && video ? "#30303014" : "transparent",
                    }}
                >
                    {video ? (
                        <>
                            <div
                                style={{
                                    height: "140px",
                                    filter: moreVideosNumber ? "blur(4px)" : "none",
                                }}
                            >
                                <Image width="140px" height="140px" alt={video.filename} source={video.thumbnailUrl} />
                            </div>
                            {(focused || moreVideosNumber) && (
                                <div
                                    style={{
                                        position: "absolute",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        background: "rgba(0,0,0,0.22)",
                                        borderRadius: "8px",
                                        pointerEvents: "none",
                                        zIndex: 1,
                                        color: "white",
                                    }}
                                >
                                    {moreVideosNumber ? (
                                        <Text tone="inherit" as="span" fontWeight="bold">
                                            {moreVideosNumber}
                                        </Text>
                                    ) : (
                                        <div style={{ position: "absolute", bottom: "8px", width: "90%", padding: "5px", backgroundColor: "#DCDCDC", borderRadius: "12px" }}>
                                            <Text alignment="center" tone="base" variant="bodyMd" as="p">
                                                {video.productIds.length + " product(s)"}
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            )}
                            {(checked || focused) && !moreVideosNumber ? (
                                <div style={{ position: "absolute", top: 0, width: "100%", padding: "5px", color: "white" }}>
                                    <Checkbox checked={checked} onChange={handleCheck} label="" />
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <Icon source={PlusIcon} />
                    )}
                </div>
            </Box>
        </Grid.Cell>
    );
}
