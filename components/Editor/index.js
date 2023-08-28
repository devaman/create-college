import React, { useState, useEffect, useRef } from 'react';
import './Editor.scss';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { Button } from 'semantic-ui-react';
import twitter from './twitter.js'
import hljs from 'highlight.js'
import 'highlight.js/styles/dracula.css'
import admonitions from 'remarkable-admonitions';
/*
 * Markdown plugin, sets fallback language for fenced code blocks.
 */
function codeDefaultLang(md) {
    const rule = md.renderer.rules.fence;
    md.renderer.rules.fence = function (tokens, idx, options, env, instance) {
        if (!tokens[idx].params && md.options.langDefault) {
            tokens[idx].params = md.options.langDefault;
        }
        return rule.call(this, tokens, idx, options, env, instance);
    };
}
const md = new Remarkable('full', {
    html: true,
    typographer: true,
    langPrefix: 'hljs language-',
    langDefault: 'unknown',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) { }
        }

        try {
            return hljs.highlightAuto(str).value;
        } catch (err) { }

        return '';
    }
}).use(codeDefaultLang).use(linkify).use(admonitions({ icon: 'svg-inline' })).use(twitter);
export const Editor = (props) => {
    const [editor, setEditorView] = useState(true)
    const textareaRef = useRef(null);
    useEffect(() => {
        const textRowCount = textareaRef.current.value.split("\n").length;
        const rows = textRowCount + 1
        textareaRef.current.rows = rows;
        if (window.twttr ? true : false)
            twttr.widgets.load();
    }, [props.value, editor]);
    return (
        <div className="editor">
            <div className="toolbar">
                <Button active={editor} onClick={() => setEditorView(true)}>Editor</Button>
                <Button active={!editor} onClick={() => setEditorView(false)}>Preview</Button>
            </div>
            <textarea
                ref={textareaRef}
                value={props.value}
                placeholder="Start writing"
                style={editor ? { display: "block" } : { display: "none" }}
                name={props.name}
                onChange={props.onChange}></textarea>
            <div className="preview markdown" style={!editor ? { display: "block" } : { display: "none" }} dangerouslySetInnerHTML={{ __html: md.render(props.value) }}></div>
        </div>
    )
}
export const Viewer = (props) => {
    return (
        <div className="md-viewer markdown">
            <div dangerouslySetInnerHTML={{ __html: md.render(props.value) }}></div>
        </div>
    )
}