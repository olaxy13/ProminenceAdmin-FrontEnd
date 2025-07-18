
// import { useState } from "react";
// import 'react-quill/dist/quill.snow.css';
// import 'quill-emoji/dist/quill-emoji.css';
// import ReactQuill from 'react-quill';
// import Quill from 'quill';
// import 'quill-emoji/dist/quill-emoji.css';
// import { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } from 'quill-emoji';

// Quill.register({
//   'formats/emoji': EmojiBlot,
//   'modules/emoji-toolbar': ToolbarEmoji,
//   'modules/emoji-textarea': TextAreaEmoji,
//   'modules/emoji-shortname': ShortNameEmoji,
// }, true);

// const modules = {
//   toolbar: [
//     ['bold', 'italic', 'underline', 'strike'],
//     ['blockquote'],
//     [{ 'header': 1 }, { 'header': 2 }],
//     [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//     [{ 'align': [] }],
//     ['link', 'image', 'video'],
//     ['emoji'],
//     ['clean']
//   ],
//   emoji: {
//     emojiToolbar: true,
//     emojiTextArea: false,
//     emojiShortname: true,
//   }
// };

// const formats = [
//   'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
//   'list', 'bullet', 'link', 'image', 'video', 'align', 'emoji'
// ];

// export default function QuillEditor() {
//   const [value, setValue] = useState('');

//   return (
//     <div className="my-4">
//       <ReactQuill
//         theme="snow"
//         value={value}
//         onChange={setValue}
//         modules={modules}
//         formats={formats}
//         placeholder="Describe your service"
//         className="custom-quill-editor"
//       />
//     </div>
//   );
// }
