export default async function Template({ children }) {
  await new Promise((resolve) => setTimeout(resolve, 6000));
  return children;
}
