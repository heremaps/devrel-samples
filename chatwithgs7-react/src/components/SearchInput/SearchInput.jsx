const SearchInput = ({ userQuery, onChange }) => {
  return (
    <input
      type="text"
      value={userQuery}
      onChange={onChange}
      placeholder="Enter your question here..."
    />
  );
};

export default SearchInput;
