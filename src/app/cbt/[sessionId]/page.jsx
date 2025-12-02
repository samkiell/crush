import CbtSessionShell from './CbtSessionShell';

export default async function Page({ params }) {
  const { sessionId } = await params;
  
  // Parse sessionId: subject-year-topic (e.g., mathematics-1978-all-topics)
  const parts = sessionId.split('-');
  const subject = parts[0];
  const year = parts[1];
  
  return <CbtSessionShell sessionId={sessionId} subject={subject} year={year} />;
}
