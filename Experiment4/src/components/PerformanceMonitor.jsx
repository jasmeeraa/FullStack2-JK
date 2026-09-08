import { useEffect, useState } from "react";
import { Check, RotateCcw, X, Zap } from "lucide-react";

const RenderingIndicator = ({ label, enabled }) => (
  <div className="rendering-indicator">
    <span>{label}</span>
    <strong className={enabled ? "indicator-active" : "indicator-disabled"}>
      {enabled ? <Check size={15} /> : <X size={15} />}
      {enabled ? "Active" : "Disabled"}
    </strong>
  </div>
);

const PerformanceMetricCard = ({ label, value, detail }) => (
  <article className="performance-metric-card">
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{detail}</small>
  </article>
);

function PerformanceMonitor({
  optimized,
  onModeChange,
  onReset,
  onTestUpdate,
  onChangeTestState,
  onRecalculateEvents,
  testUpdate,
  testState,
  calendarRenders,
  postListRenders,
  eventCalculations,
  scheduledPosts,
  eventCount,
  renderRefs,
  renderSignal,
}) {
  const [metricSnapshot, setMetricSnapshot] = useState({
    calendar: calendarRenders,
    postList: postListRenders,
    calculations: eventCalculations,
  });

  // Probes update refs while the real scheduler renders; snapshot them after commit without a render loop.
  useEffect(() => {
    setMetricSnapshot({
      calendar: renderRefs.calendar.current,
      postList: renderRefs.postList.current,
      calculations: renderRefs.calculations.current,
    });
  }, [renderRefs, renderSignal]);

  return (
    <section className="performance-panel card-panel" aria-labelledby="performance-monitor-title">
      <header className="performance-header">
        <div>
          <p className="header-kicker">Performance Monitor</p>
          <h2 id="performance-monitor-title">React Rendering Optimization</h2>
          <p className="performance-intro">Monitoring the live calendar, filters, and post data.</p>
        </div>
        <button type="button" className="action-button soft" onClick={onReset}>
          <RotateCcw size={15} /> Reset
        </button>
      </header>

      <div className="performance-toggle" aria-label="Rendering mode">
        <button type="button" className={optimized ? "active" : ""} onClick={() => onModeChange(true)}>
          Optimized
        </button>
        <button type="button" className={!optimized ? "active" : ""} onClick={() => onModeChange(false)}>
          Non-Optimized
        </button>
      </div>

      <div className="optimization-list" aria-label="Optimization status">
        <RenderingIndicator label="React.memo" enabled={optimized} />
        <RenderingIndicator label="useMemo" enabled={optimized} />
        <RenderingIndicator label="useCallback" enabled={optimized} />
      </div>

      <div className="performance-metrics">
        <PerformanceMetricCard label="Calendar Renders" value={metricSnapshot.calendar} detail="Live calendar updates" />
        <PerformanceMetricCard label="PostList Renders" value={metricSnapshot.postList} detail="Live post list updates" />
        <PerformanceMetricCard label="Event Calculations" value={metricSnapshot.calculations} detail={`${eventCount} visible events`} />
        <PerformanceMetricCard label="Scheduled Posts" value={scheduledPosts} detail="From live scheduler data" />
      </div>

      <div className={`performance-banner ${optimized ? "success" : "warning"}`}>
        <Zap size={17} />
        <span>{optimized ? "Optimized rendering is enabled" : "Non-optimized rendering is enabled"}</span>
      </div>

      <div className="rendering-test">
        <div className="section-heading">
          <div>
            <p className="header-kicker">Rendering Test</p>
            <h3>Trigger updates to compare render behavior</h3>
          </div>
          <span className="test-state">Updates: {testUpdate} · State: {testState ? "On" : "Off"}</span>
        </div>
        <div className="rendering-actions">
          <button type="button" className="action-button primary" onClick={onTestUpdate}>Add Test Update</button>
          <button type="button" className="action-button soft" onClick={onChangeTestState}>Change Test State</button>
          <button type="button" className="action-button soft" onClick={onRecalculateEvents}>Recalculate Events</button>
        </div>
        <p className="monitor-live-note">Monitoring live application rendering</p>
      </div>
    </section>
  );
}

export default PerformanceMonitor;
