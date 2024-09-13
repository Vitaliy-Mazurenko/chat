import './button.css';

export default function Button({ text, onClick, id, className }) {

	return (
		<button id={id} onClick={onClick} className={className}>
			{text}
		</button>
	);
}
