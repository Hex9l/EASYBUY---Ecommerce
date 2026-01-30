
import { Outlet } from "react-router-dom";
import UserMenu from "../components/UserMenu";


const Dashboard = () => {
  return (
    <div className="flex flex-col  ">
      {/* Main Content Section */}
      <div className="container mx-auto px-3 md:px-4 lg:px-6 grid lg:grid-cols-[250px_1fr] gap-4">

        {/* Left Sidebar - Sticky */}
        <div className="hidden lg:block border-r border-gray-100">
          <div className="sticky top-24 py-4">
            <UserMenu dashboard={true} />
          </div>
        </div>

        {/* Right Content */}
        <main className="min-h-[75vh] py-4 lg:p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default Dashboard;

