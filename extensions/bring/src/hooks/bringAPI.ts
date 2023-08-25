import { getPreferenceValues, Toast, showToast } from "@raycast/api";

import { useEffect, useState } from "react";
import axios from "axios";

import { List } from "../types/lists";
import { PurchaseItem } from "../types/items";

const { personalAccessToken } = getPreferenceValues();
const { userUUID } = getPreferenceValues();
const { listUUID } = getPreferenceValues();

// define header whereby "X-BRING-API-KEY" is the key to reach web.getbring.com
const OPTIONS = {
  headers: {
    "X-BRING-API-KEY": "cof4Nc6D8saplXjE3h3HXqHH8m7VU2i1Gs0g85Sp",
    Authorization: `Bearer ${personalAccessToken}`,
  },
};

// get user's lists
export function getLists(): [List[], boolean] {
  const [lists, setLists] = useState<List[]>([]);
  const [loadingLists, setLoadingLists] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLists() {
      try {
        const response = await axios.get(`https://api.getbring.com/rest/v2/bringusers/${userUUID}/lists`, OPTIONS);
        setLists(response?.data?.lists || []);
        setLoadingLists(false);
      } catch (error) {
        console.error(error);
        setLists([]);
        setLoadingLists(false);
      }
    }

    fetchLists();
  }, []);

  return [lists, loadingLists];
}

// get items from a list
// export function getItems(listUUID: string): [PurchaseItem[], boolean] {
//   const [items, setItems] = useState<PurchaseItem[]>([]);
//   const [loadingItems, setLoadingItems] = useState<boolean>(true);

//   useEffect(() => {
//     async function fetchItems() {
//       try {
//         const response = await axios.get(`https://api.getbring.com/rest/v2/bringlists/${listUUID}`, OPTIONS);
//         setItems(response?.data?.purchase || []);
//         setLoadingItems(false);
//       } catch (error) {
//         console.error(error);
//         setItems([]);
//         setLoadingItems(false);
//       }
//     }

//     fetchItems();
//   }, [listUUID]);

//   return [items, loadingItems];
// }
export function getItems(): [PurchaseItem[], boolean] {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get(`https://api.getbring.com/rest/v2/bringlists/${listUUID}`, OPTIONS);
        setItems(response?.data?.purchase || []);
        setLoadingItems(false);
      } catch (error) {
        console.error(error);
        setItems([]);
        setLoadingItems(false);
      }
    }

    fetchItems();
  }, []);

  return [items, loadingItems];
}

// update item
export async function updateItem(itemName: string, itemRecently: string): Promise<void> {
  const entries = `&purchase=${itemName}&recently=${itemRecently}`;

  await showToast(Toast.Style.Animated, `Updating ${itemName || itemRecently}...`);
  try {
    const response = await axios.put(`https://api.getbring.com/rest/v2/bringlists/${listUUID}`, entries, OPTIONS);
    showToast(Toast.Style.Success, `Updated ${itemName || itemRecently} successfully!`);
  } catch (error) {
    showToast({
      style: Toast.Style.Failure,
      title: `Error while updating ${itemName || itemRecently}`,
      message: String(error),
    });
  }
}
