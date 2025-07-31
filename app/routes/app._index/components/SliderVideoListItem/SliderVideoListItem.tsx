import { Box, Checkbox, Grid, Image, Icon, Text } from "@shopify/polaris";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlusIcon } from "@shopify/polaris-icons";
import { useFetcher } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import type { VideoDB } from "drizzle/schema.server";
import { FileStatus } from "app/types/admin.types";

const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];

interface GridListItemProps {
    video?: Required<VideoDB>;
    moreVideosNumber?: number;
    onClickShowAll: () => void;
    onClickCheck: (id: string) => void;
    onClickPreview: (id: string) => void;
    checked: boolean;
}

export default function SliderVideoListItem({ video, moreVideosNumber, onClickShowAll, onClickCheck, onClickPreview, checked }: GridListItemProps) {
    const [focused, setFocused] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fetcher = useFetcher<{ data: { ok?: boolean; video: VideoDB } }>();
    const shopify = useAppBridge();

    const handleCheck = useCallback(() => {
        if (video) {
            onClickCheck(video.id);
        }
    }, [onClickCheck, video]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            shopify.toast.show("Your video should be in mp4, webm, mov format");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            shopify.toast.show("Video size should be lass than 10Mb");
            return;
        }

        const url = URL.createObjectURL(file);
        const video = document.createElement("video");

        const checkResolution = () =>
            new Promise<{ width: number; height: number }>((resolve, reject) => {
                video.onloadedmetadata = () => {
                    resolve({ width: video.videoWidth, height: video.videoHeight });
                    URL.revokeObjectURL(url);
                };
                video.onerror = (err) => {
                    reject(err);
                    URL.revokeObjectURL(url);
                };
            });

        video.src = url;
        try {
            const { width, height } = await checkResolution();
            if (width > 720 || height > 480) {
                shopify.toast.show("Video resolution is to hight");
                return;
            }

            setUploading(true);

            const formData = new FormData();
            formData.append("video", file);

            fetcher.submit(formData, {
                method: "post",
                action: "/api/upload-video",
                encType: "multipart/form-data",
            });
        } catch {
            shopify.toast.show("Video upload error");
        }
    };

    useEffect(() => {
        if (fetcher.data?.data && fetcher.data.data.ok && fetcher.data.data.video) {
            if (fetcher.data.data.video.status === FileStatus.Ready) {
                setUploading(false);
            } else {
                setTimeout(() => {
                    fetcher.submit(
                        { videoId: String(fetcher.data?.data.video.id) },
                        {
                            method: "post",
                            action: `/app/get-video`,
                            encType: "application/json",
                        },
                    );
                }, 5000);
            }
        }
        if (fetcher.data?.data && !fetcher.data?.data.ok) {
            shopify.toast.show("Video upload error");
            setUploading(false);
        }
    }, [fetcher.data]);

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
                        } else if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                            fileInputRef.current.click();
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
                                <Image width="140px" height="140px" alt={video.filename} source={video.thumbnailUrl!} />
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
                                    ) : null}
                                </div>
                            )}
                            {(checked || focused) && !moreVideosNumber ? (
                                <div style={{ position: "absolute", top: 0, width: "100%", padding: "5px", color: "white" }}>
                                    <Checkbox checked={checked} onChange={handleCheck} label="" />
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <>
                            <Icon source={PlusIcon} />
                            <input type="file" accept="video/*" style={{ display: "none" }} ref={fileInputRef} onChange={handleUpload} />
                        </>
                    )}
                    {uploading && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                background: "rgba(255,255,255,0.8)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 10,
                            }}
                        >
                            <Text as="span">Uploading...</Text>
                        </div>
                    )}
                </div>
            </Box>
        </Grid.Cell>
    );
}
