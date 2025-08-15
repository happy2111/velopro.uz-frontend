import React, { useEffect, useState } from 'react';
import { X, Pencil, Save } from 'lucide-react';

const InfoModal = ({
                     isOpen,
                     onClose,
                     title = 'Информация',
                     data = {},
                     editableFields = [],
                     onSave,
                   }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (onSave) onSave(formData);
    setIsEditing(false);
  };

  const closeModal = () => {
    setIsEditing(false);
    setFormData(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={"fixed inset-0 backdrop-blur-sm bg-black/40"} onClick={onClose}></div>
      <div className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-lg shadow-lg p-6 relative">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
          <X />
        </button>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl text-gray-95 font-bold mb-4">{title}</h2>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            {isEditing ? <Save className="w-5 h-5 mr-1" /> : <Pencil className="w-5 h-5 mr-1" />}
            {isEditing ? 'Сохранить' : 'Изменить'}
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {Object.entries(formData).map(([key, value]) => {
            // Custom render for 'images'
            if (key === 'images' && Array.isArray(value)) {
              return (
                <div key={key}>
                  <label className="text-sm text-gray-600 dark:text-gray-300 capitalize">{key}</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {value.map((src, i) => (
                      <img
                        key={i}
                        src={`${import.meta.env.VITE_API_BASE_URL}${src}`}
                        alt={`Image ${i}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              );
            }

            // Custom render for 'reviews'
            if (key === 'reviews' && Array.isArray(value)) {
              return (
                <div key={key}>
                  <label className="text-sm text-gray-600 dark:text-gray-300 capitalize">{key}</label>
                  {value.length === 0 ? (
                    <p className="text-gray-500 italic mt-1">Нет отзывов</p>
                  ) : (
                    <div className="mt-2 space-y-3">
                      {value.map((review, index) => (
                        <div key={review._id || index} className="p-2 border rounded-md bg-neutral-100 dark:bg-neutral-800">
                          <p className="text-sm text-gray-800 dark:text-gray-100 ">
                            <span className="font-medium">{review.name || 'Аноним'}:</span> <p className={"whitespace-break-spaces break-normal"}> {review.comment}</p>
                          </p>
                          <p className="text-xs text-gray-500">
                            ⭐ {review.rating} — {new Date(review.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Editable input
            if (editableFields.includes(key) && isEditing) {
              return (
                <div key={key}>
                  <label className="text-sm text-gray-600 dark:text-gray-300 capitalize">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-neutral-800 dark:text-white"
                  />
                </div>
              );
            }

            // Render arrays (other than images/reviews)
            if (Array.isArray(value)) {
              return (
                <div key={key}>
                  <label className="text-sm text-gray-600 dark:text-gray-300 capitalize">{key}</label>
                  <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-100 mt-1">
                    {value.map((item, index) => (
                      <li key={index}>
                        {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            // Render objects
            if (typeof value === 'object' && value !== null) {
              return (
                <div key={key}>
                  <label className="text-sm text-gray-600 dark:text-gray-300 capitalize">{key}</label>
                  <pre className="mt-1 bg-neutral-100 dark:bg-neutral-800 text-sm p-2 rounded">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              );
            }

            // Default render
            return (
              <div key={key}>
                <label className="text-sm text-gray-600 dark:text-gray-300 capitalize">{key}</label>
                <p className="mt-1 text-gray-800 dark:text-gray-100">{String(value)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
