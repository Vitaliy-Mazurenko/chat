import './button.css';
import PropTypes from 'prop-types';


const Button = ({ text = '', onClick = () => {}, id = '' }) => {
  return (
    <button id={id} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  id: PropTypes.string,
};
