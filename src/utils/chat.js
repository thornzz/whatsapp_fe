export const getConversationId = (user, users) => {
  return users[0]._id === user._id ? users[1]._id : users[0]._id;
};
export const getConversationName = (user, users) => {
  return users[0]._id === user._id ? users[1].name : users[0].name;
};
export const getConversationNamePhoneNumber = (user, users) => {
  const otherUser = users.find(u => u._id !== user._id);

  if (otherUser) {
    let phoneNumber = otherUser.phonenumber;
    // Eğer telefon numarası tanımlı ve "90" ile başlıyorsa, başındaki 9'u sil.
    if (phoneNumber && phoneNumber.startsWith("90")) {
      phoneNumber = phoneNumber.slice(1);
    }
    return `${otherUser.name} (${phoneNumber || ""})`;
  }
  // Eğer diğer kullanıcı bulunamazsa, varsayılan bir değer döndürebilirsiniz.
  return "";
};
export const getConversationPicture = (user, users) => {
  return users[0]._id === user._id ? users[1].picture : users[0].picture;
};

export const checkOnlineStatus = (onlineUsers, user, users) => {
  let convoId = getConversationId(user, users);
  console.log(convoId,'convoId');
  let check = onlineUsers.find((u) => u.userId === convoId);
  console.log(check,'check');
  return check ? true : false;
};
