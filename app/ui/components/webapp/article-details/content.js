import React, { useState, useMemo } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

// Rendering components (same as your editor but without editing capabilities)
const Leaf = ({ attributes, children, leaf }) => {
    const style = {
        fontWeight: leaf.bold ? 'bold' : undefined,
        fontStyle: leaf.italic ? 'italic' : undefined,
        textDecoration: [leaf.underline && 'underline', leaf.strikethrough && 'line-through']
            .filter(Boolean)
            .join(' '),
    }
    return <span {...attributes} style={style}>{children}</span>
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'numbered-list':
            return <ol {...attributes} className="list-decimal ml-6 my-4">{children}</ol>
        case 'bulleted-list':
            return <ul {...attributes} className="list-disc ml-6 my-4">{children}</ul>
        case 'list-item':
            return <li {...attributes} className="my-1">{children}</li>
        case 'code':
            return (
                <pre {...attributes} className="bg-black text-yellow-400 p-4 rounded-md overflow-x-auto my-4" style={{ whiteSpace: 'pre-wrap' }}>
                    <code>{children}</code>
                </pre>
            )
        case 'link':
            return (
                <a
                    {...attributes}
                    href={element.url}
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            )
        default:
            return <p {...attributes} className="my-4">{children}</p>
    }
}

// Function to group consecutive code blocks
const groupCodeBlocks = (content) => {
    const grouped = []
    let currentCodeGroup = []

    content.forEach((element) => {
        if (element.type === 'code') {
            // Add to current code group
            currentCodeGroup.push(Node.string(element))
        } else {
            // If we have accumulated code lines, create a single code block
            if (currentCodeGroup.length > 0) {
                grouped.push({
                    type: 'code',
                    children: [{ text: currentCodeGroup.join('\n') }]
                })
                currentCodeGroup = []
            }
            // Add the non-code element
            grouped.push(element)
        }
    })

    // Don't forget any remaining code at the end
    if (currentCodeGroup.length > 0) {
        grouped.push({
            type: 'code',
            children: [{ text: currentCodeGroup.join('\n') }]
        })
    }

    return grouped
}

// Read-only Slate content renderer
export const SlateContentRenderer = ({ content }) => {
    const editor = useMemo(() => withReact(createEditor()), [])

    // Ensure content is valid and group consecutive code blocks
    const validContent = useMemo(() => {
        if (!content || !Array.isArray(content)) {
            return [{ type: 'paragraph', children: [{ text: '' }] }]
        }
        return groupCodeBlocks(content)
    }, [content])

    return (
        <div className="prose prose-lg max-w-none">
            <Slate editor={editor} initialValue={validContent} onChange={() => { }}>
                <Editable
                    renderElement={Element}
                    renderLeaf={Leaf}
                    readOnly={true}
                    className="outline-none"
                />
            </Slate>
        </div>
    )
}