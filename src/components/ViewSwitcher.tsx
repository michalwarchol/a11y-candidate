import { css } from 'styled-system/css';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

import { type ViewId, type ViewOption, views } from '../data/fixtures';

export interface ViewSwitcherProps {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
}

const desktopTabsQuery = '(min-width: 64rem)';

const useHorizontalTabs = (): boolean => {
  const [horizontal, setHorizontal] = useState(() => {
    if (typeof window.matchMedia !== 'function') {
      return true;
    }

    return window.matchMedia(desktopTabsQuery).matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia(desktopTabsQuery);
    const update = () => {
      setHorizontal(media.matches);
    };

    update();

    if (typeof media.addEventListener !== 'function') {
      return;
    }

    media.addEventListener('change', update);
    return () => {
      media.removeEventListener('change', update);
    };
  }, []);

  return horizontal;
};

const tabClass = css({
  alignItems: 'center',
  bg: 'transparent',
  borderBottomColor: 'transparent',
  borderBottomStyle: 'solid',
  borderBottomWidth: 'sm',
  color: 'text.primary',
  cursor: 'pointer',
  display: 'inline-flex',
  justifyContent: 'center',
  px: '4',
  py: '2',
  textStyle: 't_small_b',
  _hover: { color: 'text.link_hover' },
  '&[aria-selected=true]': {
    borderBottomColor: 'border.selected',
    color: 'text.selected',
  },
  _focusVisible: {
    outlineColor: 'focus.default',
    outlineOffset: '0.125rem',
    outlineStyle: 'solid',
    outlineWidth: '0.125rem',
  },
});

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  const horizontal = useHorizontalTabs();
  const tabRefs = useRef(new Map<ViewId, HTMLButtonElement>());

  const focusTab = (viewId: ViewId) => {
    onViewChange(viewId);
    tabRefs.current.get(viewId)?.focus({ focusVisible: true });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = views.findIndex((view) => view.id === activeView);
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
    const previousKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
    let nextIndex = currentIndex;

    if (event.key === nextKey) {
      nextIndex = (currentIndex + 1) % views.length;
    } else if (event.key === previousKey) {
      nextIndex = (currentIndex - 1 + views.length) % views.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = views.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextView = views[nextIndex];
    if (nextView !== undefined) {
      focusTab(nextView.id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Views"
      aria-orientation={horizontal ? undefined : 'vertical'}
      className={css({
        borderBottomColor: 'border.secondary',
        borderBottomStyle: 'solid',
        borderBottomWidth: 'xs',
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        gap: '2',
      })}
      onKeyDown={handleKeyDown}
    >
      {views.map((view: ViewOption) => (
        <button
          key={view.id}
          ref={(node) => {
            if (node === null) {
              tabRefs.current.delete(view.id);
              return;
            }

            tabRefs.current.set(view.id, node);
          }}
          id={`${view.id}-tab`}
          type="button"
          role="tab"
          tabIndex={view.id === activeView ? 0 : -1}
          aria-selected={view.id === activeView}
          aria-controls={`${view.id}-panel`}
          className={tabClass}
          onClick={() => onViewChange(view.id)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}

ViewSwitcher.displayName = 'ViewSwitcher';
