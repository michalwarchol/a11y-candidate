import { css } from 'styled-system/css';
import { Stack } from 'styled-system/jsx';
import { type KeyboardEvent, useEffect, useRef } from 'react';

import { copy } from '../data/fixtures';

export interface AlertsModalProps {
  onClose: () => void;
}

const titleId = 'alert-preferences-title';

const dialogClass = css({
  bg: 'surface.elevated',
  borderColor: 'border.secondary',
  borderRadius: 'lg',
  borderStyle: 'solid',
  borderWidth: 'xs',
  color: 'text.primary',
  m: 'auto',
  maxW: '24rem',
  p: '6',
  w: 'calc(100% - 2rem)',
  '&::backdrop': {
    bg: 'surface.scrim',
  },
});

const closeButtonClass = css({
  alignSelf: 'flex-start',
  bg: 'surface.base',
  borderColor: 'border.primary',
  borderRadius: 'md',
  borderStyle: 'solid',
  borderWidth: 'xs',
  color: 'text.primary',
  cursor: 'pointer',
  h: '10',
  px: '4',
  textStyle: 't_small_b',
  _hover: { bg: 'surface.subtle' },
  _focusVisible: {
    outlineColor: 'focus.default',
    outlineOffset: '0.125rem',
    outlineStyle: 'solid',
    outlineWidth: '0.125rem',
  },
});

const checkboxClass = css({
  accentColor: 'graphics.brand',
  h: '5',
  w: '5',
  _focusVisible: {
    outlineColor: 'focus.default',
    outlineOffset: '0.125rem',
    outlineStyle: 'solid',
    outlineWidth: '0.125rem',
  },
});

const labelClass = css({
  alignItems: 'center',
  color: 'text.primary',
  cursor: 'pointer',
  display: 'flex',
  gap: '3',
  textStyle: 't_medium',
});

export function AlertsModal({ onClose }: AlertsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const heatChangesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) {
      return;
    }

    dialog.showModal();
    heatChangesRef.current?.focus();

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [onClose]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={dialogClass}
      onKeyDown={handleKeyDown}
    >
      <Stack gap="4">
        <h2 id={titleId} className={css({ color: 'text.primary', textStyle: 'h_small' })}>
          {copy.alertTitle}
        </h2>
        <Stack gap="3">
          <label className={labelClass}>
            <input ref={heatChangesRef} type="checkbox" className={checkboxClass} />
            {copy.heatChanges}
          </label>
          <label className={labelClass}>
            <input type="checkbox" className={checkboxClass} />
            {copy.medalCeremonies}
          </label>
        </Stack>
        <button type="button" className={closeButtonClass} onClick={onClose}>
          {copy.close}
        </button>
      </Stack>
    </dialog>
  );
}

AlertsModal.displayName = 'AlertsModal';
