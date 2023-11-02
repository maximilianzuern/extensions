import { getPreferenceValues, Toast, showToast, LocalStorage } from "@raycast/api";
import { useFetch } from "@raycast/utils";

import axios from "axios";

import { ListsResponse, bringList } from "../types/lists";
import { PurchaseItem } from "../types/items";
import { GetUserSettingsResponse } from "../types/bringusersettings";

const { userMail, userPassword } = getPreferenceValues();

// ---------------------------------- get accound details ----------------------------------
let userUUID: string;
let personalAccessToken: string;
const headers: { "X-BRING-API-KEY": string; Authorization?: string } = {
  "X-BRING-API-KEY": "cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp",
};

export async function getUserAccess(): Promise<any> {
  const hasAccess = await LocalStorage.getItem<boolean>("hasAccess");
  if (hasAccess) {
    userUUID = (await LocalStorage.getItem<string>("userUUID"))!;
    personalAccessToken = (await LocalStorage.getItem<string>("personalAccessToken"))!;
    headers["Authorization"] = `Bearer ${personalAccessToken}`;
    return;
  }

  try {
    const response = await axios.post(
      `https://api.getbring.com/rest/v2/bringauth?email=${userMail}&password=${userPassword}`
    );
    userUUID = response?.data.uuid;
    personalAccessToken = response?.data.access_token;
    headers["Authorization"] = `Bearer ${personalAccessToken}`;
    await LocalStorage.setItem("hasAccess", true);
    await LocalStorage.setItem("userUUID", userUUID);
    await LocalStorage.setItem("personalAccessToken", personalAccessToken);
  } catch (error) {
    throw new Error(`Error while fetching settings: \n ${error}`);
  }
}

// ---------------------------------- get bringusersettings ----------------------------------
export async function getUserSettings(): Promise<GetUserSettingsResponse> {
  try {
    const response = await axios.get(`https://api.getbring.com/rest/v2/bringusersettings/${userUUID}`, { headers });
    return response?.data;
  } catch (error) {
    throw new Error(`Error while fetching settings: \n ${error}`);
  }
}

// ---------------------------------- get user's lists ----------------------------------
export async function getLists(): Promise<[bringList[], boolean]> {
  try {
    const response = await axios.get(`https://api.getbring.com/rest/v2/bringusers/${userUUID}/lists`, { headers });
    const lists = response?.data?.lists || [];
    return [lists, false];
  } catch (error: any) {
    if (error && error.status === 401 || error.status === 403) {
      await LocalStorage.clear();
      getUserAccess();
    } else {
      throw new Error(`Error while fetching lists: \n ${error}`);
    }
    return [[], false];
  }
}

// export function getLists(): [bringList[], boolean, any] {
//   const { isLoading, data, error, revalidate } = useFetch<ListsResponse>(
//     `https://api.getbring.com/rest/v2/bringusers/${userUUID}/lists`,
//     {
//       method: "GET",
//       headers: headers,
//       keepPreviousData: true,
//     }
//   );
//   const lists = data?.lists || [];

//   if (error) {
//     console.error(`Error while fetching list: \n ${error}`);
//   }
//   return [lists, isLoading, revalidate];
// }

// ---------------------------------- get items from a list ----------------------------------
export async function getItems(listUUID: string): Promise<[PurchaseItem[], boolean]> {
  try {
    const response = await axios.get(`https://api.getbring.com/rest/v2/bringlists/${listUUID}`, { headers });
    const items = response?.data?.purchase || [];
    return [items, false];
  } catch (error) {
    throw new Error(`Error while fetching items: \n ${error}`);
  }
}

// ---------------------------------- update item ----------------------------------
export async function updateItem(itemName: string, itemRecently: string, listUUID: string): Promise<boolean> {
  const entries = `&purchase=${itemName}&recently=${itemRecently}`;
  let success = false;

  await showToast(Toast.Style.Animated, `Updating "${itemName || itemRecently}"...`);
  try {
    const response = await axios.put(`https://api.getbring.com/rest/v2/bringlists/${listUUID}`, entries, { headers });
    if (response?.status === 204) {
      success = true;
      if (itemName) {
        showToast(Toast.Style.Success, `Added "${itemName}"!`);
      } else if (itemRecently) {
        showToast(Toast.Style.Success, `Deleted "${itemRecently}"!`);
      }
    }
  } catch (error) {
    showToast({
      style: Toast.Style.Failure,
      title: `Error while updating "${itemName || itemRecently}"`,
      message: String(error),
    });
  }
  return success;
}

// ---------------------------------- get local translations ----------------------------------
export async function getArticles(locale: string): Promise<{}> {
  try {
    const response = await axios.get(`https://web.getbring.com/locale/articles.${locale}.json`, { headers });
    // const lists = response?.data;
    // return lists;
    return response?.data;
  } catch (error) {
    throw new Error(`Error while fetching translation: \n ${error}`);
  }
}
