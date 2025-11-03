
import { Outlet } from "react-router-dom";
import UserMenu from "../src/components/UserMenu";

const Dashboard = () => {
  return (
    <div className="flex flex-col  ">
      {/* Main Content Section */}
      <div className="container mx-auto px-6   grid lg:grid-cols-[280px_1fr] gap-2">
        
        {/* Left Sidebar - Sticky */}
        <div className="hidden lg:block ">
          <div className="sticky top-30 ">
            <UserMenu dashboard={true}  />
          </div>
        </div>

        {/* Right Content */}
        <main className="  border-slate-300  p-6 min-h-[80vh] ">
          <Outlet />    
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

