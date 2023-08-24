import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { getLists, getItems } from "./hooks/bringAPI";

import { useEffect, useMemo, useState } from "react";

// type DropdownList = "OPEN" | "DONE";

// type ListDropdownProps = {
//   lists: any[];
//   onListChange: (newValue: DropdownList) => void;
// };

// const ListDropdown = (props: ListDropdownProps) => {
//   const { lists, onListChange } = props;

//   return (
//     <List.Dropdown
//       tooltip="Select List"
//       storeValue={true}
//       onChange={(value) => onListChange(value as DropdownList)}
//     >
//       {lists.map((list) => (
//         <List.Dropdown.Item key={list.listUuid} title={list.name} value={list.listUuid} />
//       ))}
//     </List.Dropdown>
//   );
// };

// export default function Command() {
//   const [lists, loadingList] = getLists();
//   const [selectedListUuid, setSelectedListUuid] = useState<DropdownList | undefined>();
//   const [items, loadingItems] = useState([]);

//   useEffect(() => {
//     if (lists.length > 0) {
//       setSelectedListUuid(lists[0].listUuid);
//     }
//   }, [lists]);

//   useEffect(() => {
//     if (selectedListUuid) {
//       const [items, loadingItems] = getItems(selectedListUuid);
//       setItems(items);
//       setLoadingItems(loadingItems);
//     }
//   }, [selectedListUuid]);

//   return (
//     <List
//       isLoading={loadingList}
//       navigationTitle="Search Items"
//       searchBarPlaceholder="Seach items"
//       searchBarAccessory={
//         <ListDropdown lists={lists} onListChange={(listUuid) => setSelectedListUuid(listUuid)} />
//       }
//     >
//       {lists.map((item) => (
//         <List.Item
//           key={item.name}
//           title={item.name}
//           actions={
//             <ActionPanel>
//               <Action.Push title="Show Details" target={<Detail markdown={`# ${item.name}`} />} />
//               {/* <Action title="Reload" onAction={() => getLists()} /> */}
//             </ActionPanel>
//           }
//         />
//       ))}
//     </List>
//   );
// }

export default function Command() {
  const [lists, loadingList] = getLists();
  return (
    <List isLoading={loadingList} navigationTitle="Search items">
      {lists.map((list) => (
        <List.Item
          key={list.listUuid}
          title={list.name}
          actions={
            <ActionPanel>
              <Action.Push title="Show Details" target={<Detail markdown={`# ${list.name}`} />} />
              {/* <Action title="Reload" onAction={() => getLists()} /> */}
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}