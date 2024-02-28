import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate } from "../utils/axiosprivate";

const CONVERSATION_ENDPOINT = `/conversation`;
const MESSAGE_ENDPOINT = `/message`;

const initialState = {
  status: "",
  error: "",
  activeConvoWindow: "open",
  conversations: [],
  activeConversation: {},
  messages: [],
  focusedMessage: {},
  notifications: [],
  files: [],

  //unreadConvosCount: 0,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    increaseUnreadConvosCount: (state) => {
      state.unreadConvosCount += 1;
    },
    decreaseUnreadConvosCount: (state) => {
      state.unreadConvosCount -= 1;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    setFocusedMessage: (state, action) => {
      state.focusedMessage = action.payload;
    },
    removeClosedConversation: (state, action) => {
      const removedConversations = [...state.conversations].filter(
        (c) => c._id !== action.payload._id
      );
      state.conversations = removedConversations;
    },
    updateMessagesAndConversations: (state, action) => {
      // Play notification sound if the conversation is not active
      if (
        Object.keys(state.activeConversation).length === 0 ||
        (Object.keys(state.activeConversation).length > 0 &&
          state.activeConversation.closed)
      ) {
        let audio = new Audio(require("../sounds/notify.mp3"));
        audio.play();
      }

      //closed message penceresi açık ise yeni mesajları gösterme
      if (state.activeConvoWindow === "closed") return;

      // Update messages
      let convo = state.activeConversation;

      if (convo._id === action.payload.conversation._id) {
        // Check if the message with the same ID already exists
        const existingMessage = state.messages.find(
          (msg) => msg._id === action.payload._id
        );

        if (!existingMessage) {
          state.messages = [...state.messages, action.payload];
        }
      }

      // Update conversations
      let conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };
      let newConvos = [...state.conversations].filter(
        (c) => c._id !== conversation._id
      );
      newConvos.unshift(conversation);
      state.conversations = newConvos;
    },

    updateStatues: (state, action) => {
      // Update statues of messages
      const { _id, status, conversation } = action.payload;

      // Check if the active conversation matches the updated message's conversation
      if (state.activeConversation?._id === conversation._id) {
        // Find the index of the message to update based on its _id
        const messageIndex = state.messages.findIndex(
          (message) => message._id === _id
        );

        // If the message is found, update its status
        if (messageIndex !== -1) {
          const updatedMessages = [...state.messages];
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            status: status,
          };

          // Update the state with the modified messages array
          state.messages = updatedMessages;
        }
      }
    },
    addFiles: (state, action) => {
      state.files = [...state.files, action.payload];
    },
    clearFiles: (state, action) => {
      state.files = [];
    },
    removeFileFromFiles: (state, action) => {
      let index = action.payload;
      let files = [...state.files];
      let fileToRemove = [files[index]];
      state.files = files.filter((file) => !fileToRemove.includes(file));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConversations.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
        state.activeConvoWindow = "open";
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getClosedConversations.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getClosedConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
        state.activeConvoWindow = "closed";
      })
      .addCase(getClosedConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getUserConversations.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getUserConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
        state.activeConvoWindow = "open";
      })
      .addCase(getUserConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(open_create_conversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(open_create_conversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeConversation = action.payload;
        state.files = [];
      })
      .addCase(open_create_conversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(closeConversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(closeConversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeConversation = {};
      })
      .addCase(closeConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getConversationMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getClosedConversationMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getClosedConversationMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getClosedConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = [...state.messages, action.payload];
        let conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload,
        };
        let newConvos = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        );
        newConvos.unshift(conversation);
        state.conversations = newConvos;
        state.files = [];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

//functions
export const getConversations = createAsyncThunk(
  "conervsation/all",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.get("/conversation");

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const getClosedConversations = createAsyncThunk(
  "conervsation/closed",
  async (values, { rejectWithValue }) => {
    try {
      const { closed } = values;

      const { data } = await axiosPrivate.get(
        `${CONVERSATION_ENDPOINT}/?closed=${closed}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const getUserConversations = createAsyncThunk(
  "conervsation/user",
  async (values, { rejectWithValue }) => {
    try {
      const { receiver_id } = values;

      const { data } = await axiosPrivate.get(
        `${CONVERSATION_ENDPOINT}/user/?receiver=${receiver_id}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const open_create_conversation = createAsyncThunk(
  "conervsation/open_create",
  async (values, { rejectWithValue }) => {
    const { receiver_id, isGroup, waba_user_id, closed } = values;
    try {
      const { data } = await axiosPrivate.post(CONVERSATION_ENDPOINT, {
        receiver_id,
        isGroup,
        waba_user_id,
        closed,
      });
      console.log(data, "open_create_conversation");
      console.log(values, "open_create_conversation gönderilen data");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const getConversationMessages = createAsyncThunk(
  "conervsation/messages",
  async (values, { rejectWithValue }) => {
    const { convo_id } = values;
    try {
      const { data } = await axiosPrivate.get(
        `${MESSAGE_ENDPOINT}/${convo_id}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const getClosedConversationMessages = createAsyncThunk(
  "conervsation/closed_messages",
  async (values, { rejectWithValue }) => {
    const { convo_name } = values;
    try {
      const { data } = await axiosPrivate.get(
        `${MESSAGE_ENDPOINT}/?convo_name=${convo_name}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const sendMessage = createAsyncThunk(
  "message/send",
  async (values, { rejectWithValue }) => {
    console.log("send msg tetiklendi", values);
    const { message, convo_id, files, waba_user_phonenumber, type } = values;

    try {
      const { data } = await axiosPrivate.post(MESSAGE_ENDPOINT, {
        message,
        convo_id,
        files,
        waba_user_phonenumber,
        type,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const createGroupConversation = createAsyncThunk(
  "conervsation/create_group",
  async (values, { rejectWithValue }) => {
    const { name, users } = values;
    try {
      const { data } = await axiosPrivate.post(
        `${CONVERSATION_ENDPOINT}/group`,
        { name, users }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const closeConversation = createAsyncThunk(
  "conervsation/close",
  async (values, { rejectWithValue }) => {
    const { convo_id, to } = values;

    try {
      const { data } = await axiosPrivate.post(
        `${CONVERSATION_ENDPOINT}/close`,
        { convo_id, to }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const {
  setActiveConversation,
  setFocusedMessage,
  updateMessagesAndConversations,
  updateStatues,
  addFiles,
  clearFiles,
  removeFileFromFiles,
  removeClosedConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
