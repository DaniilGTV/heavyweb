import { useState, useRef } from 'react';

export default function CategorizedNumberCheckboxGenerator() {
  // Create categories of number options
  const categories = [
    {
      id: 'category1',
      name: 'Numbers 1-10',
      options: Array.from({ length: 10 }, (_, i) => {
        const num = i + 1;
        return {
          id: `num-${num}`,
          label: num.toString(),
          text: numberToWord(num)
        };
      })
    },
    {
      id: 'category2',
      name: 'Numbers 11-20',
      options: Array.from({ length: 10 }, (_, i) => {
        const num = i + 11;
        return {
          id: `num-${num}`,
          label: num.toString(),
          text: numberToWord(num)
        };
      })
    },
    {
      id: 'category3',
      name: 'Numbers 21-31',
      options: Array.from({ length: 11 }, (_, i) => {
        const num = i + 21;
        return {
          id: `num-${num}`,
          label: num.toString(),
          text: numberToWord(num)
        };
      })
    }
  ];
  
  // Flatten all options for easy access
  const allOptions = categories.flatMap(category => category.options);
  
  // State to track which checkboxes are checked
  const [selectedOptions, setSelectedOptions] = useState({});
  // State for copy button text
  const [copyButtonText, setCopyButtonText] = useState('Copy Text');
  // Ref for the text area
  const textAreaRef = useRef(null);

  // Handle checkbox changes
  const handleCheckboxChange = (id) => {
    setSelectedOptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Select/deselect all options in a category
  const toggleCategory = (categoryId, select) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const newSelected = { ...selectedOptions };
    category.options.forEach(option => {
      newSelected[option.id] = select;
    });
    
    setSelectedOptions(newSelected);
  };

  // Generate the combined text from selected options
  const generateText = () => {
    const selectedTexts = allOptions
      .filter(option => selectedOptions[option.id])
      .map(option => option.text);
    
    if (selectedTexts.length === 0) {
      return '';
    }
    
    return selectedTexts.join(', ');
  };

  // Copy text to clipboard
  const copyToClipboard = () => {
    const text = generateText();
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopyButtonText('Copied!');
          setTimeout(() => setCopyButtonText('Copy Text'), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          // Fallback method if clipboard API fails
          if (textAreaRef.current) {
            textAreaRef.current.select();
            document.execCommand('copy');
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy Text'), 2000);
          }
        });
    }
  };

  const generatedText = generateText();

  // Function to convert number to word
  function numberToWord(num) {
    const words = [
      'one', 'two', 'three', 'four', 'five', 
      'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
      'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
      'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five',
      'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty',
      'thirty-one'
    ];
    
    return words[num - 1];
  }

  // Dark green button style
  const buttonStyle = "bg-green-800 hover:bg-green-900 text-white";

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-200 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Number Text Generator</h1>
      
      <div className="mb-6 space-y-4">
        {/* Categories of checkboxes */}
        {categories.map(category => (
          <div key={category.id} className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">{category.name}</h2>
              <div className="space-x-2">
                <button
                  onClick={() => toggleCategory(category.id, true)}
                  className={`px-2 py-1 ${buttonStyle} text-xs rounded`}
                >
                  Select All
                </button>
                <button
                  onClick={() => toggleCategory(category.id, false)}
                  className={`px-2 py-1 ${buttonStyle} text-xs rounded`}
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {category.options.map(option => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={!!selectedOptions[option.id]}
                    onChange={() => handleCheckboxChange(option.id)}
                    className="w-4 h-4 text-green-800 rounded focus:ring-green-700"
                  />
                  <label htmlFor={option.id} className="ml-2 text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Global Select/Deselect All buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              const allSelected = {};
              allOptions.forEach(option => { allSelected[option.id] = true; });
              setSelectedOptions(allSelected);
            }}
            className={`px-3 py-1 ${buttonStyle} text-sm rounded`}
          >
            Select All Numbers
          </button>
          <button
            onClick={() => setSelectedOptions({})}
            className={`px-3 py-1 ${buttonStyle} text-sm rounded`}
          >
            Deselect All Numbers
          </button>
        </div>
      </div>
        
      {/* Generated Text */}
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">Generated Text</h2>
          <button
            onClick={copyToClipboard}
            disabled={!generatedText}
            className={`px-4 py-1 rounded text-white ${!generatedText ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-800 hover:bg-green-900'}`}
          >
            {copyButtonText}
          </button>
        </div>
        <textarea
          ref={textAreaRef}
          value={generatedText}
          readOnly
          placeholder="Check numbers to generate text..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        />
        <div className="mt-2 text-sm text-gray-500">
          {generatedText ? `${generatedText.length} characters` : 'No text generated'}
        </div>
      </div>
    </div>
  );
}
