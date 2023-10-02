import { getPreferenceValues, Toast, showToast } from "@raycast/api";
import { useFetch } from "@raycast/utils";

import axios from "axios";

import { ListsResponse, bringList } from "../types/lists";
import { PurchaseItem } from "../types/items";
import { GetUserSettingsResponse } from "../types/bringusersettings";

// ---------------------------------- check if personal access token is set --------------
const { personalAccessToken } = getPreferenceValues();
if (!personalAccessToken) {
  throw new Error("Personal access token is missing");
}

const { userUUID } = getPreferenceValues();
if (!userUUID) {
  throw new Error("User's UUID is missing");
}

// ---------------------------------- define header ----------------------------------
// "X-BRING-API-KEY" is necessary to reach web.getbring.com
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

// export function getLists(): Promise<[bringList[], boolean, any]> {
//   const { isLoading, data, error, revalidate } = useFetch<ListsResponse>(
//     `https://api.getbring.com/rest/v2/bringusers/${userUUID}/lists`,
//     {
//       method: "GET",
//       ...OPTIONS,
//       keepPreviousData: true,
//     }
//   );
//   const lists = data?.lists || [];

//   // if (error) {
//   //   console.error(`Error while fetching list: \n ${error}`);
//   // }

//   return [lists, isLoading, revalidate];
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
