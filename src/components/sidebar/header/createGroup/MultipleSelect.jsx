import Select from "react-select";

export default function MultipleSelect({
  selectedUsers,
  setSelectedUsers,
  searchResults,
  handleSearch,
}) {
  return (
    <div className="mt-4">
      <Select
        options={searchResults}
        onChange={setSelectedUsers}
        onKeyDown={(e) => handleSearch(e)}
        placeholder="Kullanıcıları seçin..."
        isMulti
        loadingMessage={()=>"Yükleniyor"}
        noOptionsMessage={()=>"Başka kullanıcı bulunamadı..."}
        formatOptionLabel={(user) => (
          <div className="flex items-center gap-1">
            <img
              src={user.picture}
              alt=""
              className="w-8 h-8 object-cover rounded-full"
            />
            <span className="text-[#1a1818]">{user.label}</span>
          </div>
        )}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            border: "none",
            borderColor: "transparent",
            background: "transparent",

          }),
          input: base => ({
            ...base,
            color: "#fff"
          })
        }}
      />
    </div>
  );
}
