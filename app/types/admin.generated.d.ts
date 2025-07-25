/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type GetShopifyShopDataQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type GetShopifyShopDataQuery = { shop: (
    Pick<AdminTypes.Shop, 'id' | 'email' | 'shopOwnerName' | 'myshopifyDomain' | 'contactEmail' | 'currencyCode' | 'weightUnit'>
    & { plan: Pick<AdminTypes.ShopPlan, 'shopifyPlus'>, billingAddress: Pick<AdminTypes.ShopAddress, 'address1' | 'address2' | 'city' | 'province' | 'country' | 'phone'>, primaryDomain: Pick<AdminTypes.Domain, 'url'>, currencyFormats: Pick<AdminTypes.CurrencyFormats, 'moneyFormat' | 'moneyInEmailsFormat'> }
  ) };

export type DeleteFilesMutationVariables = AdminTypes.Exact<{
  ids: Array<AdminTypes.Scalars['ID']['input']> | AdminTypes.Scalars['ID']['input'];
}>;


export type DeleteFilesMutation = { fileDelete?: AdminTypes.Maybe<(
    Pick<AdminTypes.FileDeletePayload, 'deletedFileIds'>
    & { userErrors: Array<Pick<AdminTypes.FilesUserError, 'field' | 'message'>> }
  )> };

export type GetVideoByIdQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetVideoByIdQuery = { node?: AdminTypes.Maybe<(
    Pick<AdminTypes.Video, 'id' | 'alt' | 'createdAt' | 'fileStatus'>
    & { fileErrors: Array<Pick<AdminTypes.FileError, 'code' | 'details' | 'message'>>, sources: Array<Pick<AdminTypes.VideoSource, 'format' | 'height' | 'mimeType' | 'url' | 'width'>>, preview?: AdminTypes.Maybe<(
      Pick<AdminTypes.MediaPreviewImage, 'status'>
      & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }
    )> }
  )> };

export type StagedUploadsCreateMutationVariables = AdminTypes.Exact<{
  input: Array<AdminTypes.StagedUploadInput> | AdminTypes.StagedUploadInput;
}>;


export type StagedUploadsCreateMutation = { stagedUploadsCreate?: AdminTypes.Maybe<{ stagedTargets?: AdminTypes.Maybe<Array<(
      Pick<AdminTypes.StagedMediaUploadTarget, 'resourceUrl' | 'url'>
      & { parameters: Array<Pick<AdminTypes.StagedUploadParameter, 'name' | 'value'>> }
    )>>, userErrors: Array<Pick<AdminTypes.UserError, 'field' | 'message'>> }> };

export type FileCreateMutationVariables = AdminTypes.Exact<{
  files: Array<AdminTypes.FileCreateInput> | AdminTypes.FileCreateInput;
}>;


export type FileCreateMutation = { fileCreate?: AdminTypes.Maybe<{ files?: AdminTypes.Maybe<Array<(
      Pick<AdminTypes.ExternalVideo, 'id' | 'alt' | 'fileStatus' | 'createdAt'>
      & { fileErrors: Array<Pick<AdminTypes.FileError, 'code' | 'details' | 'message'>>, preview?: AdminTypes.Maybe<(
        Pick<AdminTypes.MediaPreviewImage, 'status'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }
      )> }
    ) | (
      Pick<AdminTypes.GenericFile, 'id' | 'alt' | 'fileStatus' | 'createdAt'>
      & { fileErrors: Array<Pick<AdminTypes.FileError, 'code' | 'details' | 'message'>>, preview?: AdminTypes.Maybe<(
        Pick<AdminTypes.MediaPreviewImage, 'status'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }
      )> }
    ) | (
      Pick<AdminTypes.MediaImage, 'id' | 'alt' | 'fileStatus' | 'createdAt'>
      & { fileErrors: Array<Pick<AdminTypes.FileError, 'code' | 'details' | 'message'>>, preview?: AdminTypes.Maybe<(
        Pick<AdminTypes.MediaPreviewImage, 'status'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }
      )> }
    ) | (
      Pick<AdminTypes.Model3d, 'id' | 'alt' | 'fileStatus' | 'createdAt'>
      & { fileErrors: Array<Pick<AdminTypes.FileError, 'code' | 'details' | 'message'>>, preview?: AdminTypes.Maybe<(
        Pick<AdminTypes.MediaPreviewImage, 'status'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }
      )> }
    ) | (
      Pick<AdminTypes.Video, 'id' | 'alt' | 'fileStatus' | 'createdAt'>
      & { fileErrors: Array<Pick<AdminTypes.FileError, 'code' | 'details' | 'message'>>, preview?: AdminTypes.Maybe<(
        Pick<AdminTypes.MediaPreviewImage, 'status'>
        & { image?: AdminTypes.Maybe<Pick<AdminTypes.Image, 'url'>> }
      )> }
    )>>, userErrors: Array<Pick<AdminTypes.FilesUserError, 'field' | 'message'>> }> };

interface GeneratedQueryTypes {
  "\n        #graphql\n        query GetShopifyShopData {\n            shop {\n                id\n                email\n                plan {\n                    shopifyPlus\n                }\n                billingAddress {\n                    address1\n                    address2\n                    city\n                    province\n                    country\n                    phone\n                }\n                shopOwnerName\n                myshopifyDomain\n                contactEmail\n                primaryDomain {\n                    url\n                }\n                currencyCode\n                currencyFormats {\n                    moneyFormat\n                    moneyInEmailsFormat\n                }\n                weightUnit\n            }\n        }\n    ": {return: GetShopifyShopDataQuery, variables: GetShopifyShopDataQueryVariables},
  "\n            #graphql\n            query GetVideoById($id: ID!) {\n                node(id: $id) {\n                    ... on Video {\n                        id\n                        alt\n                        createdAt\n                        fileStatus\n                        fileErrors {\n                            code\n                            details\n                            message\n                        }\n                        sources {\n                            format\n                            height\n                            mimeType\n                            url\n                            width\n                        }\n                        preview {\n                            image {\n                                url\n                            }\n                            status\n                        }\n                    }\n                }\n            }\n        ": {return: GetVideoByIdQuery, variables: GetVideoByIdQueryVariables},
}

interface GeneratedMutationTypes {
  "\n            #graphql\n            mutation DeleteFiles($ids: [ID!]!) {\n                fileDelete(fileIds: $ids) {\n                    deletedFileIds\n                    userErrors {\n                        field\n                        message\n                    }\n                }\n            }\n        ": {return: DeleteFilesMutation, variables: DeleteFilesMutationVariables},
  "\n            #graphql\n            mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {\n                stagedUploadsCreate(input: $input) {\n                    stagedTargets {\n                        resourceUrl\n                        url\n                        parameters {\n                            name\n                            value\n                        }\n                    }\n                    userErrors {\n                        field\n                        message\n                    }\n                }\n            }\n        ": {return: StagedUploadsCreateMutation, variables: StagedUploadsCreateMutationVariables},
  "\n            #graphql\n            mutation fileCreate($files: [FileCreateInput!]!) {\n                fileCreate(files: $files) {\n                    files {\n                        id\n                        alt\n                        fileStatus\n                        createdAt\n                        fileErrors {\n                            code\n                            details\n                            message\n                        }\n                        fileStatus\n                        preview {\n                            image {\n                                url\n                            }\n                            status\n                        }\n                    }\n                    userErrors {\n                        field\n                        message\n                    }\n                }\n            }\n        ": {return: FileCreateMutation, variables: FileCreateMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
