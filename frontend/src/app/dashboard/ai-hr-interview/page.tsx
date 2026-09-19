import { redirect } from 'next/navigation';

export default function AIHRInterviewPage() {
  // Redirect to the setup page by default when accessing the root route
  redirect('/dashboard/ai-hr-interview/setup');
}
