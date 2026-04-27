import { useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from 'react-resizable-panels';
import { ThemeProvider } from '@/lib/ThemeContext';
import FloatingControls from '@/components/FloatingControls';
import ConfluenceTopNav from '@/components/theme-preview/ConfluenceTopNav';
import { K15tButton } from '@/components/theme-side-panel/k15t-primitives/k15t-button/K15tButton';
import Portal from '@/pages/Portal';
import Article from '@/pages/Article';
import NotFound from '@/pages/NotFound';

const SIDEBAR_DEFAULT_SIZE = 20.5;
const SIDEBAR_MIN_SIZE = 20.5;
const SIDEBAR_MAX_SIZE = 50;

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<ImperativePanelHandle | null>(null);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <ConfluenceTopNav />

          <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
            <PanelGroup direction="horizontal" style={{ flex: 1, height: '100%' }}>

              {/* ── Sidebar panel ── */}
              <Panel
                ref={sidebarRef}
                defaultSize={SIDEBAR_DEFAULT_SIZE}
                minSize={SIDEBAR_MIN_SIZE}
                maxSize={SIDEBAR_MAX_SIZE}
                collapsible
                collapsedSize={0}
                onCollapse={() => setIsSidebarCollapsed(true)}
                onExpand={() => setIsSidebarCollapsed(false)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  transition: isResizing ? undefined : 'flex-grow 100ms ease-in-out',
                }}
              >
                <FloatingControls />

                {!isSidebarCollapsed && (
                  <K15tButton
                    appearance="secondary-strong"
                    size="s"
                    title="Collapse sidebar"
                    onClick={() => sidebarRef.current?.collapse()}
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: 0,
                      width: '1rem',
                      padding: 0,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      zIndex: 10,
                      justifyContent: 'center',
                      background: 'var(--background-neutral-medium-resting)',
                      borderColor: 'var(--background-neutral-medium-resting)',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      chevron_left
                    </span>
                  </K15tButton>
                )}
              </Panel>

              {/* ── Resize handle ── */}
              <PanelResizeHandle
                onDragging={setIsResizing}
                style={{
                  width: 1,
                  background: 'var(--border-neutral-strong, #dcdfe4)',
                  cursor: 'col-resize',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                }}
              />

              {/* ── Main content panel ── */}
              <Panel style={{ minWidth: 0, overflow: 'hidden' }}>
                <main
                  style={{
                    height: '100%',
                    overflow: 'hidden',
                    background: '#f1f2f4',
                    padding: '0.625rem 0 0.375rem',
                    display: 'flex',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      minHeight: 0,
                      margin: '0 1rem',
                      border: 'var(--border-width-s) solid var(--border-neutral-strong)',
                      borderRadius: 'var(--border-radius-m)',
                      backgroundColor: 'var(--surface-raised-resting)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        minHeight: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        background:
                          'radial-gradient(rgba(0, 0, 0, 0.1) 0.0625rem, transparent 0px) -1.0625rem -1.0625rem / 2rem 2rem #f1f2f4',
                        borderRadius: 'var(--border-radius-m)',
                        overflow: 'auto',
                      }}
                    >
                      <div style={{ width: '100%', minHeight: 0, background: 'var(--surface-default)' }}>
                        <Routes>
                          <Route path="/" element={<Portal />} />
                          <Route path="/article/:appName" element={<Article />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </div>
                  </div>
                </main>
              </Panel>
            </PanelGroup>

            {/* Expand button — visible only when sidebar is collapsed */}
            {isSidebarCollapsed && (
              <K15tButton
                appearance="secondary-strong"
                size="s"
                title="Expand sidebar"
                onClick={() => sidebarRef.current?.expand()}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: 0,
                  width: '1rem',
                  padding: 0,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  zIndex: 10,
                  justifyContent: 'center',
                  background: 'var(--background-neutral-medium-resting)',
                  borderColor: 'var(--background-neutral-medium-resting)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  chevron_right
                </span>
              </K15tButton>
            )}
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
