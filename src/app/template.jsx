export default async function Template({ children }) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return children;
}
