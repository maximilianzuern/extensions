import { getPreferenceValues, Toast, showToast } from "@raycast/api";

import { useEffect, useState } from "react";
import axios from "axios";

import { List } from "../types/lists";
import { PurchaseItem } from "../types/items";


const { personalAccessToken } = getPreferenceValues();
const { userUUID } = getPreferenceValues();
const { listUUID } = getPreferenceValues();

// define header
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
// export function getItems(listuuid: string): [PurchaseItem[], boolean] {
//   const [items, setItems] = useState<PurchaseItem[]>([]);
//   const [loadingItems, setLoadingItems] = useState<boolean>(true);
  

//   useEffect(() => {
//     async function fetchItems() {
//       try {
//         const response = await axios.get(`https://api.getbring.com/rest/v2/bringlists/${listuuid}`, OPTIONS);
//         setItems(response?.data?.lists || []);
//         setLoadingItems(false);
//       } catch (error) {
//         console.error(error);
//         setItems([]);
//         setLoadingItems(false);
//       }
//     }

//     fetchItems();
//   }, [listuuid]);

//   return [items, loadingItems];
// }

export function getItems(): [PurchaseItem[], boolean] {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);
  

  useEffect(() => {
    async function fetchItems() {
      await showToast(Toast.Style.Animated, "Loading items...");
      try {
        const response = await axios.get(`https://api.getbring.com/rest/v2/bringlists/${listUUID}`, OPTIONS);
        setItems(response?.data?.purchase || []);
        setLoadingItems(false);
        showToast(Toast.Style.Success, `Loading successfully!`);
      } catch (error) {
        console.error(error);
        setItems([]);
        setLoadingItems(false);
        showToast({ style: Toast.Style.Failure, title: "Error while loading items", message: String(error) });
      }
    }

    fetchItems();
  }, []);

  return [items, loadingItems];
}
