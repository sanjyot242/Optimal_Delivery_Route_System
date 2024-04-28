import React, { useState } from 'react';


function AddLocationForm ({ onSubmit }) {
    const [address, setAddress] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null); // Store the selected location object
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = async (event) => {
        const inputValue = event.target.value;
        setAddress(inputValue);
        setSelectedLocation(null);  // Reset selected location when user edits the input

        if (!inputValue.trim()) {
            setSuggestions([]);
            return;
        }

        const API_KEY = 'pk.564efef458e2028c3da6e7772f0ae570';  // Replace with your LocationIQ API key
        const url = `https://api.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${inputValue}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching autocomplete data:', error);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setAddress(suggestion.display_name);
        setSelectedLocation({
            position: [suggestion.lat, suggestion.lon],
            details: suggestion.display_name
        });
        setSuggestions([]);  // Clear suggestions after selection
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedLocation) {
            onSubmit(selectedLocation);  // Submit the selected location to update the map
        }
        setAddress('');  // Optionally clear the input field after submission
        setSelectedLocation(null);  // Clear selected location after submission
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex relative" style={{ zIndex: 1000 }}>
            <div className="flex-grow relative">
                <input
                    type="text"
                    value={address}
                    onChange={handleInputChange}
                    placeholder="Enter delivery location"
                    className="border-2 border-gray-300 p-2 rounded-md w-full"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 max-h-60 overflow-auto" style={{ zIndex: 1001 }}>
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2">
                Add Location
            </button>
        </form>
    );
};




export default AddLocationForm;
