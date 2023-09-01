export interface bringList {
    listUuid: string;
    name: string;
    theme: string;
    listArticleLanguage?: string;
}

export interface ListsResponse {
    lists: bringList[];
}