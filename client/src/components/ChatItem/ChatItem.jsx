import './ChatItem.css';
import { date_to_format } from '../../helpers/helper_functions.js';
import ProfileImage from '../ProfileImage';
import PropTypes from 'prop-types';

const ChatItem = ({chat, handle_chat_click}) => {

  const profile_name = `${chat.firstName} ${chat.lastName}`;
  const last_message = chat.messages[chat.messages.length - 1];
  const last_message_text = !last_message ? 'No messages' : last_message.text;
  const last_message_time = last_message ? (date_to_format(last_message.createdAt, 'date_shortened')) : null;

  return (
    <li className='ChatItem' onClick={handle_chat_click}>
      <ProfileImage profile_id={chat._id} />
      <h3 className='profile_name'>
      {profile_name}
    </h3>
      { last_message ? (<>
    <time className='last_message_time' dateTime={last_message.createdAt}>
      {last_message_time}
    </time>
    <div className='last_message_text'>
      {last_message_text}
    </div></>)
        : null }
    </li>
  );
}

export default ChatItem;

ChatItem.propTypes = {
  chat: PropTypes.object.isRequired,
  handle_chat_click: PropTypes.func.isRequired,
};
