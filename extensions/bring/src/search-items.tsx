import { ActionPanel, List, Action, Icon, Color } from "@raycast/api";
import { getLists, getItems, updateItem } from "./hooks/bringAPI";

import { useEffect, useState, useMemo } from "react";

import { bringList } from "./types/lists";
import { PurchaseItem } from "./types/items";

// make first letter of string uppercase
function capitalizeFirstLetter(str: string): string {
  return str.replace(/^\w/, (c) => c.toUpperCase());
}

// main function
export default function Command() {
  const [lists, loadingList] = getLists();
  const [selectedList, setSelectedList] = useState<string>(lists.length > 0 ? lists[0].listUuid : "");
  console.log("selectedList", selectedList); //DEBUG

  const onListTypeChange = (selectedListUUID: string) => {
    if (selectedListUUID) {
    setSelectedList(selectedListUUID);
    }
  };

  const [searchText, setSearchText] = useState("");
  const [items, loadingItems] = getItems(selectedList);

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
                    style="destructive"
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
