import React from 'react';

// Define the shape of a single slot
export type Slot = {
  date: string;
  time: string;
  remaining: number;
};

// Define the component's props
type SlotSelectorProps = {
  slots: Slot[];
  selectedDate: string | null;
  selectedTime: string | null;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
};

const SlotSelector: React.FC<SlotSelectorProps> = ({
  slots,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}) => {
  // Get a unique list of dates from the available slots
  const availableDates = [...new Set(slots.map((slot) => slot.date))];

  // Get the time slots only for the currently selected date
  const timesForSelectedDate = slots.filter(
    (slot) => slot.date === selectedDate
  );

  // Helper to get the correct style for a time slot
  const getTimeSlotClass = (slot: Slot) => {
    const baseClass =
      'border rounded-md py-2 px-4 text-sm font-medium transition-all';

    if (slot.remaining === 0) {
      return `${baseClass} bg-gray-200 text-gray-400 cursor-not-allowed`;
    }

    if (slot.time === selectedTime) {
      return `${baseClass} bg-purple-100 text-purple-700 border-purple-500 ring-2 ring-purple-300`;
    }

    if (slot.remaining <= 5) {
      return `${baseClass} bg-red-50 text-red-700 border-red-200 hover:bg-red-100`;
    }

    return `${baseClass} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`;
  };

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Choose date</h3>
        <div className="flex space-x-3">
          {availableDates.map((date) => (
            <button
              key={date}
              onClick={() => onDateSelect(date)}
              className={`py-2 px-4 rounded-lg font-medium ${
                selectedDate === date
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-white shadow-sm border border-gray-300'
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selector */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Choose time</h3>
          <div className="flex flex-wrap gap-3">
            {timesForSelectedDate.map((slot) => (
              <button
                key={slot.time}
                disabled={slot.remaining === 0}
                onClick={() => onTimeSelect(slot.time)}
                className={getTimeSlotClass(slot)}
              >
                {slot.time}
                {slot.remaining === 0 && (
                  <span className="ml-2">Sold out</span>
                )}
                {slot.remaining > 0 && slot.remaining <= 5 && (
                  <span className="ml-2 font-bold">{slot.remaining} left</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            All times are in IST (GMT +5:30)
          </p>
        </div>
      )}
    </div>
  );
};

export default SlotSelector;