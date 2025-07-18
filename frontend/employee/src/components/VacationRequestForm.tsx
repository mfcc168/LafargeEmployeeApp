import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useVacationRequestForm } from '@hooks/useVacationRequestForm';

/**
 * VacationRequestForm Component
 * 
 * A form for submitting vacation requests with:
 * - Support for full-day and half-day vacation types
 * - Dynamic date item management (add/remove/update)
 * - Real-time vacation day calculation
 * - Visual feedback for remaining vacation days
 */
const VacationRequestForm = () => {
  const {
    dateItems,
    submitting,
    addItem,
    updateItem,
    removeItem,
    handleSubmit,
    getTotalVacationDay,
    getVacationDayLeft,
  } = useVacationRequestForm();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white rounded-3xl shadow-2xl mt-12">
      {/* Form Header */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        Vacation Request
      </h2>

      {/* Date Items Section */}
      <div className="space-y-4">
        {dateItems.map((item, index) => {
          // Refs for date picker inputs
          let fromDateInput: HTMLInputElement | null = null;
          let toDateInput: HTMLInputElement | null = null;
          let singleDateInput: HTMLInputElement | null = null;

          return (
            <div
              key={index}
              className="border border-gray-200 p-4 rounded-xl bg-gray-50 shadow-sm"
            >
              {/* Vacation Type Selector */}
              <div className="flex items-center justify-between mb-3">
                <select
                  value={item.type}
                  onChange={(e) => {
                    const newType = e.target.value as 'full' | 'half';
                    updateItem(
                      index,
                      newType === 'full'
                        ? { type: 'full', from_date: '', to_date: '' }
                        : { type: 'half', single_date: '', half_day_period: 'AM' }
                    );
                  }}
                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm"
                  aria-label="Vacation type"
                >
                  <option value="full">Full Day</option>
                  <option value="half">Half Day</option>
                </select>

                <select
                  value={item.leave_type}
                  onChange={(e) => {
                    updateItem(index, {
                      ...item,
                      leave_type: e.target.value as 'Annual Leave' | 'Sick Leave'
                    })
                  }}
                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm"
                  aria-label="Vacation type"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                </select>
              </div>

              {/* Full Day Vacation Inputs */}
              {item.type === 'full' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => fromDateInput?.showPicker()}>
                    <label className="block text-sm text-gray-600 mb-1">
                      From Date
                    </label>
                    <input
                      ref={(el) => { fromDateInput = el }}
                      type="date"
                      value={item.from_date}
                      onChange={(e) =>
                        updateItem(index, {
                          ...item,
                          from_date: e.target.value,
                        })
                      }
                      className="bg-white w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      aria-required="true"
                    />
                  </div>
                  <div onClick={() => toDateInput?.showPicker()}>
                    <label className="block text-sm text-gray-600 mb-1">
                      To Date
                    </label>
                    <input
                      ref={(el) => { toDateInput = el }}
                      type="date"
                      value={item.to_date}
                      onChange={(e) =>
                        updateItem(index, {
                          ...item,
                          to_date: e.target.value,
                        })
                      }
                      className="bg-white w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      aria-required="true"
                      min={item.from_date} // Prevent selecting end date before start date
                    />
                  </div>
                </div>
              ) : (
                /* Half Day Vacation Inputs */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => singleDateInput?.showPicker()}>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      ref={(el) => { singleDateInput = el }}
                      type="date"
                      value={item.single_date}
                      onChange={(e) =>
                        updateItem(index, {
                          ...item,
                          single_date: e.target.value,
                        })
                      }
                      className="bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Half Day Period</label>
                    <select
                      value={item.half_day_period || 'AM'}
                      onChange={(e) =>
                        updateItem(index, {
                          ...item,
                          half_day_period: e.target.value as 'AM' | 'PM',
                        })
                      }
                      className="bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      aria-label="Half day period"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Remove Item Button */}
              <button
                onClick={() => removeItem(index)}
                className="mt-4 flex items-center text-sm text-red-600 hover:underline"
                aria-label={`Remove vacation item ${index + 1}`}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {/* Form Actions */}
      <div className="flex flex-wrap gap-6 mt-6 items-center justify-between">
        <button
          onClick={addItem}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          aria-label="Add another vacation date"
        >
          <Plus className="w-4 h-4" />
          Add Date Item
        </button>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          disabled={submitting}
          aria-label="Submit vacation request"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </button>
      </div>

      {/* Vacation Day Summary */}
      {typeof getVacationDayLeft === 'number' && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
            Vacation Summary
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Total Requested:{' '}
            <span className="font-semibold text-blue-600">
              {getTotalVacationDay}
            </span>{' '}
            {getTotalVacationDay === 1 ? 'day' : 'days'}
          </p>
          <p className="text-sm text-gray-600">
            You have{' '}
            <span
              className={getVacationDayLeft < 0 ? 'text-red-600' : 'text-green-600'}
            >
              {getVacationDayLeft}
            </span>{' '}
            {getVacationDayLeft === 1 ? 'day' : 'days'} left.
          </p>
        </div>
      )}
    </div>
  );
}

export default VacationRequestForm;