import './CurrentChat.css';
import ProfileImage from '../ProfileImage';
import Send from '../../img/icons/send.svg';
import ArrowLeft from '../../img/icons/arrow_left.svg';
import MessageItem from '../MessageItem/MessageItem';
import PropTypes from 'prop-types';

const CurrentChat = ({chat, addMessage, hideCurrentChat}) => {

  const companion = chat ? chat.companion : null;
  const messages = chat ? chat.messages : null;

  const messages_html = messages ? (
    messages.length ? (
      <ul className='messages'>
        {messages.map((message, index) => <MessageItem key={index} message={message} is_mine={message.message_owner === 0} />)}
      </ul>
    ) : (<div className='no_messages'>There are no messages in this chat.</div>)
  ) : (<div className='no_chat_selected'>No chat selected.</div>);

  const companion_html = companion ? (
    <div className='companion'>
      <button className='back_to_chats' onClick={hideCurrentChat}>
        <ArrowLeft width={24} height={24} />
      </button>
      <ProfileImage profile_id={companion.profile_id} />
      <h3 className='profile_name'>
        {companion.profile_name}
      </h3>
    </div>
  ) : (<div className='no_companion'></div>);

  const get_response = async () => {
    try {
      const response = await fetch('https://johndturn-quotableapiproxy.web.val.run?tags=Inspirational');
      const data = await response.json();

      const date = new Date();
      date.setSeconds(date.getSeconds());

      const message_data = {
        message_owner: companion.profile_id,
        message_text: data[0].content,
        message_date: date
      };

      setTimeout(() => {
        addMessage(message_data, chat.chat_id);
      }, 10);

    } catch (err) {
      console.log(err.message);
    }
  }

  const on_message_submit = e => {
    e.preventDefault();
    const form_data = new FormData(e.target);
    const message_text = form_data.get('message');

    const date = new Date();
    const message_data = {
      message_owner: 0,
      message_text: message_text,
      message_date: date
    };
    e.target.querySelector("[name=message]").value = '';

    addMessage(message_data, chat.chat_id);

    get_response();
  }

  return (
    <div className='CurrentChat'>
      <div className='top'>{companion_html}</div>
      <div className='chat_body'>{messages_html}</div>
      <div className={`chat_message ${chat ? '' : 'disabled'}`}>
        <form className='input_wrapper chat_message_wrapper' onSubmit={on_message_submit}>
          <input type='text' name='message' placeholder='Type your message' />
          <button className='floating'>
            <Send className='send' />
          </button>
        </form>
      </div>
    </div>
  );

}

export default CurrentChat;

CurrentChat.propTypes = {
  chat: PropTypes.shape({
    chat_id: PropTypes.number.isRequired,
    companion: PropTypes.object,
    messages: PropTypes.array,
  }),
  addMessage: PropTypes.func.isRequired,
  hideCurrentChat: PropTypes.func.isRequired,
};