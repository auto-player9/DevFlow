'use client'
// InitializedMDXEditor.tsx

import {
    MDXEditor,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    CodeToggle,
    InsertCodeBlock,
    codeBlockPlugin,
    headingsPlugin,
    listsPlugin,
    linkPlugin,
    quotePlugin,
    markdownShortcutPlugin,
    ListsToggle,
    linkDialogPlugin,
    thematicBreakPlugin,
    CreateLink,
    InsertImage,
    InsertTable,
    tablePlugin,
    imagePlugin,
    codeMirrorPlugin,
    ConditionalContents,
    ChangeCodeMirrorLanguage,
    Separator,
    InsertThematicBreak,
    diffSourcePlugin,
    MDXEditorMethods,
} from "@mdxeditor/editor";
import {basicDark} from "cm6-theme-basic-dark";
import {useTheme} from "next-themes";
import {ForwardedRef} from "react";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

interface Props {
    value: string;
    fieldChange: (value: string) => void;
    editorRef: ForwardedRef<MDXEditorMethods> | null;
}


export default function Editor({value, fieldChange, editorRef, ...props}: Props) {
    const {resolvedTheme} = useTheme()
    const Theme = resolvedTheme === 'dark' ? [basicDark] : []
    return (
        <MDXEditor
            key={resolvedTheme}
            markdown={value}
            ref={editorRef}
            onChange={fieldChange}
            className="grid background-light800_dark200 light-border-2 markdowm-editor dark-editor w-full border"
            contentEditableClassName="prose dark:prose-invert max-w-none min-h-[400px]"
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                quotePlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                imagePlugin(),
                codeBlockPlugin({defaultCodeBlockLanguage: ""}),
                codeMirrorPlugin({
                    codeBlockLanguages: {
                        css: "css",
                        txt: "txt",
                        sql: "sql",
                        html: "html",
                        sass: "sass",
                        scss: "scss",
                        bash: "bash",
                        json: "json",
                        js: "javascript",
                        ts: "typescript",
                        "": "unspecified",
                        tsx: "TypeScript (React)",
                        jsx: "JavaScript (React)",
                    },
                    autoLoadLanguageSupport: true,
                    codeMirrorExtensions: Theme,
                }),
                diffSourcePlugin({viewMode: "rich-text", diffMarkdown: ""}),
                toolbarPlugin({
                    toolbarContents: () => (
                        <ConditionalContents
                            options={[
                                {
                                    when: (editor) => editor?.editorType === "codeblock",
                                    contents: () => <ChangeCodeMirrorLanguage/>,
                                },
                                {
                                    fallback: () => (
                                        <>
                                            <UndoRedo/>
                                            <Separator/>

                                            <BoldItalicUnderlineToggles/>
                                            <CodeToggle/>
                                            <Separator/>

                                            <ListsToggle/>
                                            <Separator/>

                                            <CreateLink/>
                                            <InsertImage/>
                                            <Separator/>

                                            <InsertTable/>
                                            <InsertThematicBreak/>
                                            <Separator/>

                                            <InsertCodeBlock/>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    ),
                }),
            ]}
        />
    );
};


