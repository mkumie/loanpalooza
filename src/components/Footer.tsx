import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/58b13019-da3c-47e4-8458-ebac6ebf7cee.png" 
                alt="YES Finance Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-primary">YES Finance</span>
            </div>
            <p className="text-sm text-gray-600">
              Your trusted partner in financial solutions. We provide accessible and affordable loans to help you achieve your goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/apply" className="text-sm text-gray-600 hover:text-primary">
                  Apply for Loan
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>PO BOX 7820, BOROKO, NCD, PAPUA NEW GUINEA</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 mt-1 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>(675) 75100777</span>
                  <span>(675) 7975 5100</span>
                  <span>(675) 432 2777</span>
                </div>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>yesfinance20@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM
              </li>
              <li className="text-sm text-gray-600">
                Saturday: 10:00 AM - 2:00 PM
              </li>
              <li className="text-sm text-gray-600">
                Sunday: Closed
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} YES Finance. All rights reserved.
            </div>
            <div className="flex items-center text-sm text-gray-600">
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
        </div>
      </div>
    </footer>
  );
};