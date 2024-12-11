import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-auto py-4 border-t">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center text-sm text-gray-600">
          <span>Developed by </span>
          <Link 
            to="https://yhuwhei.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-primary hover:underline"
          >
            Yhu Whei Tech
          </Link>
        </div>
      </div>
    </footer>
  );
};