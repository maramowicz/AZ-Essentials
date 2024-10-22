import React from 'react';

interface ErrorModalProps {
    message: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-150">
                <h2 className="text-xl font-bold text-red-500">Błąd</h2>
                <p className="my-4 text-black dark:text-white transition-colors duration-75">{message}</p>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={onClose}
                >
                    Zamknij
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
