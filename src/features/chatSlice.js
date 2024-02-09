import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CONVERSATION_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/conversation`;
const MESSAGE_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/message`;

const initialState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  messages: [],
  notifications: [],
  files: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },

    removeClosedConversation: (state, action) => {
      const removedConversations = [...state.conversations].filter(
        (c) => c._id !== action.payload._id
      );
      state.conversations = removedConversations;
    },
    updateMessagesAndConversations: (state, action) => {
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
        // state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getClosedConversations.pending, (state, action) => {
        //state.status = "loading";
      })
      .addCase(getClosedConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(getClosedConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getUserConversations.pending, (state, action) => {
        // state.status = "loading";
      })
      .addCase(getUserConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(getUserConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(open_create_conversation.pending, (state, action) => {
        //state.status = "loading";
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
        //state.status = "loading";
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
        //state.status = "loading";
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
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const { token, closed } = values;

      const { data } = await axios.get(
        `${CONVERSATION_ENDPOINT}/?closed=${closed}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      const { token, receiver_id } = values;

      const { data } = await axios.get(
        `${CONVERSATION_ENDPOINT}/user/?receiver=${receiver_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    const { token, receiver_id, isGroup, waba_user_id, closed } = values;
    try {
      const { data } = await axios.post(
        CONVERSATION_ENDPOINT,
        { receiver_id, isGroup, waba_user_id, closed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    const { token, convo_id } = values;
    try {
      const { data } = await axios.get(`${MESSAGE_ENDPOINT}/${convo_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const getClosedConversationMessages = createAsyncThunk(
  "conervsation/closed_messages",
  async (values, { rejectWithValue }) => {
    const { token, convo_name } = values;
    try {
      const { data } = await axios.get(
        `${MESSAGE_ENDPOINT}/?convo_name=${convo_name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    const { token, message, convo_id, files, waba_user_phonenumber, type } =
      values;

    try {
      const { data } = await axios.post(
        MESSAGE_ENDPOINT,
        {
          message,
          convo_id,
          files,
          waba_user_phonenumber,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const createGroupConversation = createAsyncThunk(
  "conervsation/create_group",
  async (values, { rejectWithValue }) => {
    const { token, name, users } = values;
    try {
      const { data } = await axios.post(
        `${CONVERSATION_ENDPOINT}/group`,
        { name, users },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    const { convo_id, token } = values;

    try {
      const { data } = await axios.post(
        `${CONVERSATION_ENDPOINT}/close`,
        { convo_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

export const {
  setActiveConversation,
  updateMessagesAndConversations,
  updateStatues,
  addFiles,
  clearFiles,
  removeFileFromFiles,
  removeClosedConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
