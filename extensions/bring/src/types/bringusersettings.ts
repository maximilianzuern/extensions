export interface UserSettings {
    key: string;
    value: string;
}

export interface UserListSettings {
    listUuid: string;
    usersettings: UserSettings[];
}

export interface GetUserSettingsResponse {
    usersettings: UserSettings[];
    userlistsettings: UserListSettings[];
}
