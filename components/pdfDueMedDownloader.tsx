"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import printJS from "print-js";
import DownloadPDF from "./shared/buttons/downloadpdf";
import { fetchDueMedication } from "@/app/api/medication-logs-api/due-medication-api";
import { useRouter } from "next/navigation";
import { print } from "@/lib/utils";

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

      print(jsonFile, props, variant);
    }
  };
  return (
    <div onClick={handleDownloadPDF}>
      <DownloadPDF />
    </div>
  );
};

export default PdfDueMedDownloader;
