import React from 'react';
import './App.css';
import ProfileImage from './components/ProfileImage';
import SearchInChats from './components/SearchInChats';
import ChatsList from './components/ChatsList';
import CurrentChat from './components/CurrentChat';

const App = () => {
  const [currentChatId, setCurrentChatId] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState(null);
  const [chats, setChats] = React.useState([
    {
      chat_id: 0,
      companion: { profile_id: 1, profile_name: 'Alice Freeman' },
      messages: [
        {
          message_owner: 1,
          message_text: 'You are the worst!',
          message_date: new Date('2024-06-12')
        }
      ]
    },
    {
      chat_id: 1,
      companion: { profile_id: 2, profile_name: 'Josefina Wilson' },
      messages: [
        {
          message_owner: 2,
          message_text: 'Quickly come to the meeting room 1B, we have a big server issue',
          message_date: new Date('2024-04-21T04:08:00')
        },
        {
          message_owner: 0,
          message_text: 'I\'m having breakfast right now, can\'t you wait for 10 minutes?',
          message_date: new Date('2024-04-22T04:05:00')
        },
        {
          message_owner: 2,
          message_text: 'We are losing money! Quick!',
          message_date: new Date('2024-04-22T04:10:00')
        }
      ]
    },
    {
      chat_id: 2,
      companion: { profile_id: 3, profile_name: 'Velazquez Jones' },
      messages: [
        {
          message_owner: 3,
          message_text: 'Quickly come to the meeting room 1B, we have a big server issue.',
          message_date: new Date('2024-03-18')
        }
      ]
    },
    {
      chat_id: 3,
      companion: { profile_id: 4, profile_name: 'Piter Fisher' },
      messages: [
        {
          message_owner: 4,
          message_text: 'Are there any bananas left in the dining room?',
          message_date: new Date('2024-02-18')
        }
      ]
    },
  ]);

  const changeCurrentChat = chatId => {
    setCurrentChatId(chatId);
  };

  const hideCurrentChat = () => {
    setCurrentChatId(null);
  };

  const getCurrentChat = () => {
    return chats.find(chat => chat.chat_id === currentChatId);
  };

  const sortByDateFunc = (chat_1, chat_2) => {
    const date_1 = new Date(chat_1.messages[chat_1.messages.length - 1].message_date);
    const date_2 = new Date(chat_2.messages[chat_2.messages.length - 1].message_date);
    return date_1.getTime() < date_2.getTime();
  };

  console.log(chats);

  const addMessage = (message_data, to_chat_id) => {
    const newChats = [...chats];
    const chatIndex = newChats.findIndex(chat => chat.chat_id === to_chat_id);

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
      chats.filter(chat => chat.companion.profile_name.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : chats;
    return searchedChats;
  };

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
