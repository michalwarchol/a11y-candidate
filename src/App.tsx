import { css } from 'styled-system/css';
import { Stack } from 'styled-system/jsx';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AlertsModal } from './components/AlertsModal';
import { ResultsTable } from './components/ResultsTable';
import { ScheduleList } from './components/ScheduleList';
import { SessionFilters } from './components/SessionFilters';
import { SiteHeader } from './components/SiteHeader';
import { ViewSwitcher } from './components/ViewSwitcher';
import { copy, filterSessions, type SessionFilterId, sessions, type ViewId } from './data/fixtures';

const schedulePanelClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
});

export function App() {
  const [activeView, setActiveView] = useState<ViewId>('schedule');
  const [activeFilter, setActiveFilter] = useState<SessionFilterId>('all');
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const alertsButtonRef = useRef<HTMLButtonElement>(null);
  const restoreAlertsFocusRef = useRef(false);

  const handleCloseAlerts = useCallback(() => {
    restoreAlertsFocusRef.current = true;
    setIsAlertsOpen(false);
  }, []);

  useEffect(() => {
    if (!isAlertsOpen && restoreAlertsFocusRef.current) {
      restoreAlertsFocusRef.current = false;
      alertsButtonRef.current?.focus();
    }
  }, [isAlertsOpen]);

  const visibleSessions = filterSessions(sessions, activeFilter);

  return (
    <main
      className={css({
        color: 'text.primary',
        maxW: { md: '48rem' },
        mx: 'auto',
        px: { base: '4', md: '8' },
        py: { base: '6', md: '8' },
        w: 'full',
      })}
    >
      <Stack gap="6">
      <SiteHeader
          alertsButtonRef={alertsButtonRef}
          onManageAlerts={() => setIsAlertsOpen(true)}
        />
        {isAlertsOpen && <AlertsModal onClose={handleCloseAlerts} />}
        <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
        <section
          id="schedule-panel"
          role="tabpanel"
          aria-labelledby="schedule-tab"
          hidden={activeView !== 'schedule'}
          className={schedulePanelClass}
        >
          <SessionFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <ScheduleList sessions={visibleSessions} />
        </section>
        <section
          id="results-panel"
          role="tabpanel"
          aria-labelledby="results-tab"
          hidden={activeView !== 'results'}
        >
          <ResultsTable />
        </section>
        <section
          id="medals-panel"
          role="tabpanel"
          aria-labelledby="medals-tab"
          hidden={activeView !== 'medals'}
        >
          <p className={css({ color: 'text.primary', textStyle: 't_medium' })}>{copy.medals}</p>
        </section>
      </Stack>
    </main>
  );
}

App.displayName = 'App';
