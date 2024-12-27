import { useState } from 'react';
import './ChatsList.css';
import ChatItem from '../ChatItem';
import ModalWnd from '../../components/ModalWnd/ModalWnd';
import PropTypes from 'prop-types';

const ChatsList = ({chats, changeCurrentChat, handleCreateChat, handleDelete}) => {
  const [modalState, setModalState] = useState(false);
  let newUser = null;             


  const chats_list = (!!chats || chats?.length > 0) ? (
    <ul className='chats_list'>
      {chats.map(chat => {
        return <ChatItem
          key={chat._id}
          chat={chat}
          handle_chat_click={() => changeCurrentChat(chat._id)}
          handleDelete={() => handleDelete(chat._id)}
        />
      })}
    </ul>
  ) : (
    <div className='no_chats'>No chats found.</div>
  );

  return (
    <div className='ChatsList'>
       <ModalWnd call={modalState} onDestroy={()=> setModalState(false)} user={newUser} onSubmit={handleCreateChat}/>
        <div className='header_chats'>
        <h2 className='title_chats'>Chats</h2>
        <button className='create_chat' onClick={() => setModalState(true)}>Create new chat</button>
        </div>
      <div className='chats'>{chats_list}</div>
    </div>
  );
}

export default ChatsList;

ChatsList.propTypes = {
  chats: PropTypes.array,
  changeCurrentChat: PropTypes.func.isRequired,
  handleCreateChat: PropTypes.func,
  handleDelete: PropTypes.func,
  user: PropTypes.string,
};
