export interface bringList {
    listUuid: string;
    name: string;
    theme: string;
}

export interface ListsResponse {
    lists: bringList[];
}