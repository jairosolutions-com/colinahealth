import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-string'
import { UrlQueryParams, RemoveUrlQueryParams } from '@/types'
import printJS from "print-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params)

  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function removeKeysFromQuery({ params, keysToRemove }: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach(key => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  return formattedDate.replace(/\//g, ' / ');
}

