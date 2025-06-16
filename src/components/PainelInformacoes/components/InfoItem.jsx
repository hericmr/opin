const InfoItem = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-1 p-2 border-b border-gray-200">
      <span className="text-sm font-semibold text-gray-600">{label}</span>
      <span className="text-base text-gray-800 break-words">{value}</span>
    </div>
  );
};

export default InfoItem; 