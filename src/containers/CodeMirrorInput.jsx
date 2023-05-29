import { useEffect, useRef } from 'react';
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";

function CodeMirrorInput({ value, onChange, onEnter, onNextInput, onPreviousInput }) {
  const editorRef = useRef();

  useEffect(() => {

    const startState = EditorState.create({
      doc: value,
      extensions: [basicSetup, javascript(), autocompletion()]
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
      dispatch: tr => {
        onChange(view.state.doc.toString());
        view.update([tr]);
      }
    });

    // apply key handlers
    view.dom.addEventListener("keydown", (event) => {
      if (event.code === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onEnter();
      } else if (event.code === "ArrowUp" && event.ctrlKey) {
        event.preventDefault();
        onChange(onPreviousInput());
      } else if (event.code === "ArrowDown" && event.ctrlKey) {
        event.preventDefault();
        onChange(onNextInput());
      }
    });
  }, [value, onChange, onEnter, onNextInput, onPreviousInput]);

  return <div ref={editorRef} />;
}
export default CodeMirrorInput;