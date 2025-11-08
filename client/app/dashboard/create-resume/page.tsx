"use client";
import React, { useRef, useState } from "react";
import Input, { InputType } from "@/components/ui/Input";
import {jsPDF} from "jspdf";
import {toPng}  from "html-to-image";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";


export default function CreateResume() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('CreateResume');

  const [resume, setResume] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    portfolio: "",
    education: "",
    university: "",
    degree: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const sections = [
    {
      title: t('personalInfo'),
      fields: [
        { label: t('fullName'), name: "fullName", type: InputType.TEXT },
        { label: t('email'), name: "email", type: InputType.EMAIL },
        { label: t('phone'), name: "phone", type: InputType.TEXT },
        { label: t('address'), name: "address", type: InputType.TEXT },
        { label: t('linkedIn'), name: "linkedin", type: InputType.TEXT },
        { label: t('portfolio'), name: "portfolio", type: InputType.TEXT },
      ],
    },
    {
      title: t('education'),
      fields: [
        { label: t('education'), name: "education", type: InputType.TEXT },
        { label: t('university'), name: "university", type: InputType.TEXT },
        { label: t('degree'), name: "degree", type: InputType.TEXT },
        { label: t('startDate'), name: "startDate", type: InputType.DATE },
        { label: t('endDate'), name: "endDate", type: InputType.DATE },
        { label: t('description'), name: "description", type: InputType.TEXTAREA },
      ],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    try {
      const dataUrl = await toPng(previewRef.current, { cacheBust: true });
      const img = new Image();
      img.src = dataUrl;


      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");

      

    } catch (error) {
       console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div className="flex flex-col h-full  min-h-screen items-start justify-start bg-zinc-50 font-sans dark:bg-black dark:text-white p-6 gap-6">
      <h1 className="text-3xl font-semibold mb-4">{t('pageTitle')}</h1>
      <div className="flex md:flex-row flex-col items-start justify-center w-full gap-6">
        <div className="w-full md:w-1/2 space-y-4">
        
        {sections.map((section, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-800 items-center rounded-2xl shadow-sm bg-white dark:bg-zinc-900 overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => {
                setOpenIndex(openIndex === index ? null : index)
                console.log(index)
              }}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                {section.title}
              </h3>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Body */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field, i) => (
                  <div key={i} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <Input
                      inputType={field.type}
                      placeholder={`${field.label}`}
                      value={resume[field.name as keyof typeof resume]}
                      onChange={handleChange}
                      className="dark:bg-zinc-800 dark:border-gray-700"
                      {...(field.type !== InputType.TEXTAREA
                        ? { name: field.name }
                        : { name: field.name })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={previewRef} className="w-full h-[700px] md:w-1/2 bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6">
        <div>
          <h3 className="text-xl font-bold">{resume.fullName || "Your Name"}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {resume.email && `${resume.email} | `}
            {resume.phone && `${resume.phone} | `}
            {resume.address}
          </p>
          <p className="text-sm text-indigo-600 mt-1">
            {resume.linkedin && `LinkedIn: ${resume.linkedin}`}
            {resume.portfolio && ` | Portfolio: ${resume.portfolio}`}
          </p>

          <div className="mt-6">
            <h4 className="text-lg font-semibold">Education</h4>
            <p className="text-gray-700 dark:text-gray-300">
              {resume.degree && `${resume.degree}, `}
              {resume.university}
            </p>
            <p className="text-sm text-gray-500">
              {resume.startDate} - {resume.endDate}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {resume.description}
            </p>
          </div>
        </div>
      </div>

      
      </div>
      <div className="flex justify-end mb-4">
        <Button title="Download PDF" onClick={handleDownloadPDF} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"/>
      </div>
    </div>
  );
}