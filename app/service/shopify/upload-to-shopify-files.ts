// import type { AdminContext } from "@shopify/shopify-app-remix/server";
// import { gql } from "graphql-request";

// // 1. Отримати staged upload URL
// export async function uploadToShopifyFiles(
//   graphql: AdminContext["admin"]["graphql"],
//   {
//     fileBuffer,
//     filename,
//     mimeType,
//   }: { fileBuffer: Buffer; filename: string; mimeType: string }
// ) {
//   // Step 1. stagedUploadsCreate
//   const STAGED_UPLOAD_MUTATION = gql`
//     mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
//       stagedUploadsCreate(input: $input) {
//         stagedTargets {
//           url
//           resourceUrl
//           parameters {
//             name
//             value
//           }
//         }
//         userErrors {
//           message
//         }
//       }
//     }
//   `;
//   const { stagedUploadsCreate } = await graphql(STAGED_UPLOAD_MUTATION, {
//     input: [
//       {
//         filename,
//         mimeType,
//         resource: "VIDEO",
//         fileSize: fileBuffer.length,
//         httpMethod: "POST",
//       },
//     ],
//   });

//   if (stagedUploadsCreate.userErrors.length) {
//     return { error: stagedUploadsCreate.userErrors[0].message };
//   }

//   const target = stagedUploadsCreate.stagedTargets[0];

//   // Step 2. Upload файла через fetch/axios (multipart/form-data POST)
//   const formData = new FormData();
//   target.parameters.forEach((param: any) => {
//     formData.append(param.name, param.value);
//   });
//   formData.append("file", new Blob([fileBuffer]), filename);

//   const uploadResp = await fetch(target.url, {
//     method: "POST",
//     body: formData,
//   });
//   if (!uploadResp.ok) {
//     return { error: "Failed to upload to staged url" };
//   }

//   // Step 3. fileCreate (GraphQL)
//   const FILE_CREATE = gql`
//     mutation fileCreate($files: [FileCreateInput!]!) {
//       fileCreate(files: $files) {
//         files {
//           id
//           alt
//           url
//           createdAt
//         }
//         userErrors {
//           message
//         }
//       }
//     }
//   `;
//   const fileCreateResp = await graphql(FILE_CREATE, {
//     files: [
//       {
//         originalSource: target.resourceUrl,
//         filename,
//         contentType: mimeType,
//         alt: filename,
//       },
//     ],
//   });

//   if (fileCreateResp.fileCreate.userErrors.length) {
//     return { error: fileCreateResp.fileCreate.userErrors[0].message };
//   }
//   return { file: fileCreateResp.fileCreate.files[0] };
// }
