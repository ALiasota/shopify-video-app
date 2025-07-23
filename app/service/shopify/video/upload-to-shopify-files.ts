import type { AdminContext } from "@shopify/shopify-app-remix/server";
import { logger } from "app/service/logger.server";
import { FileContentType } from "app/types/admin.types";

export async function uploadToShopifyFiles(graphql: AdminContext["admin"]["graphql"], file: File) {
    const prepareFiles = (files: { name: string | null; type: string | null; size: number | null }[]) =>
        files.map((file) => ({
            filename: file.name!,
            mimeType: file.type!,
            resource: "VIDEO" as any,
            fileSize: file.size!.toString(),
            httpMethod: "POST" as any,
        }));

    const preparedFiles = prepareFiles([file]);

    const uploadFileResponse = await graphql(
        `
            #graphql
            mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
                stagedUploadsCreate(input: $input) {
                    stagedTargets {
                        resourceUrl
                        url
                        parameters {
                            name
                            value
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `,
        { variables: { input: preparedFiles } },
    );

    const uploadedFileJson = await uploadFileResponse.json();

    if (!uploadedFileJson.data?.stagedUploadsCreate?.stagedTargets?.length) {
        logger.error("Failed to get staged upload target");
        throw new Response("Failed to get staged upload target", {
            status: 500,
        });
    }

    const target = uploadedFileJson.data?.stagedUploadsCreate?.stagedTargets[0];

    const uploadFormData = new FormData();
    for (const param of target.parameters) {
        uploadFormData.append(param.name, param.value);
    }
    uploadFormData.append("file", file);

    const uploadRes = await fetch(target.url, {
        method: "POST",
        body: uploadFormData,
    });

    if (!uploadRes.ok) {
        logger.error("Upload to Shopify S3 failed");
        throw new Response("Upload to Shopify S3 failed", {
            status: 500,
        });
    }

    const fileCreateResponse = await graphql(
        `
            #graphql
            mutation fileCreate($files: [FileCreateInput!]!) {
                fileCreate(files: $files) {
                    files {
                        id
                        alt
                        fileStatus
                        createdAt
                        fileErrors {
                            code
                            details
                            message
                        }
                        fileStatus
                        preview {
                            image {
                                url
                            }
                            status
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `,
        {
            variables: {
                files: {
                    alt: "video",
                    contentType: FileContentType.Video,
                    originalSource: target.resourceUrl,
                },
            },
        },
    );

    const fileCreateJson = await fileCreateResponse.json();

    if (fileCreateJson.data?.fileCreate?.userErrors || !fileCreateJson.data?.fileCreate?.files?.length) {
        logger.error("Error adding video", {
            errors: fileCreateJson.data?.fileCreate?.userErrors,
        });
        throw new Response("Error adding video", {
            status: 500,
        });
    }

    return fileCreateJson.data?.fileCreate?.files[0];
}
