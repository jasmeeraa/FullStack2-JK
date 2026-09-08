import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarDays,
  Camera,
  Check,
  FileText,
  Filter,
  MessageSquareText,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import PerformanceMonitor from "./components/PerformanceMonitor.jsx";
import "./styles.css";

const PLATFORM_META = {
  Instagram: { color: "#E1306C", badge: "Instagram", icon: Camera },
  Facebook: { color: "#1877F2", badge: "Facebook", icon: MessageSquareText },
  "Twitter/X": { color: "#1DA1F2", badge: "Twitter/X", icon: MessageSquareText },
  LinkedIn: { color: "#0A66C2", badge: "LinkedIn", icon: Briefcase },
};

const STATUS_OPTIONS = ["Draft", "Scheduled", "Published"];

const initialPosts = [
  {
    id: "post-1",
    title: "Weekend Product Launch",
    platform: "Instagram",
    description: "Preview the weekend product drop with teaser visuals and launch countdowns.",
    date: "2026-08-18",
    time: "10:00",
    status: "Scheduled",
    durationMinutes: 90,
  },
  {
    id: "post-2",
    title: "Customer Appreciation Post",
    platform: "Facebook",
    description: "Thank our supporters and share a quick recap of recent milestones.",
    date: "2026-08-20",
    time: "14:30",
    status: "Published",
    durationMinutes: 120,
  },
  {
    id: "post-3",
    title: "New Feature Announcement",
    platform: "Twitter/X",
    description: "Announce the latest feature rollout to the community and invite feedback.",
    date: "2026-08-22",
    time: "09:15",
    status: "Scheduled",
    durationMinutes: 60,
  },
  {
    id: "post-4",
    title: "Industry Insights",
    platform: "LinkedIn",
    description: "Share a short summary of current market trends and practical observations.",
    date: "2026-08-24",
    time: "11:00",
    status: "Draft",
    durationMinutes: 90,
  },
  {
    id: "post-5",
    title: "Behind the Scenes",
    platform: "Instagram",
    description: "Show a quick factory and planning update behind the campaign process.",
    date: "2026-08-28",
    time: "18:30",
    status: "Scheduled",
    durationMinutes: 60,
  },
];

const pad = (value) => String(value).padStart(2, "0");

const formatDateInput = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatTimeInput = (date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

const parseDateTime = (dateString, timeString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

const toDateTimeString = (date) => `${formatDateInput(date)}T${formatTimeInput(date)}:00`;

const formatDateLabel = (dateString) => {
  const date = parseDateTime(dateString, "00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTimeLabel = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const base = new Date();
  base.setHours(hours, minutes, 0, 0);
  return base.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDateTimeLabel = (dateString, timeString) =>
  `${formatDateLabel(dateString)} ${formatTimeLabel(timeString)}`;

const createEmptyForm = (dateString = formatDateInput(new Date())) => ({
  title: "",
  platform: "Instagram",
  description: "",
  date: dateString,
  time: "09:00",
  status: "Draft",
});

const renderEventContent = (eventInfo) => {
  const platform = eventInfo.event.extendedProps.platform || "Instagram";
  const meta = PLATFORM_META[platform] || PLATFORM_META.Instagram;
  const Icon = meta.icon;

  return (
    <div className="fc-post-event" style={{ "--event-accent": meta.color }}>
      <span className="fc-event-badge">
        <Icon size={12} />
      </span>
      <span className="fc-event-text">{eventInfo.event.title}</span>
    </div>
  );
};

const formatRelativeTime = (dateString) => {
  const now = new Date();
  const target = new Date(dateString);
  const diffMinutes = Math.max(0, Math.round((target.getTime() - now.getTime()) / 60000));

  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} days ago`;
};

const CalendarRenderProbe = ({ trackedData, renderCount }) => {
  renderCount.current += 1;
  return null;
};

const MemoizedCalendarRenderProbe = memo(CalendarRenderProbe);
const PostListRenderProbe = CalendarRenderProbe;
const MemoizedPostListRenderProbe = memo(PostListRenderProbe);

function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activityLog, setActivityLog] = useState([
    {
      id: "activity-init",
      action: "System",
      message: "Calendar initialized",
      title: "Scheduler ready",
      stamp: "Aug 16, 2026 9:00 AM",
      type: "info",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState(createEmptyForm());
  const [formError, setFormError] = useState("");
  const [calendarView, setCalendarView] = useState("dayGridMonth");
  const [calendarTitle, setCalendarTitle] = useState("August 2026");
  const [toast, setToast] = useState(null);
  const [optimized, setOptimized] = useState(true);
  const [testUpdate, setTestUpdate] = useState(0);
  const [testState, setTestState] = useState(false);
  const [monitorVersion, setMonitorVersion] = useState(0);
  const calendarRef = useRef(null);
  const calendarRenderCount = useRef(0);
  const postListRenderCount = useRef(0);
  const eventCalculationCount = useRef(0);

  const addActivity = useCallback((action, title, message, type = "info") => {
    const timestamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    setActivityLog((prev) => [
      { id: `${Date.now()}-${Math.random()}`, action, title, message, stamp: timestamp, type },
      ...prev,
    ].slice(0, 7));
  }, []);

  const showToast = useCallback((title, detail, type = "success") => {
    setToast({ id: `${Date.now()}-${Math.random()}`, title, detail, type });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(
    () => ({
      total: posts.length,
      scheduled: posts.filter((post) => post.status === "Scheduled").length,
      drafts: posts.filter((post) => post.status === "Draft").length,
      published: posts.filter((post) => post.status === "Published").length,
    }),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.platform.toLowerCase().includes(query) ||
        post.status.toLowerCase().includes(query);

      const matchesPlatform = selectedPlatform === "all" || post.platform === selectedPlatform;
      const matchesStatus = selectedStatus === "all" || post.status === selectedStatus;

      return matchesQuery && matchesPlatform && matchesStatus;
    });
  }, [posts, searchQuery, selectedPlatform, selectedStatus]);

  const createCalendarEvents = useCallback((postsToConvert) => {
    eventCalculationCount.current += 1;
    return postsToConvert.map((post) => {
        const start = parseDateTime(post.date, post.time);
        const end = addMinutes(start, post.durationMinutes ?? 60);
        const meta = PLATFORM_META[post.platform] || PLATFORM_META.Instagram;

        return {
          id: String(post.id),
          title: post.title,
          start: toDateTimeString(start),
          end: toDateTimeString(end),
          backgroundColor: meta.color,
          borderColor: meta.color,
          textColor: "#ffffff",
          extendedProps: {
            platform: post.platform,
            description: post.description,
            status: post.status,
          },
        };
      });
  }, []);

  // Optimized mode reuses the real calendar event dataset until filtered posts change.
  const optimizedCalendarEvents = useMemo(
    () => createCalendarEvents(filteredPosts),
    [createCalendarEvents, filteredPosts, monitorVersion]
  );
  // Non-optimized mode deliberately recalculates the actual calendar data on every App render.
  const calendarEvents = optimized ? optimizedCalendarEvents : createCalendarEvents(filteredPosts);

  const upcomingPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => {
      const first = new Date(`${a.date}T${a.time}:00`).getTime();
      const second = new Date(`${b.date}T${b.time}:00`).getTime();
      return first - second;
    });

    return sorted.slice(0, 5);
  }, [posts]);

  const resetPerformanceMonitor = useCallback(() => {
    calendarRenderCount.current = 0;
    postListRenderCount.current = 0;
    eventCalculationCount.current = 0;
    setTestUpdate(0);
    setTestState(false);
    setMonitorVersion((value) => value + 1);
  }, []);

  const handleMonitorTestUpdate = useCallback(() => {
    setTestUpdate((value) => value + 1);
  }, []);

  const handleMonitorStateChange = useCallback(() => {
    setTestState((value) => !value);
  }, []);

  const handleMonitorRecalculate = useCallback(() => {
    setMonitorVersion((value) => value + 1);
  }, []);

  const openCreateModal = useCallback((dateString = formatDateInput(new Date())) => {
    setSelectedPost(null);
    setModalMode("create");
    setFormData(createEmptyForm(dateString));
    setFormError("");
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((post) => {
    setSelectedPost(post);
    setModalMode("edit");
    setFormData({
      title: post.title,
      platform: post.platform,
      description: post.description,
      date: post.date,
      time: post.time,
      status: post.status,
    });
    setFormError("");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setFormError("");
    setSelectedPost(null);
  }, []);

  const applyView = useCallback((viewName) => {
    const calendarApi = calendarRef.current?.getApi?.();
    if (calendarApi) {
      calendarApi.changeView(viewName);
    }
    setCalendarView(viewName);
  }, []);

  const goToToday = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi?.();
    if (calendarApi) {
      calendarApi.today();
    }
  }, []);

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (!formData.title.trim()) {
        setFormError("Please enter a post title.");
        return;
      }

      if (!formData.date || !formData.time) {
        setFormError("Date and time are required.");
        return;
      }

      if (!formData.platform || !formData.status) {
        setFormError("Platform and status are required.");
        return;
      }

      const normalizedPost = {
        id: selectedPost ? selectedPost.id : `post-${Date.now()}`,
        title: formData.title.trim(),
        platform: formData.platform,
        description: formData.description.trim() || "No additional details provided.",
        date: formData.date,
        time: formData.time,
        status: formData.status,
        durationMinutes: selectedPost?.durationMinutes ?? 60,
      };

      if (modalMode === "create") {
        setPosts((prevPosts) => [...prevPosts, normalizedPost]);
        addActivity("Created", normalizedPost.title, `Post scheduled for ${formatDateTimeLabel(normalizedPost.date, normalizedPost.time)}`, "success");
        showToast("Post created successfully", normalizedPost.title, "success");
      } else {
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === selectedPost.id ? normalizedPost : post))
        );
        addActivity("Updated", normalizedPost.title, `Updated ${normalizedPost.platform} post`, "info");
        showToast("Post updated successfully", normalizedPost.title, "success");
      }

      closeModal();
    },
    [addActivity, closeModal, formData, modalMode, selectedPost, showToast]
  );

  const handleDeletePost = useCallback(() => {
    if (!selectedPost) return;

    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== selectedPost.id));
    addActivity("Deleted", selectedPost.title, `Removed ${selectedPost.platform} post from schedule`, "danger");
    showToast("Post deleted successfully", selectedPost.title, "danger");
    closeModal();
  }, [addActivity, closeModal, selectedPost, showToast]);

  const handleEventClick = useCallback(
    (clickInfo) => {
      const post = posts.find((item) => item.id === clickInfo.event.id);
      if (post) openEditModal(post);
    },
    [openEditModal, posts]
  );

  const handleDateClick = useCallback(
    (dateInfo) => {
      openCreateModal(dateInfo.dateStr);
    },
    [openCreateModal]
  );

  const handleEventDrop = useCallback(
    (dropInfo) => {
      const movedPost = posts.find((post) => post.id === dropInfo.event.id);
      if (!movedPost || !dropInfo.event.start) return;

      const newDate = formatDateInput(dropInfo.event.start);
      const newTime = formatTimeInput(dropInfo.event.start);
      const updatedPost = {
        ...movedPost,
        date: newDate,
        time: newTime,
      };

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === movedPost.id ? updatedPost : post))
      );

      const previousLabel = formatDateTimeLabel(movedPost.date, movedPost.time);
      const nextLabel = formatDateTimeLabel(newDate, newTime);
      addActivity("Rescheduled", movedPost.title, `${previousLabel} → ${nextLabel}`, "success");
      showToast("Post rescheduled successfully", `${movedPost.title} → ${nextLabel}`, "success");
    },
    [addActivity, posts, showToast]
  );

  const handleEventResize = useCallback(
    (resizeInfo) => {
      const resizedPost = posts.find((post) => post.id === resizeInfo.event.id);
      if (!resizedPost || !resizeInfo.event.start) return;

      const newDate = formatDateInput(resizeInfo.event.start);
      const newTime = formatTimeInput(resizeInfo.event.start);
      const start = resizeInfo.event.start;
      const end = resizeInfo.event.end || resizeInfo.event.start;
      const durationMinutes = Math.max(30, Math.round((end.getTime() - start.getTime()) / 60000));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === resizedPost.id ? { ...post, date: newDate, time: newTime, durationMinutes } : post
        )
      );

      addActivity("Resized", resizedPost.title, `${formatDateTimeLabel(newDate, newTime)} (${durationMinutes} min)`, "info");
      showToast("Post resized successfully", `${resizedPost.title} → ${durationMinutes} min`, "info");
    },
    [addActivity, posts, showToast]
  );

  return (
    <div className="dashboard-shell">
      <div className="main-panel">
        <header className="main-header">
          <div>
            <p className="header-kicker">Calendar</p>
            <h2>Plan, schedule and manage your social media content</h2>
          </div>
        </header>

        <div className="calendar-toolbar card-panel">
          <div className="toolbar-text">
            <h3>Content Calendar</h3>
            <p>Keep track of all your scheduled social media posts</p>
          </div>

          <div className="calendar-actions">
            <div className="month-nav">
              <button type="button" className="icon-button subtle" onClick={() => calendarRef.current?.getApi?.().prev()} aria-label="Previous month">
                <ArrowLeft size={16} />
              </button>
              <button type="button" className="action-button soft" onClick={goToToday}>Today</button>
              <button type="button" className="icon-button subtle" onClick={() => calendarRef.current?.getApi?.().next()} aria-label="Next month">
                <ArrowRight size={16} />
              </button>
              <span className="month-label">{calendarTitle}</span>
            </div>

            <div className="view-switcher" aria-label="Calendar view selection">
              <button type="button" className={calendarView === "dayGridMonth" ? "segmented active" : "segmented"} onClick={() => applyView("dayGridMonth")}>Month</button>
              <button type="button" className={calendarView === "timeGridWeek" ? "segmented active" : "segmented"} onClick={() => applyView("timeGridWeek")}>Week</button>
              <button type="button" className={calendarView === "timeGridDay" ? "segmented active" : "segmented"} onClick={() => applyView("timeGridDay")}>Day</button>
            </div>

            <button type="button" className="action-button primary" onClick={() => openCreateModal()}>
              <Plus size={16} /> Create Post
            </button>
          </div>
        </div>

        <section className="stats-grid" aria-label="Summary statistics">
          <article className="stat-card card-panel">
            <div className="stat-header">
              <span className="stat-badge neutral"><FileText size={14} /></span>
              <span className="stat-label">Total Posts</span>
            </div>
            <strong>{stats.total}</strong>
            <small>All scheduled content</small>
          </article>

          <article className="stat-card card-panel">
            <div className="stat-header">
              <span className="stat-badge blue"><CalendarDays size={14} /></span>
              <span className="stat-label">Scheduled</span>
            </div>
            <strong>{stats.scheduled}</strong>
            <small>Upcoming posts</small>
          </article>

          <article className="stat-card card-panel">
            <div className="stat-header">
              <span className="stat-badge amber"><Pencil size={14} /></span>
              <span className="stat-label">Drafts</span>
            </div>
            <strong>{stats.drafts}</strong>
            <small>Needs attention</small>
          </article>

          <article className="stat-card card-panel">
            <div className="stat-header">
              <span className="stat-badge green"><Check size={14} /></span>
              <span className="stat-label">Published</span>
            </div>
            <strong>{stats.published}</strong>
            <small>Successfully published</small>
          </article>
        </section>

        <section className="calendar-layout">
          <div className="calendar-column">
            <div className="search-row card-panel">
              <div className="search-box">
                <Search size={15} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search posts, platform or status"
                />
              </div>

              <div className="filter-group">
                <div className="select-wrap">
                  <Filter size={14} />
                  <select value={selectedPlatform} onChange={(event) => setSelectedPlatform(event.target.value)}>
                    <option value="all">All Platforms</option>
                    {Object.keys(PLATFORM_META).map((platform) => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>

                <div className="select-wrap">
                  <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                    <option value="all">All Status</option>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="calendar-card card-panel">
              {optimized ? (
                <MemoizedCalendarRenderProbe trackedData={filteredPosts} renderCount={calendarRenderCount} />
              ) : (
                <CalendarRenderProbe trackedData={filteredPosts} renderCount={calendarRenderCount} />
              )}
              {filteredPosts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><CalendarDays size={28} /></div>
                  <h4>No posts scheduled</h4>
                  <p>Create your first social media post to start planning your content.</p>
                  <button type="button" className="action-button primary" onClick={() => openCreateModal()}>
                    <Plus size={16} /> Create Post
                  </button>
                </div>
              ) : (
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={false}
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={3}
                  weekends={true}
                  eventDisplay="block"
                  eventContent={renderEventContent}
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  dateClick={handleDateClick}
                  eventDrop={handleEventDrop}
                  eventResize={handleEventResize}
                  eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
                  datesSet={(arg) => {
                    setCalendarView(arg.view.type);
                    setCalendarTitle(arg.view.title);
                  }}
                />
              )}
            </div>
          </div>

          <div className="side-column">
            <PerformanceMonitor
              key={monitorVersion}
              optimized={optimized}
              onModeChange={setOptimized}
              onReset={resetPerformanceMonitor}
              onTestUpdate={handleMonitorTestUpdate}
              onChangeTestState={handleMonitorStateChange}
              onRecalculateEvents={handleMonitorRecalculate}
              testUpdate={testUpdate}
              testState={testState}
              calendarRenders={calendarRenderCount.current}
              postListRenders={postListRenderCount.current}
              eventCalculations={eventCalculationCount.current}
              scheduledPosts={stats.scheduled}
              eventCount={calendarEvents.length}
              renderRefs={{
                calendar: calendarRenderCount,
                postList: postListRenderCount,
                calculations: eventCalculationCount,
              }}
              renderSignal={`${posts.length}-${filteredPosts.length}-${searchQuery}-${selectedPlatform}-${selectedStatus}-${calendarView}-${calendarTitle}-${testUpdate}-${testState}-${optimized}-${monitorVersion}`}
            />

            <div className="side-card card-panel">
              <div className="side-card-header">
                <h4>Recent Activity</h4>
                <span className="live-badge">
                  <span className="live-dot" /> Live State
                </span>
              </div>

              <div className="activity-list">
                {activityLog.map((item) => {
                  const iconMap = {
                    success: Check,
                    info: CalendarDays,
                    danger: X,
                  };
                  const Icon = iconMap[item.type] || CalendarDays;

                  return (
                    <div className="activity-item" key={item.id}>
                      <div className="activity-icon">
                        <Icon size={14} />
                      </div>
                      <div className="activity-copy">
                        <strong>{item.action}</strong>
                        <span>{item.title}</span>
                        <small>{item.stamp}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="side-card card-panel">
              <div className="side-card-header simple">
                <h4>Upcoming Posts</h4>
              </div>

              <div className="upcoming-list">
                {optimized ? (
                  <MemoizedPostListRenderProbe trackedData={posts} renderCount={postListRenderCount} />
                ) : (
                  <PostListRenderProbe trackedData={posts} renderCount={postListRenderCount} />
                )}
                {upcomingPosts.map((post) => {
                  const meta = PLATFORM_META[post.platform] || PLATFORM_META.Instagram;
                  const Icon = meta.icon;

                  return (
                    <div className="upcoming-item" key={post.id}>
                      <div className="upcoming-icon" style={{ background: meta.color }}>
                        <Icon size={14} />
                      </div>
                      <div className="upcoming-copy">
                        <strong>{post.title}</strong>
                        <span>{formatDateLabel(post.date)} · {formatTimeLabel(post.time)}</span>
                      </div>
                      <span className="status-pill">{post.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="modal-kicker">{modalMode === "create" ? "Create" : "Edit"}</p>
                <h3>{modalMode === "create" ? "Create New Post" : "Edit Post"}</h3>
              </div>
              <button type="button" className="close-button" onClick={closeModal} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="post-form">
              <div className="field-group full-width">
                <label htmlFor="title">Post Title</label>
                <input id="title" name="title" value={formData.title} onChange={handleFormChange} placeholder="Weekend Product Launch" />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="platform">Platform</label>
                  <select id="platform" name="platform" value={formData.platform} onChange={handleFormChange}>
                    {Object.keys(PLATFORM_META).map((platform) => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" value={formData.status} onChange={handleFormChange}>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="date">Date</label>
                  <input id="date" name="date" type="date" value={formData.date} onChange={handleFormChange} />
                </div>

                <div className="field-group">
                  <label htmlFor="time">Time</label>
                  <input id="time" name="time" type="time" value={formData.time} onChange={handleFormChange} />
                </div>
              </div>

              <div className="field-group full-width">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleFormChange} placeholder="Write a short summary for this post..." />
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="modal-actions">
                {modalMode === "edit" && (
                  <button type="button" className="action-button danger" onClick={handleDeletePost}>
                    <Trash2 size={15} /> Delete
                  </button>
                )}

                <div className="action-group">
                  <button type="button" className="action-button ghost" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="action-button primary">
                    {modalMode === "create" ? "Create Post" : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" ? <Check size={16} /> : toast.type === "danger" ? <X size={16} /> : <CalendarDays size={16} />}
          </div>
          <div className="toast-copy">
            <strong>{toast.title}</strong>
            <span>{toast.detail}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
