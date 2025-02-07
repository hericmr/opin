import React from "react";

const ShareButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Compartilhar link"
        >
            Compartilhar
        </button>
    );
};

export default ShareButton;