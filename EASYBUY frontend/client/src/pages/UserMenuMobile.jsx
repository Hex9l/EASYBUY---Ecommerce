import React, { useEffect, useState } from "react";
import UserMenu from "../components/userMenu";
import { IoIosCloseCircle } from "react-icons/io";

const UserMenuMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Tailwind `md` breakpoint
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobile(false);
        setIsOpen(false); // close if switching to desktop
      } else {
        setIsMobile(true);
        setIsOpen(true); // Re-open on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile || !isOpen) return null;
  return (
    <section className="fixed top-35  w-full ">
      <div className="container mx-auto pt-5 flex justify-center">
        <UserMenu dashboard={true} />
      </div>
    </section>

  );
};

export default UserMenuMobile;
