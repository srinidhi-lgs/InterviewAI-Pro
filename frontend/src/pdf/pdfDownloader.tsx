import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumeDocument } from './ResumeDocument';
import { BuilderResume } from '@/store/builderStore';
import { InterviewReportDocument } from './InterviewReportDocument';

export const downloadResumePdf = async (resume: BuilderResume) => {
  try {
    // Generate the PDF blob using the ResumeDocument component
    // Cast to any to satisfy @react-pdf/renderer DocumentProps type requirements
    const blob = await pdf((<ResumeDocument resume={resume} />) as any).toBlob();
    
    // Create a temporary object URL
    const url = URL.createObjectURL(blob);
    
    // Format the filename
    let filename = 'Resume.pdf';
    if (resume.fullName && resume.fullName.trim().length > 0) {
      const sanitizedName = resume.fullName.trim().replace(/\s+/g, '_');
      filename = `${sanitizedName}_Resume.pdf`;
    }

    // Trigger native browser download without print dialog
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`PDF downloaded successfully: ${filename}`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
};

export const downloadInterviewReportPdf = async (report: any) => {
  try {
    const blob = await pdf((<InterviewReportDocument report={report} />) as any).toBlob();
    const url = URL.createObjectURL(blob);
    
    let filename = `AI_Interview_Report_${report.jobRole.replace(/\s+/g, '_')}.pdf`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Report PDF downloaded successfully: ${filename}`);
  } catch (error) {
    console.error('Failed to generate Report PDF:', error);
  }
};
