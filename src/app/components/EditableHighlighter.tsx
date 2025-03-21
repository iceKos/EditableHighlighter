"use client";

import React, { useEffect, useRef } from "react";
type Props = {
  template: string;
};
export default function EditableHighlighter({ template }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const mockVariable = ["name", "age", "gender", "address"];

  useEffect(() => {
    if (divRef.current) {
    
      const matches = template.match(/{{(.*?)}}/g) || [];
      var highlightedHTML = template
      matches.forEach((match) => {
        // find in mockVariable if found then highlight green not found then highlight red
        const found = mockVariable.includes(match.replace(/{{|}}/g, ""));
        if (!found) {
          highlightedHTML = highlightedHTML.replace(
            match,
            `<span style="color: red;">${match}</span>`
          );
          return;
        } else {
          highlightedHTML = highlightedHTML.replace(
            match,
            `<span style="color: green;">${match}</span>`
          );
        }
      });

      divRef.current.innerHTML = highlightedHTML;
    }
  }, [template]);

  const handleInput = () => {
    const div = divRef.current;
    if (!div) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Save caret position (relative to full text)
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(div);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const caretPos = preCaretRange.toString().length;

    // Process text
    const rawText = div.innerText;

    // Optional: extract variables
    const matches = rawText.match(/{{(.*?)}}/g) || [];

    var highlightedHTML = rawText;
    // .replace(
    //   /{{(.*?)}}/g,
    //   '<span style="color: green;">{{$1}}</span>'
    // );

    matches.forEach((match) => {
      // find in mockVariable if found then highlight green not found then highlight red
      const found = mockVariable.includes(match.replace(/{{|}}/g, ""));
      if (!found) {
        highlightedHTML = highlightedHTML.replace(
          match,
          `<span style="color: red;">${match}</span>`
        );
        return;
      } else {
        highlightedHTML = highlightedHTML.replace(
          match,
          `<span style="color: green;">${match}</span>`
        );
      }
    });

    // Replace with highlighted HTML

    // Update HTML
    div.innerHTML = highlightedHTML;

    // Restore caret position
    setCaretPosition(div, caretPos);
  };

  const setCaretPosition = (el: HTMLElement, offset: number) => {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    let currentOffset = 0;

    const walk = (node: ChildNode): boolean => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (currentOffset + text.length >= offset) {
          range.setStart(node, offset - currentOffset);
          return true;
        }
        currentOffset += text.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const child of node.childNodes) {
          if (walk(child)) return true;
        }
      }
      return false;
    };

    walk(el);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Editable Highlighter</h3>

      {/* Display mockVariable list */}
      <div style={{ marginBottom: "1rem" }}>
        <strong>Mock Variables:</strong>{" "}
        {mockVariable.map((v, i) => (
          <code key={i} style={{ marginRight: "8px" }}>
            {`{{${v}}}`}
          </code>
        ))}
      </div>

      {/* Editable input */}
      <div
        ref={divRef}
        contentEditable
        onInput={handleInput}
        style={{
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
          minHeight: "80px",
          fontSize: "1rem",
          fontFamily: "inherit",
          whiteSpace: "pre-wrap",
        }}
      ></div>
    </div>
  );
}
