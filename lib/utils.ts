import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { UrlQueryParams, RemoveUrlQueryParams } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateTime } from "luxon";

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
    { skipNull: true },
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
    { skipNull: true },
  );
}

export function formatDate(dateString: string) {
  const date = DateTime.fromISO(dateString);
  return date.toFormat("MM / dd / yyyy");
}

export function formatTime(timeString: string) {
  const time = DateTime.fromFormat(timeString, "HH:mm");
  return time.toFormat("h:mm a");
}

export async function print(jsonFile: any, props: any, variant: string) {
  const doc = new jsPDF();

  const columns = props.map((prop: any) => ({ header: prop, dataKey: prop }));
  const data = jsonFile.map((row: any) => {
    let newRow: any = {};
    props.forEach((prop: any) => {
      newRow[prop] = row[prop];
    });
    return newRow;
  });

  const tableData = data.map((row: any) => {
    return columns.map((column: string) => {
      return row[column];
    });
  });

  autoTable(doc, {
    head: [columns.map((col: { header: any; }) => col.header)],
    body: data.map((row: { [x: string]: any; }) => columns.map((col: { dataKey: string | number; }) => row[col.dataKey])),
  });

  // Save the PDF
  doc.save(`${variant}.pdf`);
}
