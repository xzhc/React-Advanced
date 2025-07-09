import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
} from "date-fns";
export function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="date-picker-container">
      <button className="date-picker-button" onClick={() => setIsOpen(!isOpen)}>
        {value == null ? "Select a date" : format(value, "MMM do, yyyy")}
      </button>
      {isOpen && <DatePickerModal value={value} onChange={onChange} />}
    </div>
  );
}

function DatePickerModal({ value, onChange }) {
  const [visibleMonth, setVisibleMonth] = useState(value || new Date());

  const showPreviousMonth = () => {
    setVisibleMonth((currentMonth) => addMonths(currentMonth, -1));
  };

  const showNextMonth = () => {
    setVisibleMonth((currentMonth) => addMonths(currentMonth, 1));
  };

  const visibleDates = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth)),
    end: endOfWeek(endOfMonth(visibleMonth)),
  });

  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <button
          className="prev-month-button month-button"
          onClick={showPreviousMonth}
        >
          &larr;
        </button>
        <div className="current-month">
          {format(visibleMonth, "MMMM - yyyy")}
        </div>
        <button
          className="next-month-button month-button"
          onClick={showNextMonth}
        >
          &rarr;
        </button>
      </div>
      <div className="date-picker-grid-header date-picker-grid">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="date-picker-grid-dates date-picker-grid">
        {visibleDates.map((date) => (
          <button
            className={`date 
					  ${!isSameMonth(date, visibleMonth) && "date-picker-other-month-date"}
						${isSameDay(date, value) && "selected"}
						${isToday(date) && "today"}
						)}
						`}
            onClick={() => onChange(date)}
            key={date.toDateString()}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}
