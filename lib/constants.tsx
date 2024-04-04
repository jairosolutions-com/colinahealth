import React from "react";

export const IntervalCheck = (prescription: any, col: any) => {
  console.log("prescription:", prescription);
  switch (prescription.interval) {
    case "1":
      if (col.time === "0800" || col.time === "0900") {
        return (
          <React.Fragment>
            {col.time === "0800" && <div className="">{prescription.name}</div>}
            {col.time === "0900" && <div className="">{prescription.name}</div>}
          </React.Fragment>
        );
      }
      break;
    case "2":
      if (col.time === "0800" || col.time === "1000") {
        return (
          <React.Fragment>
            {col.time === "0800" && <div className="">{prescription.name}</div>}
            {col.time === "1000" && <div className="">{prescription.name}</div>}
          </React.Fragment>
        );
      }
      break;
    case "3":
      if (col.time === "0800" || col.time === "1100") {
        return (
          <React.Fragment>
            {col.time === "0800" && <div className="">{prescription.name}</div>}
            {col.time === "1100" && <div className="">{prescription.name}</div>}
          </React.Fragment>
        );
      }
      break;
    case "4":
      if (col.time === "0800" || col.time === "1200") {
        return (
          <React.Fragment>
            {col.time === "0800" && <div className="">{prescription.name}</div>}
            {col.time === "1200" && <div className="">{prescription.name}</div>}
          </React.Fragment>
        );
      }
      break;
    default:
      break;
  }
};
