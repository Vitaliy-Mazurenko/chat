import React from 'react';
import './App.css';
import ProfileImage from './components/ProfileImage';
import SearchInChats from './components/SearchInChats';
import ChatsList from './components/ChatsList';
import CurrentChat from './components/CurrentChat';
import { useHttp } from "./hooks/useHttp";
import { fetchChats } from "./api/chatApi";

const App = () => {
  const [currentChatId, setCurrentChatId] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState(null);
  const [chats, setChats] = useHttp(fetchChats, null);

  const changeCurrentChat = chatId => {
    setCurrentChatId(chatId);
  };

  const hideCurrentChat = () => {
    setCurrentChatId(null);
  };

  const fetchData = React.useCallback(async () => {
    try {
      let response = await fetchChats();
      console.log(response);
      setChats(response);
    } catch (error) {
      console.error('No chats found.', error);
    }
  }, [setChats]);

  const getCurrentChat = () => {
    if (!chats || !chats.length) {  
      fetchData();
      console.warn('No chats found.');
      return null;
    }

    const currentChat = chats.find(chat => chat._id === currentChatId);

    return currentChat;
  };

  const sortByDateFunc = (chat_1, chat_2) => {
    if (!chat_1.messages.length) {
      console.log('One of the chats is missing messages.');
      return;
    }
    const date_1 = new Date(chat_1.messages[chat_1.messages.length - 1].createdAt);
    const date_2 = new Date(chat_2.messages[chat_2.messages.length - 1].createdAt);
    return date_1.getTime() < date_2.getTime();
  };


  const addMessage = (message_data, to_chat_id) => {
    const newChats = [...chats];
    const chatIndex = newChats.findIndex(chat => chat._id === to_chat_id);

    if (chatIndex === -1) {
      return;
    }

    newChats[chatIndex].messages.push(message_data);
    newChats.sort(sortByDateFunc);
    setChats(newChats);
  };

  const changeSearchQuery = searchQuery => {
    setSearchQuery(searchQuery);
  };

  const getFilteredChats = chats => {
    const searchedChats = searchQuery ? (
      chats.filter(chat => (`${chat.firstName} ${chat.lastName}`).toLowerCase().includes(searchQuery.toLowerCase()))
    ) : chats;
    return searchedChats;
  };


  React.useEffect(() => {
		if (!chats || !chats.length) {
      fetchData();
    } 
      setChats(chats);    
		},
		[chats, setChats, fetchData],
	);

  return (
    <div className={`App ${currentChatId === null ? '' : 'showing_chat'}`}>

      <div className='left'>
        <div className='top'>
        <div className='profile_info'>
        <ProfileImage profile_id={'0'} />
        </div>
          <SearchInChats changeSearchQuery={changeSearchQuery} />
        </div>
        <ChatsList
          chats={getFilteredChats(chats)}
          changeCurrentChat={changeCurrentChat}
        />
      </div>

      <div className='right'>
        <CurrentChat
          chat={getCurrentChat()}
          addMessage={addMessage}
          hideCurrentChat={hideCurrentChat}
        />
      </div>

    </div>
  );
};

export default App;
