import { ActionPanel, List, Action, Icon, Color } from "@raycast/api";
import { getLists, getItems, updateItem } from "./hooks/bringAPI";

import { useMemo, useState } from "react";

// make first letter of string uppercase
function capitalizeFirstLetter(str: string): string {
  return str.replace(/^\w/, (c) => c.toUpperCase());
}

export default function Command() {
  const [items, loadingItems] = getItems();
  const [lists, loadingList] = getLists();

  const [searchText, setSearchText] = useState("");

  return (
    <List
      isLoading={loadingItems || loadingList}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      filtering={true}
      searchBarPlaceholder="Search or create item"
      searchBarAccessory={
        <List.Dropdown tooltip="Select list" storeValue={true}>
          {lists.map((list) => (
            <List.Dropdown.Item key={list.listUuid} title={list.name} value={list.listUuid} icon={Icon.List} />
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
                      updateItem("", items.name);
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
                    updateItem(capitalizeFirstLetter(searchText), "");
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
