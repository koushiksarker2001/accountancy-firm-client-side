import axios from "axios";
import { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";

// Example URL where the backend is hosted
const url = "http://localhost:8080"; // For instance, http://localhost:8080

// Action types for Redux
const GET_CHATS = "GET_CHATS";
const ADD_CHAT = "ADD_CHAT";
const CHAT_ERROR = "CHAT_ERROR";

// Create the context
export const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Function to retrieve chats from the backend
  const getChats = async () => {
    try {
      const res = await axios.get(`${url}/api/messages`);
      dispatch({
        type: GET_CHATS,
        payload: res?.data,
      });
    } catch (err) {
      dispatch({
        type: CHAT_ERROR,
        payload: err?.response?.msg,
      });
    }
  };

  // Function to add a new chat message
  const addChat = async (chat) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(`${url}/api/realm-messages`, chat, config);

      dispatch({
        type: ADD_CHAT,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CHAT_ERROR,
        payload: err?.response?.msg,
      });
    }
  };

  // Trigger getChats on component mount (assuming this context is used within a component)
  useEffect(() => {
    getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Provide the context value to consuming components
  return (
    <ChatContext.Provider value={{ getChats, addChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
