const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content/70 rounded-t-3xl">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-base-content">DEVOUR TO CRUSH</h3>
            <p className="text-base-content/70">
              Your ultimate JAMB exam preparation platform.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4 text-base-content">Features</h4>
            <ul className="space-y-2 text-base-content/70">
              <li>Question Bank</li>
              <li>Exam Simulator</li>
              <li>Progress Tracking</li>
              <li>Community Support</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4 text-base-content">Support</h4>
            <ul className="space-y-2 text-base-content/70">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>FAQ</li>
              <li>Terms of Service</li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4 text-base-content">Connect</h4>
            <ul className="space-y-2 text-base-content/70">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-base-content/20 mt-8 pt-8 text-center text-base-content/70">
          <p>&copy; 2025 Crush EduPlace Intl. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
