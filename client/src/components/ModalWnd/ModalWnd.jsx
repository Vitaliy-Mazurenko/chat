import { useState } from 'react';
import './modalWnd.css';
import PropTypes from 'prop-types';
import Input from '../../common/Input/Input.jsx';
import Button from '../../common/Button/Button.jsx';
// import editIcon from "../../assets/icons/edit_icon.svg";


  
  const ModalWnd = ({ call, onDestroy, user, onSubmit, type = "create" }) => {
	const [firstName, setFirstName] = useState(user ? user.firstName : "");
	const [lastName, setLastName] = useState(user ? user.lastName : "");
	const [error, setError] = useState("");

	const handleSubmit = e => {
		e.preventDefault();
	
		if (!firstName.trim() || !lastName.trim()) {
		setError("Both fields are required");
		return;
		}
		if ((type === "edit")) {
		onSubmit({ firstName, lastName });
		} else {
		onSubmit({ firstName, lastName });
		onDestroy();
		}
		setFirstName("");
		setLastName("");
	};

	if(!call) {
		return null;
	}

	const closeWnd = (e) => {
		if(e.target.className === 'ModalWnd'){
			onDestroy();
		}
	}
  
	return (
	<div className='ModalWnd' onClick={closeWnd}>
		<div className='Modal-wrap'>
		<div className='Modal-header'>
			<h5>{type === "create" ? "Create chat" : "Update chat"}</h5>
			<i className='close' onClick={onDestroy}>&times;</i>
		</div>
		<div className='Modal-content'>
		<div className='Modal-edit-content'>
			<div className='Modal-inputs'>
			<form onSubmit={handleSubmit} className='Modal-form'>
					<Input
						required
						minLength={2}
						type='text'
						placeholder='First name'
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
					<Input
						required
						minLength={2}
						type='text'
						placeholder='Last name'
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					/>
					<span className='form-err'>{error}</span>
					<Button  id='btn' text={type === "create" ? "Create" : "Save"} />
				</form>
			</div>
		</div>
		<div className='Modal-btn'>
			{/* <Button
				text={'Create'}
				onClick={toCreateChat}
				ID='createButton'
				/> */}
		</div>

		</div>
			
		</div>

	</div>
	);
  };
  
  export default ModalWnd;

  ModalWnd.propTypes = {
	call: PropTypes.bool,
	onDestroy: PropTypes.func.isRequired,
	onSubmit: PropTypes.func,
	type: PropTypes.string,
	user: PropTypes.string,
  };