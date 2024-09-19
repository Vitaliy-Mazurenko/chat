import './ChatsList.css';
import ChatItem from '../ChatItem';
import PropTypes from 'prop-types';

const ChatsList = ({chats, changeCurrentChat}) => {

  const chats_list = (!!chats || chats?.length > 0) ? (
    <ul className='chats_list'>
      {chats.map(chat => {
        return <ChatItem
          key={chat._id}
          chat={chat}
          handle_chat_click={() => changeCurrentChat(chat._id)}
        />
      })}
    </ul>
  ) : (
    <div className='no_chats'>No chats found.</div>
  );

  return (
    <div className='ChatsList'>
      <h2 className='title_chats'>Chats</h2>
      <div className='chats'>{chats_list}</div>
    </div>
  );
}

export default ChatsList;

ChatsList.propTypes = {
  chats: PropTypes.array,
  changeCurrentChat: PropTypes.func.isRequired,
};
