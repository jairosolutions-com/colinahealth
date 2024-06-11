import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";
import printJS from "print-js";
import { DateTime } from 'luxon';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function formatDate(dateString:string) {
  const date = DateTime.fromISO(dateString);
  return date.toFormat('MM / dd / yyyy');
}

export function formatTime(timeString:string) {
  const time = DateTime.fromFormat(timeString, 'HH:mm');
  return time.toFormat('h:mm a');
}

export async function print(jsonFile: any, props: any, variant: string) {
  const printJS = (await import("print-js")).default;
  printJS({
    printable: jsonFile,
    properties: props,
    repeatTableHeader: true,
    modalMessage: "Retrieving your document...",
    type: "json",
    style: `
          @page { size: Letter landscape; }
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
          
           body {
          font-family: 'Manrope', sans-serif;
          font-weight:lighter;
        }
        hr.new1 {
          margin-top: -40px;
          border: 3px solid #007C85;
        }
        hr.new2 {
          border: 1px solid #007C85;
        }

        p {
          font-size: 23.57px;
          font-weight: lighter;
        }
        .logo-bg {
          display:flex;
          height: 77.79px;
          width: 226.48px;
        }
        .variant {
          text-align: center;
          align-items: center;
          width: 100%;
          position:absolute;
        }
        .w-full {
          width: 100%;
        }
        div {
          width: 100%;
        }
        `,
    header: `<div class="w-full"> 
        <div class="logo-bg w-full">
          <img src="https://i.imgur.com/LrS9IUe.png" height="30px alt="">
          <div class="variant w-full">${variant}</div>
        </div>
      <div>
      <hr class="new1">
      <hr class="new2">
      </div>
    </div>`,
    headerStyle: "color: #64748B; font-size:23.57px; font-weight:lighter",
    gridHeaderStyle:
      "color: #64748B;  border: 1.18px solid #EEEEEE; text-align:left; padding-left:5px; height:56.05px; font-weight:lighter; ",
    gridStyle:
      "border: 1.18px solid #EEEEEE; padding-left:5px; height:71.87px ",
    documentTitle: ` `,
  });
}
