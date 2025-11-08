"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAddResume, Resume } from "@/hooks/useAddResume";
import { useGetResumes } from "@/hooks/useGetResumes";
import CVParser from "@/components/CVParser/CVParser";
import Input, { InputType } from "@/components/ui/Input";
import {jsPDF} from "jspdf";
import {toPng}  from "html-to-image";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { authService, User } from "@/lib/auth";
import { useSearchParams } from "next/navigation";


export default function CreateResume() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern'>(
    'classic'
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('CreateResume');
  const [user, setUser] = useState<User | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
      const cachedUser = authService.getUser();
      
      if (cachedUser) {
        setUser(cachedUser);
      }
  
      // Always verify with backend
      authService.checkAuth()
        .then((userData) => {
          if (userData) {
            setUser(userData);
          }
        })
    }, []);

  // Check for resumeId in URL parameters
  useEffect(() => {
    const resumeIdFromUrl = searchParams.get('resumeId');
    if (resumeIdFromUrl) {
      setSelectedResumeId(resumeIdFromUrl);
    }
  }, [searchParams]);

  const [resume, setResume] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    portfolio: "",
    school: "",
    education: "",
    university: "",
    degree: "",
    startDate: "",
    endDate: "",
    description: "",
    desiredJobPosition: "",
    postCode: "",
    city: "",
    dateOfBirth: "",
    driverLicense: "",
    gender: "",
    nationality: "",
    civilStatus: "",
    website: "",
    profileImage: "",
    customFields: [],
    skills: [],
    languages: [],
    hobbies: [],
    employment: [],
  });

  const { addResume, updateResume, loading, error, data } = useAddResume();
  const { resumes, refetch: refetchResumes } = useGetResumes(user?.id);
  
  // Load existing resume data into form when editing
  useEffect(() => {
    if (selectedResumeId && resumes.length > 0) {
      console.log("📋 Loading resume data for ID:", selectedResumeId);
      const existingResume = resumes.find(r => r.id === selectedResumeId);
      
      if (existingResume) {
        console.log("✅ Found resume:", existingResume);
        const pd = existingResume.personalDetails;
      
      setResume({
        fullName: pd.name || "",
        email: pd.emailAddress || "",
        phone: pd.phoneNumber || "",
        address: pd.address || "",
        linkedin: pd.linkedIn || "",
        portfolio: pd.website || "",
        school: existingResume.educations?.[0]?.school || "",
        education: existingResume.educations?.[0]?.educationName || "",
        university: existingResume.educations?.[0]?.school || "",
        degree: existingResume.educations?.[0]?.educationName || "",
        startDate: existingResume.educations?.[0]?.startDate || "",
        endDate: existingResume.educations?.[0]?.endDate || "",
        description: existingResume.educations?.[0]?.description || "",
        desiredJobPosition: pd.desiredJobPosition || "",
        postCode: pd.postCode || "",
        city: pd.city || "",
        dateOfBirth: pd.dateOfBirth || "",
        driverLicense: pd.driverLicense || "",
        gender: pd.gender || "",
        nationality: pd.nationality || "",
        civilStatus: pd.civilStatus || "",
        website: pd.website || "",
        profileImage: "",
        customFields: [],
        skills: existingResume.skills?.map(s => s.name).join(", ") as any || [],
        languages: existingResume.languages?.map(l => l.name).join(", ") as any || [],
        hobbies: existingResume.hobbies?.join(", ") as any || [],
        employment: existingResume.employment?.map(e => e.jobTitle).join(", ") as any || [],
      });
      
        // Set template based on templateId
        if (existingResume.templateId === 2) {
          setSelectedTemplate('modern');
        } else {
          setSelectedTemplate('classic');
        }
        console.log("✅ Form populated with existing resume data");
      } else {
        console.log("⚠️ Resume not found in loaded resumes");
      }
    }
  }, [selectedResumeId, resumes]);
  
  // Helper to convert local resume state to API format
  function toApiResume(local: typeof resume, template: 'classic' | 'modern', existingId?: string | null): any {
    // Build educations array only if there's data
    const educations = [];
    if (local.education || local.university || local.degree || local.school) {
      educations.push({
        id: crypto.randomUUID(),
        educationName: local.education || "",
        school: local.school || local.university || "",
        city: local.city || null,
        startDate: local.startDate || null,
        endDate: local.endDate || null,
        description: local.description || null,
      });
    }

    return {
      id: existingId || crypto.randomUUID(),
      templateId: template === 'classic' ? 1 : 2,
      personalDetails: {
        name: local.fullName || "",
        emailAddress: local.email || "",
        desiredJobPosition: local.desiredJobPosition || "",
        phoneNumber: local.phone || null,
        address: local.address || null,
        postCode: local.postCode || null,
        city: local.city || null,
        dateOfBirth: local.dateOfBirth || null,
        driverLicense: local.driverLicense || null,
        gender: local.gender || null,
        nationality: local.nationality || null,
        civilStatus: local.civilStatus || null,
        website: local.website || null,
        linkedIn: local.linkedin || null,
        customFields: [],
      },
      educations: educations,
      employment: Array.isArray(local.employment) 
        ? local.employment.toString().split(",").filter(e => e.trim()).map(emp => ({
            id: crypto.randomUUID(),
            jobTitle: emp.trim(),
            employer: "",
            city: null,
            startDate: null,
            endDate: null,
            description: null,
          }))
        : [],
      skills: Array.isArray(local.skills)
        ? local.skills.toString().split(",").filter(s => s.trim()).map(skill => ({
            name: skill.trim(),
            level: {
              value: 0,
              description: "",
            },
          }))
        : [],
      languages: Array.isArray(local.languages)
        ? local.languages.toString().split(",").filter(l => l.trim()).map(lang => ({
            name: lang.trim(),
            level: {
              value: 0,
              description: "",
            },
          }))
        : [],
      hobbies: Array.isArray(local.hobbies)
        ? local.hobbies.toString().split(",").filter(h => h.trim()).map(h => h.trim())
        : [],
    };
  }
  const handleAddResume = async () => {
    if (!user?.id) {
      alert("Please log in to save your resume");
      return;
    }

    if (!resume.fullName || !resume.email) {
      alert("Please fill in at least your name and email");
      return;
    }

    console.log("=== SAVE RESUME DEBUG ===");
    console.log("selectedResumeId:", selectedResumeId);
    console.log("Will use:", selectedResumeId ? "PUT (update)" : "POST (create)");

    try {
      let result;
      
      if (selectedResumeId) {
        // Update existing resume - use the existing ID
        const apiResume = toApiResume(resume, selectedTemplate, selectedResumeId);
        console.log("🔄 Updating resume with ID:", selectedResumeId);
        console.log("API Resume data:", apiResume);
        result = await updateResume(selectedResumeId, apiResume);
        console.log("Update result:", result);
        alert(`Resume "${resume.fullName}" updated successfully! ID: ${selectedResumeId}`);
      } else {
        // Create new resume - generate new ID
        const apiResume = toApiResume(resume, selectedTemplate);
        console.log("Creating new resume");
        console.log("API Resume data:", apiResume);
        result = await addResume(user?.id, apiResume);
        const resumeId = result?.id;
        console.log("Create result:", result);
        alert(`Resume "${resume.fullName}" added successfully! ID: ${resumeId}`);
        setSelectedResumeId(resumeId);
      }
      
      // Refresh the resume list
      console.log("Refreshing resume list...");
      await refetchResumes();
      console.log("Resume list refreshed");
    } catch (err: any) {
      console.error("Error saving resume:", err);
      alert(`Failed to save resume: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleParsedCV = (data: any) => {
    console.log('Received parsed CV data:', data);
    
    // Update resume state with parsed data
    setResume((prev) => ({
      ...prev,
      fullName: data.fullName || prev.fullName,
      email: data.email || prev.email,
      phone: data.phone || prev.phone,
      address: data.address || prev.address,
      city: data.city || prev.city,
      postCode: data.postCode || prev.postCode,
      dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
      nationality: data.nationality || prev.nationality,
      gender: data.gender || prev.gender,
      driverLicense: data.driverLicense || prev.driverLicense,
      civilStatus: data.civilStatus || prev.civilStatus,
      linkedin: data.linkedin || prev.linkedin,
      portfolio: data.portfolio || prev.portfolio,
      website: data.website || prev.website,
      desiredJobPosition: data.desiredJobPosition || prev.desiredJobPosition,
      education: data.education || prev.education,
      university: data.university || prev.university,
      description: data.description || prev.description,
      skills: data.skills ? data.skills.join(', ') : prev.skills,
      languages: data.languages ? data.languages.join(', ') : prev.languages,
      hobbies: data.hobbies ? data.hobbies.join(', ') : prev.hobbies,
    }));
    
    // Show success message
    alert('✨ CV information has been automatically filled!');
  };

  const sections = [
    {
      title: "Profile Image",
      fields: [
        { label: "Upload Image", name: "profileImage", type: 'image' as any },
      ],
    },
    {
      title: t('personalInfo'),
      fields: [
        { label: t('fullName'), name: "fullName", type: InputType.TEXT },
        { label: t('email'), name: "email", type: InputType.EMAIL, validation: 'email' },
        { label: t('phone'), name: "phone", type: InputType.TEXT, validation: 'phone' },
        { label: t('address'), name: "address", type: InputType.TEXT },
        { label: t('linkedIn'), name: "linkedin", type: InputType.TEXT },
        { label: t('portfolio'), name: "portfolio", type: InputType.TEXT },
        { label: "Desired Job Position", name: "desiredJobPosition", type: InputType.TEXT },
        { label: "Post Code", name: "postCode", type: InputType.TEXT },
        { label: "City", name: "city", type: InputType.TEXT },
        { label: "Date of Birth", name: "dateOfBirth", type: InputType.DATE },
        { label: "Driver License", name: "driverLicense", type: InputType.TEXT },
        { label: "Gender", name: "gender", type: 'select' as any, options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
        { label: "Nationality", name: "nationality", type: InputType.TEXT },
        { label: "Civil Status", name: "civilStatus", type: InputType.TEXT },
        { label: "Website", name: "website", type: InputType.TEXT },
      ],
    },
    {
      title: t('education'),
      fields: [
        { label: t('education'), name: "education", type: InputType.TEXT },
        { label: "School", name: "school", type: InputType.TEXT },
        { label: t('university'), name: "university", type: InputType.TEXT },
        { label: t('degree'), name: "degree", type: InputType.TEXT },
        { label: t('startDate'), name: "startDate", type: InputType.DATE },
        { label: t('endDate'), name: "endDate", type: InputType.DATE },
        { label: t('description'), name: "description", type: InputType.TEXTAREA },
      ],
    },
    {
      title: "Skills, Languages, Hobbies, Employment, Custom Fields",
      fields: [
        { label: "Skills (comma separated)", name: "skills", type: InputType.TEXT },
        { label: "Languages (comma separated)", name: "languages", type: InputType.TEXT },
        { label: "Hobbies (comma separated)", name: "hobbies", type: InputType.TEXT },
        { label: "Employment (comma separated)", name: "employment", type: InputType.TEXT },
      ],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validation for phone field - only numbers, spaces, +, -, ()
    if (name === 'phone') {
      const phoneRegex = /^[0-9\s+\-()]*$/;
      if (!phoneRegex.test(value)) {
        return; // Don't update if invalid
      }
    }
    
    setResume((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create an image to resize it for better quality
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for high-quality resize
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size (higher resolution for better quality)
          const maxSize = 500; // Increased from typical 200-300
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Use better image smoothing
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to base64 with high quality
            const resizedImage = canvas.toDataURL('image/jpeg', 0.95);
            setResume((prev) => ({ ...prev, profileImage: resizedImage }));
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    try {
      const dataUrl = await toPng(previewRef.current, { 
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 3,
      });
      
      // Wait for image to load
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = dataUrl;
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate scaling to fit the page
      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      pdf.addImage(dataUrl, "PNG", 0, 0, scaledWidth, scaledHeight);
      pdf.save("resume.pdf");

    } catch (error) {
       console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div className="flex flex-col h-full  min-h-screen items-start justify-start bg-zinc-50 font-sans dark:bg-black dark:text-white p-6 gap-6">
      <h1 className="text-3xl font-semibold mb-4">{t('pageTitle')}</h1>
      
      {/* AI CV Parser */}
      <div className="w-full max-w-4xl">
        <CVParser onParsed={handleParsedCV} />
      </div>
      
      {/* Resume Selector */}
      {resumes && resumes.length > 0 && (
        <div className="w-full max-w-md">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Existing Resume (or leave empty to create new)
          </label>
          <select
            value={selectedResumeId || ""}
            onChange={(e) => setSelectedResumeId(e.target.value || null)}
            className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-zinc-800 dark:border-gray-700 dark:text-neutral-200"
          >
            <option value="">-- Create New Resume --</option>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.personalDetails.name || 'Untitled'} (ID: {r.id.substring(0, 8)}...)
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Template Selector */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setSelectedTemplate('classic')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedTemplate === 'classic'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
          }`}
        >
          Classic Template
        </button>
        <button
          onClick={() => setSelectedTemplate('modern')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            selectedTemplate === 'modern'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700'
          }`}
        >
          Modern Template
        </button>
      </div>

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
                {section.fields.map((field: any, i) => (
                  <div key={i} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    {field.type === 'image' ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-zinc-800 dark:border-gray-700 dark:text-neutral-200"
                        />
                        {resume.profileImage && (
                          <img 
                            src={resume.profileImage} 
                            alt="Profile preview" 
                            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-600"
                          />
                        )}
                      </div>
                    ) : field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={resume[field.name as keyof typeof resume] as string || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-zinc-800 dark:border-gray-700 dark:text-neutral-200"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option: string, idx: number) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        inputType={field.type}
                        placeholder={`${field.label}`}
                        value={resume[field.name as keyof typeof resume] as string || ''}
                        onChange={handleChange}
                        className="dark:bg-zinc-800 dark:border-gray-700"
                        {...(field.type !== InputType.TEXTAREA
                          ? { name: field.name }
                          : { name: field.name })}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
  ref={previewRef}
  className="w-full md:w-1/2 bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6 overflow-auto max-h-[700px]"
>
  {selectedTemplate === 'classic' ? (
    // Classic Template
    <div>
      {/* Header */}
      <h3 className="text-2xl font-bold">{resume.fullName || "Your Name"}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {resume.email && `${resume.email} | `}
        {resume.phone && `${resume.phone} | `}
        {resume.address}
      </p>
      <p className="text-sm text-indigo-600 mt-1">
        {resume.linkedin && `LinkedIn: ${resume.linkedin}`}
        {resume.portfolio && ` | Portfolio: ${resume.portfolio}`}
        {resume.website && ` | Website: ${resume.website}`}
      </p>
      {(resume.nationality || resume.civilStatus || resume.driverLicense) && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {resume.nationality && `Nationality: ${resume.nationality}`}
          {resume.nationality && resume.civilStatus && ` | `}
          {resume.civilStatus && `Civil Status: ${resume.civilStatus}`}
          {(resume.nationality || resume.civilStatus) && resume.driverLicense && ` | `}
          {resume.driverLicense && `Driver License: ${resume.driverLicense}`}
        </p>
      )}

      {/* Education */}
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

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold">Skills</h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {resume.skills
              .toString()
              .split(",")
              .map((skill, i) => (
                <li key={i}>{skill.trim()}</li>
              ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold">Languages</h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {resume.languages
              .toString()
              .split(",")
              .map((lang, i) => (
                <li key={i}>{lang.trim()}</li>
              ))}
          </ul>
        </div>
      )}

      {/* Hobbies */}
      {resume.hobbies && resume.hobbies.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold">Hobbies</h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {resume.hobbies
              .toString()
              .split(",")
              .map((hob, i) => (
                <li key={i}>{hob.trim()}</li>
              ))}
          </ul>
        </div>
      )}

      {/* Employment */}
      {resume.employment && resume.employment.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold">Employment</h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {resume.employment
              .toString()
              .split(",")
              .map((emp, i) => (
                <li key={i}>{emp.trim()}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  ) : (
    // Modern Template
    <div className="grid grid-cols-3 gap-6">
      {/* Left Sidebar */}
      <div className="col-span-1 bg-indigo-900 text-white p-4 rounded-lg">
        {/* Profile */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-indigo-700 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold overflow-hidden">
            {resume.profileImage ? (
              <img 
                src={resume.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{resume.fullName ? resume.fullName[0].toUpperCase() : "?"}</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-center">{resume.fullName || "Your Name"}</h3>
          <p className="text-sm text-center text-indigo-300 mt-1">{resume.desiredJobPosition || "Job Position"}</p>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h4 className="text-sm font-bold uppercase mb-2 border-b border-indigo-700 pb-1">Contact</h4>
          <div className="space-y-2 text-sm">
            {resume.phone && <p>📞 {resume.phone}</p>}
            {resume.email && <p>📧 {resume.email}</p>}
            {resume.address && <p>📍 {resume.address}</p>}
            {resume.linkedin && <p>🔗 {resume.linkedin}</p>}
            {resume.website && <p>🌐 {resume.website}</p>}
            {resume.nationality && <p>🌍 {resume.nationality}</p>}
            {resume.civilStatus && <p>💑 {resume.civilStatus}</p>}
            {resume.driverLicense && <p>🚗 {resume.driverLicense}</p>}
          </div>
        </div>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-bold uppercase mb-2 border-b border-indigo-700 pb-1">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {resume.skills
                .toString()
                .split(",")
                .map((skill, i) => (
                  <span key={i} className="bg-indigo-700 px-2 py-1 rounded text-xs">
                    {skill.trim()}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {resume.languages && resume.languages.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-bold uppercase mb-2 border-b border-indigo-700 pb-1">Languages</h4>
            <ul className="space-y-1 text-sm">
              {resume.languages
                .toString()
                .split(",")
                .map((lang, i) => (
                  <li key={i}>• {lang.trim()}</li>
                ))}
            </ul>
          </div>
        )}

        {/* Hobbies */}
        {resume.hobbies && resume.hobbies.length > 0 && (
          <div>
            <h4 className="text-sm font-bold uppercase mb-2 border-b border-indigo-700 pb-1">Hobbies</h4>
            <ul className="space-y-1 text-sm">
              {resume.hobbies
                .toString()
                .split(",")
                .map((hobby, i) => (
                  <li key={i}>• {hobby.trim()}</li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="col-span-2">
        {/* Education */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-indigo-900 dark:text-indigo-400 mb-3 border-b-2 border-indigo-900 dark:border-indigo-400 pb-1">
            Education
          </h4>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {resume.degree} {resume.degree && resume.university && " - "} {resume.university}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {resume.startDate} {resume.startDate && resume.endDate && " - "} {resume.endDate}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
              {resume.description}
            </p>
          </div>
        </div>

        {/* Employment */}
        {resume.employment && resume.employment.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xl font-bold text-indigo-900 dark:text-indigo-400 mb-3 border-b-2 border-indigo-900 dark:border-indigo-400 pb-1">
              Experience
            </h4>
            <ul className="space-y-2">
              {resume.employment
                .toString()
                .split(",")
                .map((emp, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300 text-sm">
                    • {emp.trim()}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )}
</div>
      </div>
      
      <div className="flex justify-end mb-4 gap-2">
        <Button title="Download PDF" onClick={handleDownloadPDF} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"/>
        <Button title={loading ? "Adding..." : "Add Resume"} onClick={handleAddResume} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" disabled={loading}/>
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}
