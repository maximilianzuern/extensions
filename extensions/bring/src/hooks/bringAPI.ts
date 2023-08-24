import { getPreferenceValues } from "@raycast/api";

import { useEffect, useState } from "react";
import axios from "axios";

import { List } from "../types/lists";
import { PurchaseItem } from "../types/items";


const { personalAccessToken } = getPreferenceValues();
const { userUUID } = getPreferenceValues();

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
export function getItems(listuuid: string): [PurchaseItem[], boolean] {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLists() {
      try {
        const response = await axios.get(`https://api.getbring.com/rest/v2/bringlists/${listuuid}`, OPTIONS);
        setItems(response?.data?.lists || []);
        setLoadingItems(false);
      } catch (error) {
        console.error(error);
        setItems([]);
        setLoadingItems(false);
      }
    }

    fetchLists();
  }, [listuuid]);

  return [items, loadingItems];
}
