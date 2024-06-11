import React from "react";
import Image from "next/image";
import { toast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import printJS from "print-js";

const PdfDownloader = ({ data, props, variant }: any) => {
  const handleDownloadPDF = async () => {
    console.log(data, "data");
    if (data.length === 0) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Allergy list is empty",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              window.location.reload();
            }}
          >
            Try again
          </ToastAction>
        ),
      });
    } else {
      let patientName =
        data[0]?.patient_lastName +
        ", " +
        data[0]?.patient_firstName +
        " " +
        data[0]?.patient_middleName;
      let jsonFile: {
        Uuid: string;
        Date: string;
        Type: string;
        Allergen: string;
        Severity: string;
        Reaction: string;
        Notes: string;
      }[] = data.map((d: any) => ({
        Uuid: d.allergies_uuid,
        Date: new Date(d.allergies_createdAt).toLocaleDateString(),
        Type: d.allergies_type,
        Allergen: d.allergies_allergen,
        Severity: d.allergies_severity,
        Reaction: d.allergies_reaction,
        Notes: d.allergies_notes,
      }));

      const patientFullName = patientName;

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
                        <p>${patientFullName}</p>
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
  };
  return (
    <button className="btn-pdfs gap-2" onClick={handleDownloadPDF}>
      <Image src="/imgs/downloadpdf.svg" alt="" width={22} height={22} />
      <p className="text-[18px]">Download PDF</p>
    </button>
  );
};

export default PdfDownloader;
