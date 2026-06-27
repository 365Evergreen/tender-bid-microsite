/**
 * FileDropZone — drag-and-drop file picker built on Fluent UI primitives.
 *
 * Visual states: idle (parchment), hover/dragover (gold tint), focus
 * (deep slate ring). Accessible: keyboard-activatable, aria-described.
 */

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { makeStyles, tokens, Button } from '@fluentui/react-components';
import { ArrowUpload20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    border: '2px dashed #C5D0DA',
    borderRadius: '4px',
    padding: tokens.spacingVerticalXXL,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    transition: 'all 120ms ease',
    cursor: 'pointer',
  },
  dragging: {
    borderTopColor: '#B8860B',
      borderRightColor: '#B8860B',
      borderBottomColor: '#B8860B',
      borderLeftColor: '#B8860B',
    backgroundColor: '#FCF6E6',
  },
  focused: {
    borderTopColor: '#1A2B3C',
      borderRightColor: '#1A2B3C',
      borderBottomColor: '#1A2B3C',
      borderLeftColor: '#1A2B3C',
    outline: '2px solid #B8860B',
    outlineOffset: '2px',
  },
  icon: {
    color: '#5A7186',
    fontSize: '32px',
    marginBottom: tokens.spacingVerticalS,
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '18px',
    fontWeight: 600,
    color: '#1A2B3C',
    marginBottom: tokens.spacingVerticalXS,
  },
  hint: {
    color: '#5A7186',
    fontSize: '13px',
    marginBottom: tokens.spacingVerticalM,
  },
  hiddenInput: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    opacity: 0,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
  },
});

export interface FileDropZoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
  title?: string;
  hint?: string;
}

export function FileDropZone({
  accept,
  multiple = true,
  maxSizeMB,
  disabled = false,
  onFiles,
  title = 'Drop files here, or click to browse',
  hint,
}: FileDropZoneProps) {
  const styles = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const valid: File[] = [];
      for (const f of Array.from(files)) {
        if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) continue;
        valid.push(f);
      }
      if (valid.length > 0) onFiles(valid);
    },
    [maxSizeMB, onFiles],
  );

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const className = [
    styles.root,
    dragging && !disabled ? styles.dragging : '',
    focused ? styles.focused : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label
      className={className}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-disabled={disabled}
    >
      <ArrowUpload20Regular className={styles.icon} />
      <div className={styles.title}>{title}</div>
      {hint && <div className={styles.hint}>{hint}</div>}
      <Button
        appearance="primary"
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.click();
        }}
        disabled={disabled}
      >
        Browse files
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className={styles.hiddenInput}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        aria-label="Upload files"
      />
    </label>
  );
}