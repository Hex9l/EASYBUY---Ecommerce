import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "../components/UserMenu"
import { IoIosCloseCircle } from "react-icons/io";
import { useSelector } from "react-redux";

const UserMenuMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Tailwind `md` breakpoint
  const [isOpen, setIsOpen] = useState(true);
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleClose = () => {
    // We do nothing here because clicking a Link in the menu will naturally navigate away.
    // If we called navigate(-1) here, it might conflict with the Link's navigation.
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobile(false);
        setIsOpen(false); // close if switching to desktop
        navigate("/"); // Redirect to home if switching to desktop while on user menu
      } else {
        setIsMobile(true);
        setIsOpen(true); // Re-open on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  if (!isMobile || !isOpen) return null;
  return (
    <section className="bg-white dark:bg-gray-800 shadow-lg lg:hidden transition-colors duration-300 w-full">
      <div className="container mx-auto py-4 flex justify-center">
        <UserMenu
          dashboard={true}
          close={handleClose}
          closeIcon={<IoIosCloseCircle size={25} onClick={handleBack} className="text-gray-500 hover:text-red-500 transition-colors" />}
        />
      </div>
    </section>

  );
};

export default UserMenuMobile;
