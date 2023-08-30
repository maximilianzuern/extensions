import { ActionPanel, List, Action, Icon, Color, Toast, showToast, confirmAlert } from "@raycast/api";
import { getLists, getItems, updateItem } from "./hooks/bringAPI";

import { useEffect, useState, useMemo, useCallback } from "react";

import { bringList } from "./types/lists";
import { PurchaseItem } from "./types/items";

function capitalizeFirstLetter(str: string): string {
  return str.replace(/^\w/, (c) => c.toUpperCase());
}

// main function
export default function Command() {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedList, setSelectedList] = useState<string>("");

  const onListTypeChange = useCallback((selectedListUUID: string) => {
    if (selectedListUUID) {
      setSelectedList(selectedListUUID);
    }
  }, []);
  
  const [lists, setLists] = useState<bringList[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  useEffect(() => {
    async function fetchLists() {
      setLoadingList(true);
      const [fetchlists, fetchloadingList] = await getLists();
      setLists(fetchlists);
      setLoadingList(fetchloadingList);
      setSelectedList(lists.length > 0 ? lists[0].listUuid : "");
    }
    
    fetchLists();
  }, []);

  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);
  useEffect(() => {
    async function fetchItems(selectedList: string) {
      if (selectedList) {
        setLoadingItems(true);
        const [fetchitems, fetchloadingItems] = await getItems(selectedList);
        setItems(fetchitems);
        setLoadingItems(fetchloadingItems);
      }
    }
    fetchItems(selectedList);
  }, [selectedList]);

  return (
    <List
      isLoading={loadingItems || loadingList}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      filtering={true}
      searchBarPlaceholder="Search or create item"
      searchBarAccessory={
        <List.Dropdown tooltip="Select list" storeValue={true} onChange={onListTypeChange} isLoading={loadingItems}>
          {lists.map((list) => (
            <List.Dropdown.Item key={list.listUuid} title={list.name} value={list.listUuid} icon={Icon.Receipt} />
          ))}
        </List.Dropdown>
      }
    >
      <List.Section title="Shopping List">
        {items
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((items) => (
            <List.Item
              key={items.name}
              title={items.name}
              subtitle={items.specification}
              actions={
                <ActionPanel>
                  <Action
                    title="Delete Item"
                    icon={Icon.XMarkCircle}
                    style={Action.Style.Destructive}
                    onAction={() => {
                      updateItem("", items.name, selectedList);
                    }}
                  />
                </ActionPanel>
              }
            />
          ))}
      </List.Section>
      {searchText.length > 0 && (
        <List.Section title="Add Item">
          <List.Item
            key={searchText}
            title={capitalizeFirstLetter(searchText)}
            icon={{ source: Icon.Plus, tintColor: Color.Green }}
            actions={
              <ActionPanel>
                <Action
                  title="Add Item"
                  icon={Icon.PlusCircle}
                  onAction={() => {
                    updateItem(capitalizeFirstLetter(searchText), "", selectedList);
                  }}
                />
              </ActionPanel>
            }
          />
        </List.Section>
      )}
    </List>
  );
}
