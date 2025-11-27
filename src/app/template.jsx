export default async function Template({ children }) {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return children;
}
