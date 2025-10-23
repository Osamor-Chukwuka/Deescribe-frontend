'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { createEditor, Editor, Element as SlateElement, Transforms, Range } from 'slate'
import { Slate, Editable, withReact, DefaultElement, useSlate } from 'slate-react'
import { withHistory, HistoryEditor } from 'slate-history'
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List as ListIcon,
    ListOrdered as ListOrderedIcon,
    Code as CodeIcon,
    Link2,
} from 'lucide-react'

// --- Custom Editor Helpers ---
const LIST_TYPES = ['numbered-list', 'bulleted-list']

// Plugin to handle inline elements like links
const withLinks = editor => {
    const { isInline } = editor

    editor.isInline = element => {
        return element.type === 'link' ? true : isInline(element)
    }

    return editor
}

const CustomEditor = {
    isMarkActive(editor, format) {
        const marks = Editor.marks(editor)
        return marks ? marks[format] === true : false
    },
    toggleMark(editor, format) {
        const isActive = CustomEditor.isMarkActive(editor, format)
        if (isActive) Editor.removeMark(editor, format)
        else Editor.addMark(editor, format, true)
    },
    isBlockActive(editor, format) {
        const [match] = Editor.nodes(editor, { match: n => n.type === format })
        return !!match
    },
    toggleList(editor, format) {
        const isActive = CustomEditor.isBlockActive(editor, format)
        Transforms.unwrapNodes(editor, { match: n => LIST_TYPES.includes(n.type), split: true })
        Transforms.setNodes(
            editor,
            { type: isActive ? 'paragraph' : LIST_TYPES.includes(format) ? 'list-item' : format }
        )
        if (!isActive && LIST_TYPES.includes(format)) {
            Transforms.wrapNodes(editor, { type: format, children: [] })
        }
    },
    isCodeBlockActive(editor) {
        const [match] = Editor.nodes(editor, { match: n => n.type === 'code' })
        return !!match
    },
    toggleCodeBlock(editor) {
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? 'paragraph' : 'code' },
            { match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
        )
    },
    isLinkActive(editor) {
        const [match] = Editor.nodes(editor, { match: n => n.type === 'link' })
        return !!match
    },
    unwrapLink(editor) {
        // Remove the link wrapper but keep its children inline
        Transforms.unwrapNodes(editor, { match: n => n.type === 'link' })
    },
    wrapLink(editor, url, text) {
        if (CustomEditor.isLinkActive(editor)) CustomEditor.unwrapLink(editor)
        const { selection } = editor
        const isCollapsed = selection && Range.isCollapsed(selection)
        const linkNode = { type: 'link', url, children: [{ text }] }

        if (isCollapsed) {
            Transforms.insertNodes(editor, linkNode)
            // Move cursor to AFTER the link
            Transforms.move(editor, { distance: 1, unit: 'offset' })
        } else {
            Transforms.wrapNodes(editor, linkNode, { split: true })
            // Move cursor to AFTER the link
            Transforms.collapse(editor, { edge: 'end' })
            Transforms.move(editor, { distance: 1, unit: 'offset' })
        }
    },
    toggleLink(editor) {
        const isActive = CustomEditor.isLinkActive(editor)
        if (isActive) {
            // Unwrap link and collapse selection to end
            CustomEditor.unwrapLink(editor)
            Transforms.collapse(editor, { edge: 'end' })
            return
        }
        // Prompt for link text and URL
        const selectedText = Editor.string(editor, editor.selection) || ''
        let text = selectedText
        if (!text) {
            text = window.prompt('Enter display text for the link:')
            if (!text) return
        }
        const url = window.prompt('Enter the URL:')
        if (!url) return
        CustomEditor.wrapLink(editor, url, text)
    },
    insertBreakExitLink(editor) {
        // If we're in a link, move cursor outside it before inserting break
        if (CustomEditor.isLinkActive(editor)) {
            // Move to the end of the current link
            const [linkNode] = Editor.nodes(editor, { match: n => n.type === 'link' })
            if (linkNode) {
                const [, linkPath] = linkNode
                const linkEnd = Editor.end(editor, linkPath)
                Transforms.select(editor, linkEnd)
                Transforms.move(editor, { distance: 1, unit: 'offset' })
            }
        }
        Transforms.insertBreak(editor)
    }
}

// --- Rendering Components ---
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

const CodeElement = ({ attributes, children }) => (
    <pre {...attributes} style={{ background: '#000', color: '#ff0', padding: '8px', borderRadius: '4px', overflowX: 'auto' }}>
        <code>{children}</code>
    </pre>
)

const ListElement = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'numbered-list': return <ol {...attributes} className="list-decimal ml-6">{children}</ol>
        case 'bulleted-list': return <ul {...attributes} className="list-disc ml-6">{children}</ul>
        case 'list-item': return <li {...attributes}>{children}</li>
        case 'link': return <a {...attributes} href={element.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{children}</a>
        default: return <DefaultElement {...{ attributes, children, element }} />
    }
}

// --- Toolbar Plugin ---
const Toolbar = () => {
    const editor = useSlate()
    const marks = Editor.marks(editor) || {}
    const isNumbered = CustomEditor.isBlockActive(editor, 'numbered-list')
    const isBulleted = CustomEditor.isBlockActive(editor, 'bulleted-list')
    const isCode = CustomEditor.isCodeBlockActive(editor)
    const isLink = CustomEditor.isLinkActive(editor)

    const buttons = [
        { format: 'bold', icon: <Bold className='size-5' /> },
        { format: 'italic', icon: <Italic className='size-5' /> },
        { format: 'underline', icon: <Underline className='size-5' /> },
        { format: 'strikethrough', icon: <Strikethrough className='size-5' /> },
        { format: 'numbered-list', icon: <ListOrderedIcon className='size-5' /> },
        { format: 'bulleted-list', icon: <ListIcon className='size-5' /> },
        { action: CustomEditor.toggleCodeBlock, icon: <CodeIcon className='size-5' /> },
        { action: CustomEditor.toggleLink, icon: <Link2 className='size-5' /> },
    ]

    return (
        <div className="flex space-x-3 mb-2">
            {buttons.map((btn, i) => {
                const active = btn.format
                    ? btn.format === 'numbered-list' ? isNumbered
                        : btn.format === 'bulleted-list' ? isBulleted
                            : marks[btn.format]
                    : btn.action === CustomEditor.toggleCodeBlock ? isCode
                        : btn.action === CustomEditor.toggleLink ? isLink
                            : false

                return (
                    <button
                        key={i}
                        onMouseDown={e => {
                            e.preventDefault()
                            if (btn.format) {
                                if (LIST_TYPES.includes(btn.format)) CustomEditor.toggleList(editor, btn.format)
                                else CustomEditor.toggleMark(editor, btn.format)
                            } else {
                                btn.action(editor)
                            }
                        }}
                        className={`p-1 border rounded cursor-pointer ${active ? 'bg-teal-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}>
                        {btn.icon}
                    </button>
                )
            })}
        </div>
    )
}


// --- Main Component ---
export const TextArea = ({ content, setContent }) => {
    const [editor] = useState(() => withHistory(withLinks(withReact(createEditor()))))

    // --- Initial Document ---
    const initialValue = useMemo(
        () =>
            JSON.parse(localStorage.getItem('content')) || [
                {
                    type: 'paragraph',
                    children: [{ text: '' }],
                },
            ],
        []
    )

    const renderElement = useCallback(props => {
        if (props.element.type === 'code') return <CodeElement {...props} />
        return <ListElement {...props} />
    }, [])

    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    //handle change
    const handleChange = useCallback((value) => {
        const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
        )
        if (isAstChange) {
            // Save the value to Local Storage and content state.

            const localContent = JSON.stringify(value)
            setContent(value)
            localStorage.setItem('content', localContent)
        }
    }, [localStorage])


    return (
        <div className='min-h-[200px] w-full'>
            <Slate editor={editor} initialValue={initialValue} onChange={(value) => handleChange(value)}>
                <Toolbar />
                <div className='w-full -m-3 py-4'><hr className='-me-4' /></div>
                <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Write here..."
                    className="min-h-[200px] py-4 outline-none"

                    onKeyDown={e => {
                        // Handle Enter key to exit links properly
                        if (e.key === 'Enter' && CustomEditor.isLinkActive(editor)) {
                            e.preventDefault()
                            CustomEditor.insertBreakExitLink(editor)
                            return
                        }

                        if (!e.ctrlKey) return
                        switch (e.key) {
                            case 'b': e.preventDefault(); CustomEditor.toggleMark(editor, 'bold'); break
                            case 'i': e.preventDefault(); CustomEditor.toggleMark(editor, 'italic'); break
                            case 'u': e.preventDefault(); CustomEditor.toggleMark(editor, 'underline'); break
                            case 's': e.preventDefault(); CustomEditor.toggleMark(editor, 'strikethrough'); break
                            case '1': e.preventDefault(); CustomEditor.toggleList(editor, 'numbered-list'); break
                            case '2': e.preventDefault(); CustomEditor.toggleList(editor, 'bulleted-list'); break
                            case '`': e.preventDefault(); CustomEditor.toggleCodeBlock(editor); break
                            case 'k': e.preventDefault(); CustomEditor.toggleLink(editor); break
                            case 'z': e.preventDefault(); HistoryEditor.undo(editor); break
                            case 'y': e.preventDefault(); HistoryEditor.redo(editor); break
                            default: return
                        }
                    }}
                />
            </Slate>
        </div>
    )
}
