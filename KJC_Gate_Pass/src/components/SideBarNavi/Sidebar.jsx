import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronFirst, ChevronLast, icons, LogOut } from "lucide-react";
import circleLogo from "../../assets/KJC_Logo.svg";
import "./Sidebar.css"; 

const SidebarContext = createContext();
export const Sidebar = ({ children }) => {
  const navigator = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="sidebar">
      <nav className={`sidebar-nav${expanded ? "" : "-collapsed"}`}>
        <div className="sidebar-header">
          <img
            src={circleLogo}
            alt="KJC_logo.svg"
            className={`logo${expanded ? "" : "-collapsed"}`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="collapse-button"
          >
            {expanded ? (
              <ChevronFirst className="collapse-icon" />
            ) : (
              <ChevronLast className="collapse-icon" />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="links-children">{children}</ul>
        </SidebarContext.Provider>

        <div className={`user-profile${expanded ? "" : "-collapsed"}`}>
          <img
            src="https://ui-avatars.com/api/?background=0D8ABC&color=fff"
            alt=""
            className="user-profile-img"
          />
          <div
            className={`user-profile-details${expanded ? "" : "-collapsed"}`}
          >
            <div className="user-profile-details-texts">
              <h4>John Doe</h4>
              <span className="user-profile-details-texts-email">
                johndoe@gmail.com
              </span>
            </div>
            <button
              onClick={() => navigator("/login")}
              className="logout-button"
            >
              <LogOut size={20} className="logout-icon" />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export function SidebarItem({ icon, text, active, alert, naviLink }) {
  const navigate = useNavigate();

  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`sidebar-item group ${active ? "sidebar-item-active" : ""}`}
      onClick={() => navigate(`/${naviLink}`)}
    >
      {icon}
      <span
        className={`sidebar-item-text${expanded ? "-expanded" : "-collapsed"}`}
      >
        {text}
      </span>
      {alert && (
        <div className={`sidebar-item-alert${expanded ? "" : "-collapsed"}`} />
      )}

      {!expanded && (
        <div
          className={`
        absolute left-full rounded-md px-2 py-1 ml-6 w-fit
        bg-indigo-100 text-indigo-800 text-sm
        invisible opacity-20 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
