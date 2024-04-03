import React, { useEffect, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'
// import { resizeAllImages } from "./TextEditor.utils";

const defaultToolbar =
  'formatselect | ' +
  'bold italic backcolor | alignleft aligncenter alignright alignjustify |' +
  'link table bullist numlist outdent indent | ' +
  'removeformat | fullscreen | help'

const TextEditor = React.forwardRef(
  (
    {
      id = '',
      name = '',
      placeholder,
      label = '',
      defaultValue = '',
      height = 200,
      onChange,
      onResizeEditor = () => {},
      editable,
      disabled = false,
      toolbar = defaultToolbar,
      menubar = false,
      elementpath = false,
      contextmenu = [],
      className = '',
      ...props
    }: any,
    parentRef,
  ) => {
    const childRef = useRef(null)
    let ref: any = parentRef || childRef

    // const uploadHandler = async (blobInfo:any, success:any, failure:any) => {
    //   // const { base64, blob, blobUri, filename, id, name, uri } = blobInfo;
    //   const formData = new FormData();
    //   formData.append("file", blobInfo.blob());
    //   if (pocId) {
    //     formData.append("pocId", pocId);
    //   }
    //   formData.append("isListable", "false"); // Need to pass this as a string because FormData doesn't support booleans
    //   const { data } = await axios.post("/files/upload", formData, {
    //     headers: { "content-type": "multipart/form-data" }
    //   });
    //   success(data.fileDownloadUrl);
    //   // success("data:image/png;base64," + base64());
    // };

    const updateEditMode = () => {
      const editorElement = ref.current.getElement()
      if (editorElement) {
        const parentEl = editorElement.parentNode
        const toolbarEl = parentEl.getElementsByClassName('tox-editor-header')
        const statusbarEl = parentEl.getElementsByClassName('tox-statusbar')
        if (toolbarEl.length) {
          if (disabled) {
            toolbarEl[0].className += ' !hidden'
          } else {
            toolbarEl[0].className = 'tox-editor-header'
          }
        }
        if (statusbarEl.length) {
          if (disabled) {
            statusbarEl[0].className += ' !hidden'
          } else {
            statusbarEl[0].className = 'tox-statusbar'
          }
        }
        // Forcing the focus on the editor
        // ref.current.getBody().setAttribute("contenteditable", true);
        // ref.current.focus();
      }
    }

    const moveTinyMceInsideHeadlessUiModal = (e: any) => {
      var tinyMceEditorInHeadlessUiModal = document.querySelector(
        '#headlessui-portal-root .tox-tinymce',
      )
      if (tinyMceEditorInHeadlessUiModal) {
        var tinyMceModal = document.querySelector('.tox-tinymce-aux')

        if (tinyMceModal) {
          tinyMceEditorInHeadlessUiModal.insertBefore(
            tinyMceModal,
            tinyMceEditorInHeadlessUiModal.firstChild,
          )
        }
      }

      // removing this event listener, as the job is done!
      document.removeEventListener('focusin', moveTinyMceInsideHeadlessUiModal)
    }

    useEffect(() => {
      if (ref.current) {
        updateEditMode()
      }
    }, [ref.current, disabled])

    return (
      <div className={`relative rounded ${className}`}>
        <label
          htmlFor={id || name}
          className={`absolute duration-300 transform scale-75 z-40 origin-[0] bg-transparent px-3
            text-blue-500 focus:text-blue-600
            peer-focus:px-2 peer-focus:text-blue-600 
            -translate-y-2  peer-focus:-translate-y-2 peer-focus:top-2
            peer-placeholder-shown:scale-100 peer-focus:scale-75  left-1
            ${disabled ? 'top-2' : 'top-12'} 
            `}
        >
          {label}
          {props.required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>

        <Editor
          tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.5/tinymce.min.js"
          onInit={(evt, editor) => {
            ref.current = editor
            // editor.getBody().setAttribute("spellcheck", true);
            if (contextmenu.length) {
              contextmenu.map((ctx: any, i: number) => {
                editor.ui.registry.addMenuItem(
                  ctx.name || `contextmenu-${i + 1}`,
                  {
                    text: ctx.text || 'Context Menu',
                    // context: ctx?.context || "tools",
                    onAction: ctx.action || null,
                  },
                )
              })
            }
            updateEditMode()

            // editor.on("ResizeEditor", debounce(onResizeEditor, 500));

            // // Resizing all images, when pasted
            // editor.on("PastePreProcess", function () {
            //   resizeAllImages(editor);
            // });

            // // Resizing all images, when added via "SetContent"
            // editor.on("SetContent", function () {
            //   resizeAllImages(editor);
            // });

            /*
             * If TinyMCE's modal is outside of a HeadlessUI modal, then we move it inside,
             * so that the Headless' UI focus trap doesn't prevent interaction
             */
            document.addEventListener(
              'focusin',
              moveTinyMceInsideHeadlessUiModal,
            )

            // editor.on("click", redirectToRequirement);
          }}
          onEditorChange={onChange}
          initialValue={defaultValue}
          init={{
            placeholder,
            deprecation_warnings: false,
            selector: 'textarea',
            height,
            toolbar,
            plugins: [
              'image table',
              'fullscreen',
              'table paste help',
              'link',
              'lists',
              'contextmenu',
              'nonbreaking',
              'noneditable',
              'autoresize',
            ],
            menubar,
            image_dimensions: true,
            elementpath,
            branding: false,
            contextmenu: `cut copy paste undo redo selectall | link, linkchecker, image, imagetools, permanentpen, table, spellchecker | ${
              contextmenu.length &&
              contextmenu.map((ctx: any) => ctx.name).join(' ')
            }`,
            content_style: `
            @import url("https://fonts.googleapis.com/css?family=Poppins");
            body { font-family: 'Poppins', 'Roboto', sans-serif; position: relative !important; }
            p { margin: 0; }
            .embeddedObjectTag {
              align-items: center;
              background-color: white;
              box-shadow: 0 1px 1px rgba(9, 30, 66, 0.25), 0 0 1px 1px rgba(9, 30, 66, 0.13);
              border-radius: 4px;
              color: #4a4a4a;
              display: inline-flex;
              /* height: 1.8em; */
              justify-content: center;
              line-height: 1.5;
              padding-left: 2.75em;
              padding-right: 2.75em;
              /* white-space: nowrap; */
              margin-bottom: 5px;
              margin-right: 5px;
              cursor: pointer;
            }

            .grayTag {
              background-color: #dce3e8;
              color: #3e5463;
            }

            .orangeTag {
              background-color: #fcddc7;
              color: #8f3516;
            }

            span[data-object-description]{
              position: relative;
            }

            span[data-object-description]:hover::before{
              content: attr(data-object-description);
              position: absolute;
              top: 24px;
              border-radius: 5px;
              padding: 5px;
              height: auto;
              z-index: 9999 !important;
              width: 185px;
              font-size: 12px;
              background: #f3f3f3;
              border: 1px solid #737373;
              color: #737373;
            }

          `,
            paste_data_images: true,
            // images_upload_handler: uploadHandler,
            nonbreaking_force_tab: true,
          }}
          {...props}
        />
      </div>
    )
  },
)
TextEditor.displayName = 'TextEditor'
export default TextEditor
