import { getPreferenceValues, Toast, showToast } from "@raycast/api";

import { useEffect, useState } from "react";
import axios from "axios";

import { bringList } from "../types/lists";
import { PurchaseItem } from "../types/items";
import { GetUserSettingsResponse } from "../types/bringusersettings";
import { type } from "os";

const { personalAccessToken } = getPreferenceValues();
if (!personalAccessToken) {
  throw new Error("Personal access token is missing");
}

const { userUUID } = getPreferenceValues();
if (!userUUID) {
  throw new Error("User's UUID is missing");
}

// define header whereby "X-BRING-API-KEY" is the key to reach web.getbring.com
const OPTIONS = {
  headers: {
    "X-BRING-API-KEY": "cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp",
    Authorization: `Bearer ${personalAccessToken}`,
  },
};

// ---------------------------------- get bringusersettings ----------------------------------
export async function getUserSettings(): Promise<GetUserSettingsResponse> {
  try {
    const response = await axios.get(`https://api.getbring.com/rest/v2/bringusersettings/${userUUID}`, OPTIONS);
    return response?.data;
  } catch (error) {
    throw new Error(`Error while fetching settings: \n ${error}`);
  }
}

// export async function memoizedGetUserSettings(): Promise<GetUserSettingsResponse[]> {
//   try {
//     const response = await axios.get(`https://api.getbring.com/rest/v2/bringusersettings/${userUUID}`, OPTIONS);
//     // const settings = response.data.listUuid;
//     // const settings = response?.data?.userlistsettings.map((list: any) => {
//     //   return {
//     //     listUuid: list.listUuid,
//     //     usersettings: list.usersettings.map((setting: any) => {
//     //       return {
//     //         key: setting.key,
//     //         value: setting.value,
//     //       };
//     //     }),
//     //     };
//     // }) || [];
//     return response?.data;
//   } catch (error) {
//     throw new Error(`Error while fetching settings: \n ${error}`);
//   }
// }

// export const memoizedGetUserSettings = (() => {
//   let cache: BringUserSettings[] | null = null;

//   return async (): Promise<BringUserSettings[]> => {
//     if (cache) {
//       return cache;
//     }

//     try {
//       const response = await axios.get(`https://api.getbring.com/rest/v2/bringusersettings/${userUUID}`, OPTIONS);
//       const settings = response?.data?.userlistsettings || [];
//       cache = settings;
//       return settings;
//     } catch (error) {
//       throw new Error(`Error while fetching settings: \n ${error}`);
//     }
//   };
// })();

// ---------------------------------- get user's lists ----------------------------------
export async function getLists(): Promise<[bringList[], boolean]> {
  try {
    const response = await axios.get(`https://api.getbring.com/rest/v2/bringusers/${userUUID}/lists`, OPTIONS);
    const lists = response?.data?.lists || [];
    return [lists, false];
  } catch (error) {
    throw new Error(`Error while fetching lists: \n ${error}`);
  }
}

// export function getLists(): [bringList[], boolean] {
//   const [lists, setLists] = useState<bringList[]>([]);
//   const [loadingLists, setLoadingLists] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchLists() {
//       try {
//         const response = await axios.get(`https://api.getbring.com/rest/v2/bringusers/${userUUID}/lists`, OPTIONS);
//         setLists(response?.data?.lists || []);
//         setLoadingLists(false);
//       } catch (error) {
//         console.error(error);
//         setLists([]);
//         setLoadingLists(false);
//       }
//     }

//     fetchLists();
//   }, []);
//   return [lists, loadingLists];
// }

// ---------------------------------- get items from a list ----------------------------------
export async function getItems(listUUID: string): Promise<[PurchaseItem[], boolean]> {
  try {
    const response = await axios.get(`https://api.getbring.com/rest/v2/bringlists/${listUUID}`, OPTIONS);
    const items = response?.data?.purchase || [];
    return [items, false];
  } catch (error) {
    throw new Error(`Error while fetching items: \n ${error}`);
  }
}

// export function getItems(listUUID: string): [PurchaseItem[], boolean] {
//   const [items, setItems] = useState<PurchaseItem[]>([]);
//   const [loadingItems, setLoadingItems] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchItems() {
//       await showToast(Toast.Style.Animated, "Fetching items...");
//       try {
//         const response = await axios.get(`https://api.getbring.com/rest/v2/bringlists/${listUUID}`, OPTIONS);
//         setItems(response?.data?.purchase || []);
//         setLoadingItems(false);
//         showToast(Toast.Style.Success, "Fetched items successfully!");
//       } catch (error) {
//         console.error(error);
//         setItems([]);
//         setLoadingItems(false);
//         showToast({ style: Toast.Style.Failure, title: "Error while fetching items", message: String(error) });
//       }
//     }

//     fetchItems();
//   }, [listUUID]);

//   return [items, loadingItems];
// }

// ---------------------------------- update item ----------------------------------
export async function updateItem(itemName: string, itemRecently: string, listUUID: string): Promise<void> {
  const entries = `&purchase=${itemName}&recently=${itemRecently}`;

  await showToast(Toast.Style.Animated, `Updating "${itemName || itemRecently}"...`);
  try {
    const response = await axios.put(`https://api.getbring.com/rest/v2/bringlists/${listUUID}`, entries, OPTIONS);
    showToast(Toast.Style.Success, `Updated "${itemName || itemRecently}" successfully!`);
  } catch (error) {
    showToast({
      style: Toast.Style.Failure,
      title: `Error while updating "${itemName || itemRecently}"`,
      message: String(error),
    });
  }
}

// ---------------------------------- get local translations ----------------------------------
export async function getArticles(locale: string): Promise<{}> {
  try {
    const response = await axios.get(`https://web.getbring.com/locale/articles.${locale}.json`, OPTIONS);
    // const lists = response?.data;
    // return lists;
    return response?.data;
  } catch (error) {
    throw new Error(`Error while fetching translation: \n ${error}`);
  }
}
