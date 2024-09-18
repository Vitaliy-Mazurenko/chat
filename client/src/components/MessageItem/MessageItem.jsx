import './MessageItem.css';
import ProfileImage from "../ProfileImage";
import { date_to_format } from '../../helpers/helper_functions.js';
import PropTypes from 'prop-types';

const MessageItem = ({message, is_mine}) => {
	const profile_image = is_mine ? null : <ProfileImage profile_id={message.author} />;

	return (
		<li className={`MessageItem message ${is_mine ? 'mine' : ''}`}>
			{profile_image}

			<div className='text_wrapper'>
				<p className='text'>
					{message.text}
				</p>
			</div>
			<time className='time' dateTime={message.createdAt}>
				{date_to_format(message.createdAt, 'date_short_time_full')}
			</time>
		</li>
	);
}

export default MessageItem;

MessageItem.propTypes = {
	message: PropTypes.object.isRequired,
	is_mine: PropTypes.bool.isRequired,
  };