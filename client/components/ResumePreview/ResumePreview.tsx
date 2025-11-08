import React from 'react';
import { Resume } from '@/hooks/useAddResume';

interface ResumePreviewProps {
  resume: Resume;
  scale?: number;
}

export default function ResumePreview({ resume, scale = 0.15 }: ResumePreviewProps) {
  const isModern = resume.templateId === 2;

  return (
    <div 
      className="origin-top-left bg-white" 
      style={{ 
        transform: `scale(${scale})`,
        width: '595px', // A4 width in pixels at 72dpi
        height: '842px', // A4 height in pixels at 72dpi
      }}
    >
      {isModern ? (
        // Modern Template Preview
        <div className="grid grid-cols-3 gap-6 p-6 h-full text-black">
          {/* Left Sidebar */}
          <div className="col-span-1 bg-indigo-900 text-white p-4 rounded-lg">
            {/* Profile */}
            <div className="mb-6">
              <div className="w-24 h-24 bg-indigo-700 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl font-bold overflow-hidden">
                {resume.personalDetails.name ? resume.personalDetails.name[0].toUpperCase() : "?"}
              </div>
              <h3 className="text-xl font-bold text-center break-words">{resume.personalDetails.name || "Your Name"}</h3>
              <p className="text-sm text-center text-indigo-300 mt-1">{resume.personalDetails.desiredJobPosition || "Job Position"}</p>
            </div>

            {/* Contact */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase mb-2 border-b border-indigo-700 pb-1">Contact</h4>
              <div className="space-y-1 text-xs">
                {resume.personalDetails.phoneNumber && <p className="truncate">📞 {resume.personalDetails.phoneNumber}</p>}
                {resume.personalDetails.emailAddress && <p className="truncate">📧 {resume.personalDetails.emailAddress}</p>}
                {resume.personalDetails.address && <p className="truncate">📍 {resume.personalDetails.address}</p>}
              </div>
            </div>

            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase mb-2 border-b border-indigo-700 pb-1">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {resume.skills.slice(0, 5).map((skill, i) => (
                    <span key={i} className="bg-indigo-700 px-2 py-0.5 rounded text-[10px]">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {resume.languages && resume.languages.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase mb-2 border-b border-indigo-700 pb-1">Languages</h4>
                <ul className="space-y-1 text-xs">
                  {resume.languages.slice(0, 3).map((lang, i) => (
                    <li key={i} className="truncate">• {lang.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Content */}
          <div className="col-span-2">
            {/* Education */}
            {resume.educations && resume.educations.length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-bold text-indigo-900 mb-2 border-b-2 border-indigo-900 pb-1">
                  Education
                </h4>
                {resume.educations.slice(0, 2).map((edu, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {edu.educationName} - {edu.school}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Employment */}
            {resume.employment && resume.employment.length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-bold text-indigo-900 mb-2 border-b-2 border-indigo-900 pb-1">
                  Experience
                </h4>
                <ul className="space-y-1">
                  {resume.employment.slice(0, 3).map((emp, i) => (
                    <li key={i} className="text-gray-700 text-xs truncate">
                      • {emp.jobTitle}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Classic Template Preview
        <div className="p-6 h-full text-black">
          {/* Header */}
          <h3 className="text-2xl font-bold truncate">{resume.personalDetails.name || "Your Name"}</h3>
          <p className="text-sm text-gray-600 truncate">
            {resume.personalDetails.emailAddress && `${resume.personalDetails.emailAddress} | `}
            {resume.personalDetails.phoneNumber && `${resume.personalDetails.phoneNumber}`}
          </p>
          <p className="text-sm text-indigo-600 mt-1 truncate">
            {resume.personalDetails.linkedIn && `LinkedIn: ${resume.personalDetails.linkedIn}`}
          </p>

          {/* Education */}
          {resume.educations && resume.educations.length > 0 && (
            <div className="mt-4">
              <h4 className="text-base font-semibold border-b border-gray-300">Education</h4>
              {resume.educations.slice(0, 1).map((edu, i) => (
                <div key={i}>
                  <p className="text-gray-700 text-sm truncate">
                    {edu.educationName && `${edu.educationName}, `}
                    {edu.school}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="mt-4">
              <h4 className="text-base font-semibold border-b border-gray-300">Skills</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {resume.skills.slice(0, 5).map((skill, i) => (
                  <li key={i} className="truncate">{skill.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {resume.languages && resume.languages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-base font-semibold border-b border-gray-300">Languages</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {resume.languages.slice(0, 4).map((lang, i) => (
                  <li key={i} className="truncate">{lang.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hobbies */}
          {resume.hobbies && resume.hobbies.length > 0 && (
            <div className="mt-4">
              <h4 className="text-base font-semibold border-b border-gray-300">Hobbies</h4>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {resume.hobbies.slice(0, 4).map((hobby, i) => (
                  <li key={i} className="truncate">{hobby}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
