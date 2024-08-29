import React from "react";
import { Sidebar, SidebarItem } from "./Sidebar";
import { Boxes, UserCircle, BarChart3, LayoutDashboard } from "lucide-react";

function CompleteSidebar({ isActive }) {
  return (
    <Sidebar>
      <SidebarItem
        icon={<LayoutDashboard size={20} />}
        text="Dashboard"
        active={isActive === "dashboard" ? true : false}
        naviLink="dashboard"
      />
      <SidebarItem
        icon={<BarChart3 size={20} />}
        text="Register Visitor"
        active={isActive === "registerVisitor" ? true : false}
        naviLink="register_visitor"
      />
      <SidebarItem
        icon={<UserCircle size={20} />}
        text="Checkout Visitor"
        active={isActive === "checkoutVisitor" ? true : false}
        naviLink="checkout_visitor"
      />
      <SidebarItem
        icon={<Boxes size={20} />}
        text="Visitor Details"
        active={isActive === "visitorDetails" ? true : false}
        naviLink="visitor_details"
      />
    </Sidebar>
  );
}

export default CompleteSidebar;
