import { useState } from "react";

export default function TextExpander({ children = "", collapsedNumWords = 10, expandButtonText="Show more", collapseButtonText="Collapse text", buttonColor="#1f09cd", expanded = false, className = "" }) {
  const [collapsed, setCollapsed] = useState(!expanded);

  const longText = children;
  const shortText = children.split(' ').slice(0, collapsedNumWords).join(' ') + '...';

  const buttonStyle = {
    border: "none",
    background: "none",
    color: buttonColor,
    marginLeft: '6px',
    font: 'inherit',
    cursor: "pointer",
  }

  return (
    <div className={className}>
      <span>{collapsed ? shortText : longText}</span>
      <button style={buttonStyle} onClick={() => setCollapsed(!collapsed)}>{collapsed ? expandButtonText : collapseButtonText}</button>
    </div>

  );
}