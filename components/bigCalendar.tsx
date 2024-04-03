import { Calendar, EventProps, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";



interface CustomEventProps
  extends EventProps<{
    title: string;
    start: Date;
    end: Date;
    status: string;
  }> {
  event: {
    title: string;
    start: Date;
    end: Date;
    status: string;
  };
}

const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {
  const [isDone, setIsDone] = useState(event.status === "done");

  return (
    <div>
      {isDone && <FaCheck />}
      {!isDone && event.title}
    </div>
  );
};

const BigCalendar = () => {
  const events = [
    {
      title: "My event",
      start: new Date(),
      end: new Date(),
      status: "in progress",
    },
    {
      title: "My other event",
      start: new Date(),
      end: new Date(),
      status: "done",
    },
  ];
  const localizer = momentLocalizer(moment);
  const [date, setDate] = useState(new Date());

  return (
    <div className="App w-full">
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="day"
        events={events}
        views={["day"]}
        components={{
          event: CustomEvent,
        }}
        style={{ height: "65vh" }}
      />
    </div>
  );
};

export default BigCalendar;
