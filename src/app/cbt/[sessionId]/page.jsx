import CbtSessionShell from './CbtSessionShell';

export default async function Page({ params }) {
  const { sessionId } = await params;
  return <CbtSessionShell sessionId={sessionId} />;
}
