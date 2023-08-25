import { ActionPanel, Detail, List, Action, Icon, Color } from "@raycast/api";
import { getLists, getItems, updateItem } from "./hooks/bringAPI";

import { useEffect, useMemo, useState } from "react";

export default function Command() {
  const [items, loadingItems] = getItems();
  const [lists, loadingList] = getLists();

  const [searchText, setSearchText] = useState("");

  const handleItem = (itemName: string, itemRecently: string) => {
    updateItem(itemName, itemRecently);
  };

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
                      handleItem("", items.name);
                    }}
                  />
                  {/* <Action.Push title="Show Details" target={<Detail markdown={`# ${items.name}: ${searchText}`} />} /> */}
                  {/* <Action title="Reload" onAction={() => Command()} /> */}
                </ActionPanel>
              }
            />
          ))}
      </List.Section>
      {searchText.length > 0 && (
        <List.Section title="Add Item">
          <List.Item
            key={searchText}
            title={searchText}
            icon={{ source: Icon.Plus, tintColor: Color.Green }}
            actions={
              <ActionPanel>
                <Action
                  title="Add Item"
                  icon={Icon.PlusCircle}
                  onAction={() => {
                    handleItem(searchText, "");
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
