const TextArea = ({ label, rows, value }) => {
  return (
    <textarea
      cols={-1}
      errorText=""
      id=""
      label={label}
      maxlength={-1}
      minlength={-1}
      name=""
      placeholder="Placeholder"
      readonly
      rows={rows}
      secondaryLabel=""
      value={value}
    />
  );
};

export default TextArea;
