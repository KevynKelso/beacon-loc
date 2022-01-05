import React from "react";
import './Sidebar.css'

export default function Sidebar() {
  return (
    <div className="min-h-full w-64 border-r border-em-primary">
      <h3 className="text-em-primary text-2xl">Contents</h3>
      <ul className="list-disc">
        <li className="mt-5">processRawMessage</li>
        <li className="mt-5">separateDevicesTooFarAway</li>
        <li className="mt-5">convertDevicesToBridges</li>
      </ul>
    </div>
  );
};
