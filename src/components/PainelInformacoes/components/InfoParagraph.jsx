const InfoParagraph = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1 p-2 border-b border-gray-200">
      <span className="text-sm font-semibold text-gray-600">{label}</span>
      <p className="text-base text-gray-800 whitespace-pre-wrap break-words text-justify">
        {value}
      </p>
    </div>
  );
};

export default InfoParagraph; 