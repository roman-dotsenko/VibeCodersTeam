import Link from 'next/link';
import React from 'react';
import ResumePreview from '@/components/ResumePreview/ResumePreview';
import { Resume } from '@/hooks/useAddResume';

interface ResumeCardProps {
  id: string;
  name: string;
  resume: Resume;
  onDelete?: (id: string) => void;
}

export default function ResumeCard({ id, name, resume, onDelete }: ResumeCardProps) {

  return (
    <div className="relative group border rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all hover:border-indigo-600 overflow-hidden">
      <Link href={`/dashboard/create-resume?resumeId=${id}`} className="block">
        <div className="flex flex-col">
          {/* Resume Preview/Thumbnail */}
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border-b border-gray-200 dark:border-gray-700">
            {resume ? (
              <div className="w-full h-full flex items-start justify-center pt-4">
                <ResumePreview resume={resume} scale={0.28} />
              </div>
            ) : (
              <div className="text-6xl text-indigo-500">📄</div>
            )}
          </div>
          
          {/* Resume Info */}
          <div className="p-4 text-center">
            {/* Resume Name */}
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2">
              {name}
            </h3>
            
            {/* Resume ID (shortened) */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              ID: {id.substring(0, 8)}...
            </p>
            
            {/* Edit Button */}
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
              View & Edit →
            </span>
          </div>
        </div>
      </Link>
      
      {/* Delete Button (optional) */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            if (confirm(`Are you sure you want to delete "${name}"?`)) {
              onDelete(id);
            }
          }}
          className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          title="Delete resume"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
