"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import DownloadPDF from "./shared/buttons/downloadpdf";
import { fetchDueMedication } from "@/app/api/medication-logs-api/due-medication-api";
import { useRouter } from "next/navigation";

const PdfDueMedDownloader = ({ props, variant}: any) => {
    const router = useRouter();
    const [dueMedicationList, setDueMedicationList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalDueMedication, setTotalDueMedication] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [term, setTerm] = useState("");
    const [dueMedSortBy, setDueMedSortBy] = useState("medicationlogs.medicationLogsTime");
    const [sortOrder, setSortOrder] = useState("ASC");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dueMedicationList = await fetchDueMedication(
          term,
          currentPage,
          dueMedSortBy,
          sortOrder as "ASC" | "DESC",
          0,
          router
        );
        setDueMedicationList(dueMedicationList.data);
        setTotalPages(dueMedicationList.totalPages);
        setTotalDueMedication(dueMedicationList.totalCount);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, []);

  const handleDownloadPDF = async () => {
    if (dueMedicationList.length === 0) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Due Med is empty",
        // action: (
        //   <ToastAction
        //     altText="Try again"
        //     onClick={() => {
        //       window.location.reload();
        //     }}
        //   >
        //     Try again
        //   </ToastAction>
        // ),
      });
    } else {
      let jsonFile: {
        Name: string;
        Uuid: string;
        Medication: string;
        Date: string;
        Time: string;
      }[] = dueMedicationList.map((d: any) => ({
        Name: d.patient_firstName + d.patient_lastName,
        Uuid: d.medicationlogs_uuid,
        Medication: d.medicationlogs_medicationLogsName,
        Date: d.medicationlogs_medicationLogsDate,
        Time: d.medicationlogs_medicationLogsTime,
      }));

      if (typeof window !== "undefined") {
        const printJS = (await import("print-js")).default;
        printJS({
          printable: jsonFile,
          properties: props,
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
          documentTitle: "",
        });
      }
    }
  
    
  };
  return (
    <div onClick={handleDownloadPDF}>
      <DownloadPDF />
    </div>
  );
};

export default PdfDueMedDownloader;
