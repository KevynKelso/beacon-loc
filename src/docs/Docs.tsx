import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"
//@ts-ignore
import GetStartedMD from './getStarted.md'
import ReactMarkdown from 'react-markdown'


export default function Docs() {
  const [markdown, setMarkdown] = useState<string>('')

  useEffect(() => {
    fetch(GetStartedMD).then(res => res.text()).then(text => setMarkdown(text));
  }, [])

  return (
    <div className="bg-gray-100 min-h-full flex pl-32 pr-32">
      <Sidebar />
      <div>
        <ReactMarkdown>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
