import { useState } from "react";

import { Conversations } from "./conversations";
import { SidebarHeader } from "./header";
//import { Search } from "./notifications";
import { Search } from "./search";
import { SearchResults } from "./search";

export default function Sidebar({ onlineUsers, socket, opened, isSmScreen }) {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div className="sm:flex-col sm:w-1/3 select-none mb-0.4">
      {/*Sidebar Header*/}
      <SidebarHeader onlineUsers={onlineUsers} socket={socket} />
      {/*Notifications */}
      {/* <Notifications /> */}
      {/*Search*/}

      <Search
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
      />

      {searchResults.length > 0 ? (
        <>
          {/*Search results*/}
          <SearchResults
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </>
      ) : (
        <>
          {/*Conversations*/}
          <Conversations onlineUsers={onlineUsers} isSmScreen={isSmScreen} />
        </>
      )}
    </div>
  );
}
