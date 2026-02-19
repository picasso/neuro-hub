# FileUploader

- **Drag & drop** via `react-dropzone`
- **Custom file picker UI** (no native `Browse…` button)

The file dialog is opened by clicking a read-only MUI `TextField`, while the actual `<input type="file">` is the hidden input provided by `react-dropzone`.

## Usage

```tsx
import { FileUploader } from '@/components/ui'

const [file, setFile] = useState<File | null>(null)

<FileUploader
  value={file}
  onChangeAction={setFile}
  title="Portfolio"
  placeholder="Pick a portfolio media file"
  accept={{
    'image/*': [],
    'video/*': [],
    'audio/*': [],
    'application/pdf': [],
  }}
  maxSizeBytes={50 * 1024 * 1024}
  helperText="Supported: image/video/audio/pdf. Limit: 50MB."
/>
```

## Props

- **`value: File | null`**: selected file (controlled).
- **`onChangeAction(file)`**: selection callback.
- **`disabled?: boolean`**: disables both DnD and picking.
- **`accept?: Accept`**: allowed types (react-dropzone format).
- **`maxSizeBytes?: number`**: maximum file size in bytes.
- **`helperText?: string`**: hint text under the picker.
- **`dropOnly?: boolean`**: hides the picker field and keeps only the dropzone.
- **`placeholder?: string`**: placeholder for the picker field.
- **`title?: string`**: dropzone title text.
- **`titleIcon?: IconName | false`**: dropzone title icon (`false` disables it).

## Behavior

- **Open dialog**: click the read-only `TextField` (or press Enter/Space).
- **Clear**: the clear icon is shown when `value !== null` and triggers `onChangeAction(null)`.

## Reset

This component is controlled. To reset the selection, set `value={null}`.
