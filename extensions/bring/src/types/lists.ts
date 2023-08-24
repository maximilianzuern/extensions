export interface List {
    listUuid: string;
    name: string;
    theme: string;
}

export interface ListsResponse {
    lists: List[];
}