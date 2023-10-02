import { ActionPanel, List, Action, Icon, Color, Toast, showToast, confirmAlert, Cache, Image } from "@raycast/api";
import { getLists, getItems, updateItem, getUserSettings, getArticles } from "./hooks/bringAPI";

import { useEffect, useState, useMemo, useCallback } from "react";

import { bringList } from "./types/lists";
import { PurchaseItem } from "./types/items";
import { GetUserSettingsResponse, UserListSettings, UserSettings } from "./types/bringusersettings";

function capitalizeFirstLetter(str: string): string {
  return str.replace(/^\w/, (c) => c.toUpperCase());
}

// ADD LANGUAGE OF EACH LIST TO LIST OBJECT
async function addListArticleLanguageToLists(lists: bringList[]) {
  const response = await getUserSettings();

  for (const list of lists) {
    const userlistsetting = response.userlistsettings.find((setting) => setting.listUuid === list.listUuid);
    if (userlistsetting) {
      const listArticleLanguage = userlistsetting.usersettings.find((setting) => setting.key === "listArticleLanguage");
      if (listArticleLanguage) {
        list.listArticleLanguage = listArticleLanguage.value;
      }
    }
  }
}

// FETCH TRANSLATION and store by using useMemo
async function getTranslation(list: bringList[]) {
  const translations: Record<string, any> = {};

  for (const entry of list) {
    const language = entry.listArticleLanguage;
    if (language) {
      const articlesData = await getArticles(language);
      translations[entry.listUuid] = articlesData;
    }
  }
  return translations;
}

export default function Command() {
  const [searchText, setSearchText] = useState<string>("");
  const [selectedList, setSelectedList] = useState<string>("");

  function onListTypeChange(selectedListUUID: string) {
    setSelectedList(selectedListUUID);
  }

  // Translate item before updating
  function updateItemBeforeTranslation(purchase: string, recently: string, listUuid: string) {
    let translatedPurchase = purchase ?? "";
    let translatedRecently = recently ?? "";
    if (memoizedTranslation.hasOwnProperty(listUuid)) {
      const translation = memoizedTranslation[listUuid];
      if (recently.length > 0 && Object.values(translation).includes(recently)) {
        translatedRecently = Object.keys(translation).find((key) => translation[key] === recently) ?? "";
      }
      if (purchase.length > 0 && Object.values(translation).includes(purchase)) {
        translatedPurchase = Object.keys(translation).find((key) => translation[key] === purchase) ?? "";
      }
    }
    updateItem(translatedPurchase, translatedRecently, listUuid);
  }

  // FETCH LISTS
  const [lists, setLists] = useState<bringList[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [translation, setTranslation] = useState<Record<string, any>>({}); // STORE TRANSLATION IN STATE
  useEffect(() => {
    async function fetchLists() {
      setLoadingList(true);
      const [fetchlists, fetchloadingList] = await getLists();
      setLists(fetchlists);
      setSelectedList(lists.length > 0 ? lists[0].listUuid : "");

      await addListArticleLanguageToLists(fetchlists); // LOOKUP UUIDS IN USER SETTINGS AND ADD LANGUAGE TO LIST OBJECT
      const translationData = await getTranslation(fetchlists); // FETCH TRANSLATION AND STORE IN STATE
      setTranslation(translationData);

      setLoadingList(fetchloadingList);
    }

    fetchLists();
  }, []);

  const memoizedTranslation = useMemo(() => translation, [translation]); // STORE TRANSLATION IN MEMOIZED STATE

  // FETCH ITEMS
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);
  useEffect(() => {
    async function fetchItems(selectedList: string) {
      if (selectedList) {
        setLoadingItems(true);
        const [fetchitems, fetchloadingItems] = await getItems(selectedList);
        const translatedItems = fetchitems.map((item) => {
          if (
            memoizedTranslation.hasOwnProperty(selectedList) &&
            memoizedTranslation[selectedList].hasOwnProperty(item.name)
          ) {
            return { ...item, name: memoizedTranslation[selectedList][item.name] };
          } else {
            return item;
          }
        });
        setItems(translatedItems);
        setLoadingItems(fetchloadingItems);
      }
    }
    fetchItems(selectedList);
  }, [selectedList, memoizedTranslation]);

  function getIconSource(itemName: string): string {
    if (memoizedTranslation && memoizedTranslation[selectedList]) {
      const keys = Object.keys(memoizedTranslation[selectedList]);
      const key = keys.find((key) => memoizedTranslation[selectedList][key] === itemName);
      if (key) {
        return `../assets/img/${key}.png`;
      }
    }
    return `../assets/AZ/${itemName.slice(0,1)}.png`;
  }

  return (
    <List
      isLoading={loadingItems || loadingList}
      searchBarPlaceholder="Search or create item"
      filtering={true}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarAccessory={
        <List.Dropdown tooltip="Select list" storeValue={true} onChange={onListTypeChange} isLoading={loadingList}>
          {lists.map((list) => (
            <List.Dropdown.Item icon={Icon.Receipt} key={list.listUuid} value={list.listUuid} title={list.name} />
          ))}
        </List.Dropdown>
      }
    >
      {items.length === 0 ? (
        <List.EmptyView
          title="Enter first articles!"
          description="You don't have any articles in your shopping list yet."
          icon={{ source: "../assets/bring_empty.png", mask: Image.Mask.RoundedRectangle }}
        />
      ) : (
        <List.Section title="Shopping List">
          {items
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => (
              <List.Item
                key={item.name}
                title={item.name}
                subtitle={item.specification}
                icon = {{
                  source: getIconSource(item.name),
                  mask: Image.Mask.RoundedRectangle,
                }}
                actions={
                  <ActionPanel>
                    <Action
                      title="Delete Item"
                      icon={Icon.XMarkCircle}
                      style={Action.Style.Destructive}
                      onAction={() => {
                        updateItemBeforeTranslation("", item.name, selectedList);
                      }}
                    />
                  </ActionPanel>
                }
              />
            ))}
        </List.Section>
      )}
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
                    updateItemBeforeTranslation(capitalizeFirstLetter(searchText), "", selectedList);
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
