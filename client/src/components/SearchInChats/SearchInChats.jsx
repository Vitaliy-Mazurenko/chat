import './SearchInChats.css';
import Search from '../../img/icons/search_1.svg';
import PropTypes from 'prop-types';

const SearchInChats = ({changeSearchQuery}) => {

  const onSearchChange = e => changeSearchQuery(e.target.value);

  return (
    <div className='SearchInChats'>
      <form className='input_wrapper search_wrapper'>
        <input type='text' placeholder='Search or start new chat' onChange={onSearchChange} />
        <span className='floating'>
          <Search className='search' />
        </span>
      </form>
    </div>
  );
}

export default SearchInChats;

SearchInChats.propTypes = {
  changeSearchQuery: PropTypes.func.isRequired,
};
