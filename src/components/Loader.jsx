import { Loader } from 'lucide-react';

const Loader = ({ fullScreen = true }) => {
  return (
    <div className={`flex items-center justify-center w-full ${fullScreen ? 'min-h-[70vh]' : 'h-full'}`}>
      <Loader className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};

export default Loader;
