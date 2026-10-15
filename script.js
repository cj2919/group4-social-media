// ------------------------------
// 1. Mock data (no real database)
// ------------------------------
const image = (id, width = 1000, height = 750) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=85`;

const starterData = {
  currentUser: {
    id: "me",
    username: "mira.codes",
    name: "Mira Chen",
    bio: "Design student, tiny-camera collector, and curious builder. Making ideas feel human ✦",
    avatar: image("1494790108377-be9c29b29330", 240, 240),
    followers: 1284,
    following: 362,
    visibility: "public",
    datingMode: false
  },
  users: [
    { id: "alex", username: "alex.roams", name: "Alex Rivera", avatar: image("1500648767791-00dcc994a43e", 160, 160) },
    { id: "nia", username: "nia.makes", name: "Nia Brooks", avatar: image("1534528741775-53994a69daeb", 160, 160) },
    { id: "leo", username: "leowanders", name: "Leo Kim", avatar: image("1507003211169-0a1dd7228f2d", 160, 160) },
    { id: "sana", username: "sana.studio", name: "Sana Ali", avatar: image("1544005313-94ddf0286df2", 160, 160) },
    { id: "jo", username: "jo.grows", name: "Jo Martins", avatar: image("1531123897727-8f129e1688ce", 160, 160) }
  ],
  stories: [
    { userId: "me", image: image("1517841905240-472988babdf9", 700, 1100), caption: "Starting the day with a sketch and a big idea." },
    { userId: "alex", image: image("1500530855697-b586d89ba3ee", 700, 1100), caption: "A slow morning in a new city ☕" },
    { userId: "nia", image: image("1487412720507-e7ab37603c6f", 700, 1100), caption: "Behind the scenes from today’s color study." },
    { userId: "leo", image: image("1464822759023-fed622ff2c3b", 700, 1100), caption: "Found the best trail just before sunset." },
    { userId: "sana", image: image("1494438639946-1ebd1d20bf85", 700, 1100), caption: "Studio corners that make me happy." },
    { userId: "jo", image: image("1416879595882-3373a0480b5b", 700, 1100), caption: "The balcony garden is thriving!" }
  ],
  posts: [
    { id: 1, userId: "alex", image: image("1511818966892-d7d671e672a2"), caption: "A quiet corner, warm light, and nowhere else to be. This little café understood the assignment.", time: "18 min ago", likes: 428, liked: false, saved: false, shares: 12, comments: [{ user: "nia.makes", text: "The colors are perfect!" }, { user: "mira.codes", text: "Adding this to my list ✦" }] },
    { id: 2, userId: "me", image: image("1558655146-d09347e92766"), caption: "Turning our computational thinking notes into a visual system: repeat, simplify, test, improve.", time: "2 hr ago", likes: 186, liked: true, saved: false, shares: 8, comments: [{ user: "sana.studio", text: "Love seeing the process behind this." }] },
    { id: 3, userId: "nia", image: image("1543076447-215ad9ba6923"), caption: "Color studies from this week. I kept noticing the same warm-cool pattern everywhere I looked.", time: "4 hr ago", likes: 762, liked: false, saved: true, shares: 31, comments: [{ user: "jo.grows", text: "The orange and blue together!" }] },
    { id: 4, userId: "leo", image: image("1500534314209-a25ddb2bd429"), caption: "The long way up was worth every step. Save this trail for a clear weekend.", time: "Yesterday", likes: 1104, liked: false, saved: false, shares: 57, comments: [{ user: "alex.roams", text: "Okay, you convinced me." }, { user: "sana.studio", text: "What a view!" }] },
    { id: 5, userId: "sana", image: image("1524758631624-e2822e304c36"), caption: "A tiny team, a lot of sticky notes, and one very clear goal.", time: "Yesterday", likes: 533, liked: false, saved: false, shares: 19, comments: [] },
    { id: 6, userId: "jo", image: image("1416879595882-3373a0480b5b"), caption: "Proof that small, repeated routines can grow into something beautiful.", time: "2 days ago", likes: 349, liked: false, saved: true, shares: 15, comments: [{ user: "mira.codes", text: "This is such a good reminder." }] }
  ],
  notifications: [
    { id: 1, icon: "♥", text: "Nia liked your post.", time: "5 minutes ago", unread: true, type: "like" },
    { id: 2, icon: "☁", text: "Sana commented: “Love seeing the process!”", time: "24 minutes ago", unread: true, type: "comment" },
    { id: 3, icon: "＋", text: "Leo started following you.", time: "1 hour ago", unread: false, type: "follow" },
    { id: 4, icon: "◎", text: "Alex viewed your profile.", time: "3 hours ago", unread: true, type: "visit" }
  ],
  seenStories: [],
  language: "es"
};

const STORAGE_KEY = "looply-class-project-v1";
let state;
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  state = saved && saved.currentUser && saved.posts ? saved : structuredClone(starterData);
} catch {
  state = structuredClone(starterData);
}

const translations = {
  es: "Una versión traducida simulada: compartiendo un momento, una idea y un poco de inspiración con mi comunidad.",
  fr: "Une traduction simulée : partager un moment, une idée et un peu d’inspiration avec ma communauté.",
  zh: "模拟翻译：与我的社区分享一个瞬间、一个想法和一点灵感。",
  ja: "模擬翻訳：コミュニティと瞬間、アイデア、そして小さなひらめきを共有しています。"
};

let currentView = "home";
let viewHistory = [];
let activeStoryIndex = 0;
let uploadedImage = "";
let toastTimer;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const getUser = (id) => id === "me" ? state.currentUser : state.users.find(user => user.id === id);
const saveState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showToast("Browser storage is full. Try a smaller image.");
  }
};
const formatNumber = number => number >= 1000 ? `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k` : number;
const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);

function showToast(message) {
  clearTimeout(toastTimer);
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

// ------------------------------
// 2. Navigation and page rendering
// ------------------------------
function navigate(view, addToHistory = true) {
  if (view === currentView && $("#homeView.active, #searchView.active, #exploreView.active, #notificationsView.active, #profileView.active")) return;
  if (addToHistory && currentView !== view) viewHistory.push(currentView);
  currentView = view;
  $$(".view").forEach(section => section.classList.toggle("active", section.id === `${view}View`));
  $$('[data-view]').forEach(button => button.classList.toggle("active", button.dataset.view === view && button.classList.contains("nav-item")));
  $("#pageTitle").textContent = view[0].toUpperCase() + view.slice(1);
  $("#backButton").classList.toggle("hidden", viewHistory.length === 0 || view === "home");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "profile") renderProfile();
  if (view === "notifications") renderNotifications();
  if (view === "explore") renderExplore();
  if (view === "search") setTimeout(() => $("#searchInput").focus(), 100);
}

function goBack() {
  const previous = viewHistory.pop() || "home";
  navigate(previous, false);
}

function renderStories() {
  $("#storiesBar").innerHTML = state.stories.map((story, index) => {
    const user = getUser(story.userId);
    const seen = state.seenStories.includes(index);
    return `<button class="story-button" data-story="${index}"><span class="story-ring ${seen ? "seen" : ""}"><img src="${user.avatar}" alt="${escapeHTML(user.name)}"></span><small>${story.userId === "me" ? "Your story" : escapeHTML(user.username.split(".")[0])}</small></button>`;
  }).join("");
}

function postTemplate(post) {
  const user = getUser(post.userId);
  const isOwn = post.userId === "me";
  return `<article class="post-card" data-post-id="${post.id}">
    <header class="post-header">
      <img class="avatar" src="${user.avatar}" alt="${escapeHTML(user.name)}">
      <div class="post-author"><b>${escapeHTML(user.username)}</b><small>${escapeHTML(post.time)}</small></div>
      ${isOwn ? `<button class="more-button" data-edit-post="${post.id}" aria-label="Edit or delete post">•••</button>` : ""}
    </header>
    <div class="post-image-wrap"><img class="post-image" src="${post.image}" alt="Post by ${escapeHTML(user.username)}">${isOwn ? `<span class="own-badge">YOUR POST</span>` : ""}</div>
    <div class="post-content">
      <div class="post-actions">
        <button class="action-button ${post.liked ? "liked" : ""}" data-like="${post.id}" aria-pressed="${post.liked}"><span>${post.liked ? "♥" : "♡"}</span> Like</button>
        <button class="action-button" data-focus-comment="${post.id}"><span>◯</span> Comment</button>
        <button class="action-button" data-share="${post.id}"><span>↗</span> Share</button>
        <button class="action-button save ${post.saved ? "saved" : ""}" data-save="${post.id}" aria-pressed="${post.saved}"><span>${post.saved ? "▣" : "▢"}</span> ${post.saved ? "Saved" : "Save"}</button>
      </div>
      <p class="engagement">${formatNumber(post.likes)} likes · ${post.comments.length} ${post.comments.length === 1 ? "comment" : "comments"}</p>
      <p class="caption"><b>${escapeHTML(user.username)}</b>${escapeHTML(post.caption)}</p>
      <button class="translate-button" data-translate="${post.id}">文 Translate</button>
      <div class="translation hidden" id="translation-${post.id}"></div>
      <div class="comments">${post.comments.slice(-3).map(comment => `<div class="comment"><b>${escapeHTML(comment.user)}</b>${escapeHTML(comment.text)} <button class="translate-button" data-translate-comment="${post.id}">Translate</button></div>`).join("")}</div>
      <form class="comment-form" data-comment-form="${post.id}"><input id="comment-input-${post.id}" maxlength="160" placeholder="Add a comment…" aria-label="Comment on ${escapeHTML(user.username)}'s post"><button>Post</button></form>
    </div>
  </article>`;
}

function renderFeed() {
  $("#feed").innerHTML = state.posts.map(postTemplate).join("");
  renderMiniProfile();
}

function renderMiniProfile() {
  const user = state.currentUser;
  $("#miniProfile").innerHTML = `<div class="mini-profile-main"><img class="avatar" src="${user.avatar}" alt="${escapeHTML(user.name)}"><div><b>${escapeHTML(user.name)}</b><small>@${escapeHTML(user.username)}</small></div></div><p>${escapeHTML(user.bio)}</p><button class="text-button" data-view="profile">View profile & settings →</button>`;
}

function renderExplore() {
  const sorted = [...state.posts].sort((a, b) => b.likes - a.likes);
  $("#exploreGrid").innerHTML = sorted.map((post, index) => {
    const user = getUser(post.userId);
    return `<button class="explore-item" data-open-post="${post.id}" aria-label="View post by ${escapeHTML(user.username)}"><img src="${post.image}" alt=""><span class="grid-overlay"><span>♥ ${formatNumber(post.likes)}</span><span>◯ ${post.comments.length}</span></span>${index < 3 ? `<span class="featured-badge">✦ FEATURED</span>` : ""}</button>`;
  }).join("");
}

function renderSearch(query = "") {
  const target = $("#searchResults");
  if (!query.trim()) {
    target.innerHTML = `<div class="empty-state"><b>Start typing to explore Looply</b><p>Try a username, “design”, “trail”, or “color”.</p></div>`;
    return;
  }
  const term = query.toLowerCase();
  const userResults = [state.currentUser, ...state.users].filter(user => `${user.name} ${user.username} ${user.bio || ""}`.toLowerCase().includes(term));
  const postResults = state.posts.filter(post => post.caption.toLowerCase().includes(term));
  const results = [
    ...userResults.map(user => `<button class="result-card" data-profile-result="${user.id}"><img class="avatar" src="${user.avatar}" alt=""><div><b>${escapeHTML(user.name)}</b><p>@${escapeHTML(user.username)}</p></div></button>`),
    ...postResults.map(post => { const user = getUser(post.userId); return `<button class="result-card" data-open-post="${post.id}"><img src="${post.image}" alt=""><div><b>Post by @${escapeHTML(user.username)}</b><p>${escapeHTML(post.caption)}</p></div></button>`; })
  ];
  target.innerHTML = results.length ? results.join("") : `<div class="empty-state"><b>No matches yet</b><p>Try a different word or explore featured posts.</p></div>`;
}

function renderNotifications() {
  const visible = state.currentUser.visibility === "private" ? state.notifications.filter(note => note.type !== "visit") : state.notifications;
  $("#notificationsList").innerHTML = visible.length ? visible.map(note => `<article class="notification-item ${note.unread ? "unread" : ""}"><span class="notification-icon">${note.icon}</span><div><p>${escapeHTML(note.text)}</p><small>${escapeHTML(note.time)}</small></div></article>`).join("") : `<div class="empty-state">You’re all caught up.</div>`;
  updateNotificationDots();
}

function renderProfile() {
  const user = state.currentUser;
  const ownPosts = state.posts.filter(post => post.userId === "me");
  $("#profileHeader").innerHTML = `<div class="profile-main"><img class="avatar" src="${user.avatar}" alt="${escapeHTML(user.name)}"><div class="profile-copy"><h2>${escapeHTML(user.name)}</h2><span class="profile-handle">@${escapeHTML(user.username)}</span><p>${escapeHTML(user.bio)}</p>${user.datingMode ? `<span class="status-label">♥ Open to Dating</span>` : ""}</div><button id="editProfileButton" class="edit-profile-button">Edit profile</button></div><div class="stats"><div class="stat"><b>${ownPosts.length}</b><span>Posts</span></div><div class="stat"><b>${formatNumber(user.followers)}</b><span>Followers</span></div><div class="stat"><b>${user.following}</b><span>Following</span></div><div class="stat"><b>${user.visibility === "public" ? "Public" : "Private"}</b><span>Visibility</span></div></div>`;
  $("#postCountLabel").textContent = `${ownPosts.length} ${ownPosts.length === 1 ? "post" : "posts"}`;
  $("#profileGrid").innerHTML = ownPosts.length ? ownPosts.map(post => `<button class="profile-item" data-open-post="${post.id}"><img src="${post.image}" alt="Your post"><span class="grid-overlay"><span>♥ ${formatNumber(post.likes)}</span><span>••• Manage</span></span></button>`).join("") : `<div class="empty-state">Create your first post to see it here.</div>`;
  $$('[data-visibility]').forEach(button => button.classList.toggle("active", button.dataset.visibility === user.visibility));
  $("#datingToggle").checked = user.datingMode;
  $("#visibilityHelp").textContent = user.visibility === "public" ? "People can see when you visit their profile." : "Your profile visits stay anonymous.";
  $("#visitDemo").innerHTML = user.visibility === "public" ? `<b>Public visit demo</b><br>Others may receive: “Mira viewed your profile.”` : `<b>Private visit demo</b><br>Your visits will appear as “Someone viewed your profile.”`;
}

function updateNotificationDots() {
  const hasUnread = state.notifications.some(note => note.unread && (state.currentUser.visibility === "public" || note.type !== "visit"));
  $("#notificationDot").classList.toggle("hidden", !hasUnread);
  $(".mobile-nav [data-view='notifications'] i").classList.toggle("hidden", !hasUnread);
}

// ------------------------------
// 3. Modal forms: create, edit, profile
// ------------------------------
function openModal(content) {
  $("#modal").innerHTML = content;
  $("#modalBackdrop").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => $("#modal button, #modal input, #modal textarea")?.focus(), 50);
}

function closeModal() {
  $("#modalBackdrop").classList.add("hidden");
  $("#modal").innerHTML = "";
  document.body.style.overflow = "";
  uploadedImage = "";
}

function createPostModal() {
  openModal(`<div class="modal-header"><h2 id="modalTitle">Create a post</h2><button class="close-button" data-close-modal aria-label="Cancel">×</button></div><form id="createPostForm" class="modal-body"><div class="form-field"><label>IMAGE</label><label class="file-drop"><input id="postImageInput" type="file" accept="image/*"><span class="file-drop-copy"><b>Choose an image</b><span>PNG or JPG · kept in this browser only</span></span><img id="imagePreview" class="hidden" alt="Selected image preview"></label></div><div class="form-field"><label for="captionInput">CAPTION</label><textarea id="captionInput" maxlength="300" required placeholder="What’s happening?"></textarea></div><div class="modal-actions"><button type="button" class="secondary-button" data-close-modal>Cancel</button><button class="primary-button">Share post</button></div></form>`);
}

function editPostModal(postId) {
  const post = state.posts.find(item => item.id === postId);
  if (!post || post.userId !== "me") return;
  openModal(`<div class="modal-header"><h2 id="modalTitle">Manage post</h2><button class="close-button" data-close-modal aria-label="Close">×</button></div><form id="editPostForm" class="modal-body" data-post-id="${post.id}"><img src="${post.image}" alt="Your post" style="height:220px;object-fit:cover;border-radius:15px;margin-bottom:16px"><div class="form-field"><label for="editCaptionInput">CAPTION</label><textarea id="editCaptionInput" maxlength="300" required>${escapeHTML(post.caption)}</textarea></div><div class="modal-actions" style="justify-content:space-between"><button type="button" class="danger-button" data-delete-post="${post.id}">Delete post</button><span><button type="button" class="secondary-button" data-close-modal>Cancel</button> <button class="primary-button">Save changes</button></span></div></form>`);
}

function editProfileModal() {
  const user = state.currentUser;
  openModal(`<div class="modal-header"><h2 id="modalTitle">Edit profile</h2><button class="close-button" data-close-modal aria-label="Cancel">×</button></div><form id="editProfileForm" class="modal-body"><div class="form-field"><label for="profileNameInput">DISPLAY NAME</label><input id="profileNameInput" maxlength="40" required value="${escapeHTML(user.name)}"></div><div class="form-field"><label for="usernameInput">USERNAME</label><input id="usernameInput" maxlength="30" required value="${escapeHTML(user.username)}"></div><div class="form-field"><label for="bioInput">BIO</label><textarea id="bioInput" maxlength="160">${escapeHTML(user.bio)}</textarea></div><div class="modal-actions"><button type="button" class="secondary-button" data-close-modal>Cancel</button><button class="primary-button">Save profile</button></div></form>`);
}

function postDetailModal(postId) {
  const post = state.posts.find(item => item.id === postId);
  if (!post) return;
  const user = getUser(post.userId);
  openModal(`<div class="modal-header"><h2 id="modalTitle">@${escapeHTML(user.username)}’s post</h2><button class="close-button" data-close-modal aria-label="Close">×</button></div><div class="modal-body"><img src="${post.image}" alt="Post by ${escapeHTML(user.username)}" style="border-radius:15px;margin-bottom:16px"><p class="caption"><b>${escapeHTML(user.username)}</b>${escapeHTML(post.caption)}</p><p class="engagement">${formatNumber(post.likes)} likes · ${post.comments.length} comments</p><div class="modal-actions">${post.userId === "me" ? `<button class="secondary-button" data-edit-post="${post.id}">Manage post</button>` : ""}<button class="primary-button" data-view="home" data-close-and-home>View in feed</button></div></div>`);
}

// ------------------------------
// 4. Stories and social interactions
// ------------------------------
function openStory(index) {
  activeStoryIndex = index;
  if (!state.seenStories.includes(index)) state.seenStories.push(index);
  saveState();
  renderStories();
  renderStory();
  $("#storyViewer").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function renderStory() {
  const story = state.stories[activeStoryIndex];
  const user = getUser(story.userId);
  $("#storyProgress").innerHTML = state.stories.map((_, index) => `<span class="${index < activeStoryIndex ? "done" : index === activeStoryIndex ? "active" : ""}"></span>`).join("");
  $("#storyContent").innerHTML = `<img src="${story.image}" alt="Story by ${escapeHTML(user.username)}"><div class="story-meta"><img class="avatar small" src="${user.avatar}" alt=""><b>${escapeHTML(user.username)}</b></div><p class="story-caption">${escapeHTML(story.caption)}</p>`;
}

function moveStory(direction) {
  const next = activeStoryIndex + direction;
  if (next < 0) return;
  if (next >= state.stories.length) return closeStory();
  activeStoryIndex = next;
  if (!state.seenStories.includes(next)) state.seenStories.push(next);
  saveState();
  renderStories();
  renderStory();
}

function closeStory() {
  $("#storyViewer").classList.add("hidden");
  document.body.style.overflow = "";
}

function toggleLike(postId) {
  const post = state.posts.find(item => item.id === postId);
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  saveState();
  refreshPostViews();
  showToast(post.liked ? "Added to your likes" : "Like removed");
}

function toggleSave(postId) {
  const post = state.posts.find(item => item.id === postId);
  post.saved = !post.saved;
  saveState();
  refreshPostViews();
  showToast(post.saved ? "Post saved" : "Removed from saved posts");
}

async function sharePost(postId) {
  const post = state.posts.find(item => item.id === postId);
  const text = `Check out @${getUser(post.userId).username} on Looply: ${post.caption}`;
  try {
    if (navigator.share) await navigator.share({ title: "Looply post", text });
    else if (navigator.clipboard) { await navigator.clipboard.writeText(text); showToast("Post text copied to clipboard"); }
    else showToast("Share link ready — demo complete!");
    post.shares += 1;
    saveState();
  } catch (error) {
    if (error.name !== "AbortError") showToast("Sharing is not available in this browser");
  }
}

function refreshPostViews() {
  renderFeed();
  renderExplore();
  if (currentView === "profile") renderProfile();
}

function showTranslation(postId) {
  const box = $(`#translation-${postId}`);
  if (!box) return;
  if (!box.classList.contains("hidden")) {
    box.classList.add("hidden");
    return;
  }
  const languageName = $("#languageSelect").selectedOptions[0].textContent;
  box.innerHTML = `<b>${escapeHTML(languageName)}:</b> ${translations[state.language]}`;
  box.classList.remove("hidden");
}

// ------------------------------
// 5. Event handling (one listener for repeated patterns)
// ------------------------------
document.addEventListener("click", event => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    if (viewButton.dataset.closeAndHome !== undefined) closeModal();
    navigate(viewButton.dataset.view);
  }

  if (event.target.closest(".create-trigger")) createPostModal();
  if (event.target.closest("[data-close-modal]")) closeModal();
  if (event.target === $("#modalBackdrop")) closeModal();

  const story = event.target.closest("[data-story]");
  if (story) openStory(Number(story.dataset.story));

  const like = event.target.closest("[data-like]");
  if (like) toggleLike(Number(like.dataset.like));
  const save = event.target.closest("[data-save]");
  if (save) toggleSave(Number(save.dataset.save));
  const share = event.target.closest("[data-share]");
  if (share) sharePost(Number(share.dataset.share));

  const commentFocus = event.target.closest("[data-focus-comment]");
  if (commentFocus) $(`#comment-input-${commentFocus.dataset.focusComment}`)?.focus();
  const translate = event.target.closest("[data-translate]");
  if (translate) showTranslation(Number(translate.dataset.translate));
  const commentTranslation = event.target.closest("[data-translate-comment]");
  if (commentTranslation) showToast(`Comment translation: ${translations[state.language]}`);

  const editPost = event.target.closest("[data-edit-post]");
  if (editPost) editPostModal(Number(editPost.dataset.editPost));
  const deletePost = event.target.closest("[data-delete-post]");
  if (deletePost) {
    const id = Number(deletePost.dataset.deletePost);
    if (confirm("Delete this post? This cannot be undone.")) {
      state.posts = state.posts.filter(post => post.id !== id);
      saveState(); closeModal(); refreshPostViews(); showToast("Post deleted");
    }
  }

  const openPost = event.target.closest("[data-open-post]");
  if (openPost) postDetailModal(Number(openPost.dataset.openPost));
  if (event.target.closest("#editProfileButton")) editProfileModal();

  const profileResult = event.target.closest("[data-profile-result]");
  if (profileResult) {
    if (profileResult.dataset.profileResult === "me") navigate("profile");
    else showToast(`${getUser(profileResult.dataset.profileResult).name}’s profile opened (prototype)`);
  }
});

document.addEventListener("submit", event => {
  event.preventDefault();
  const commentForm = event.target.closest("[data-comment-form]");
  if (commentForm) {
    const input = $("input", commentForm);
    const text = input.value.trim();
    if (!text) return;
    const post = state.posts.find(item => item.id === Number(commentForm.dataset.commentForm));
    post.comments.push({ user: state.currentUser.username, text });
    saveState(); renderFeed(); renderExplore(); showToast("Comment added");
  }

  if (event.target.id === "createPostForm") {
    const caption = $("#captionInput").value.trim();
    if (!uploadedImage) return showToast("Please choose an image first");
    state.posts.unshift({ id: Date.now(), userId: "me", image: uploadedImage, caption, time: "Just now", likes: 0, liked: false, saved: false, shares: 0, comments: [] });
    saveState(); closeModal(); refreshPostViews(); navigate("home"); showToast("Your post is live!");
  }

  if (event.target.id === "editPostForm") {
    const post = state.posts.find(item => item.id === Number(event.target.dataset.postId));
    post.caption = $("#editCaptionInput").value.trim();
    saveState(); closeModal(); refreshPostViews(); showToast("Post updated");
  }

  if (event.target.id === "editProfileForm") {
    state.currentUser.name = $("#profileNameInput").value.trim();
    state.currentUser.username = $("#usernameInput").value.trim().replace(/^@/, "");
    state.currentUser.bio = $("#bioInput").value.trim();
    saveState(); closeModal(); renderProfile(); renderFeed(); showToast("Profile updated");
  }
});

document.addEventListener("change", event => {
  if (event.target.id === "languageSelect") {
    state.language = event.target.value;
    saveState();
    $$(".translation:not(.hidden)").forEach(box => box.classList.add("hidden"));
    showToast(`Translation language: ${event.target.selectedOptions[0].textContent}`);
  }
  if (event.target.id === "postImageInput") {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) return showToast("Please choose an image under 1.5 MB");
    const reader = new FileReader();
    reader.onload = () => { uploadedImage = reader.result; const preview = $("#imagePreview"); preview.src = uploadedImage; preview.classList.remove("hidden"); };
    reader.readAsDataURL(file);
  }
  if (event.target.id === "datingToggle") {
    state.currentUser.datingMode = event.target.checked;
    saveState(); renderProfile(); showToast(event.target.checked ? "Dating Mode is on" : "Dating Mode is off");
  }
});

$("#profileView").addEventListener("click", event => {
  const visibility = event.target.closest("[data-visibility]");
  if (!visibility) return;
  state.currentUser.visibility = visibility.dataset.visibility;
  saveState(); renderProfile(); renderNotifications();
  showToast(visibility.dataset.visibility === "public" ? "Public Mode: visits are visible" : "Private Mode: visits are anonymous");
});

$("#searchInput").addEventListener("input", event => renderSearch(event.target.value));
$("#markReadButton").addEventListener("click", () => { state.notifications.forEach(note => note.unread = false); saveState(); renderNotifications(); showToast("All caught up!"); });
$("#backButton").addEventListener("click", goBack);
$("#closeStory").addEventListener("click", closeStory);
$("#prevStory").addEventListener("click", () => moveStory(-1));
$("#nextStory").addEventListener("click", () => moveStory(1));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") { if (!$("#storyViewer").classList.contains("hidden")) closeStory(); else if (!$("#modalBackdrop").classList.contains("hidden")) closeModal(); }
  if (!$("#storyViewer").classList.contains("hidden")) {
    if (event.key === "ArrowRight") moveStory(1);
    if (event.key === "ArrowLeft") moveStory(-1);
  }
});

// Initial render
$("#languageSelect").value = state.language || "es";
renderStories();
renderFeed();
renderExplore();
renderSearch();
renderNotifications();
renderProfile();
updateNotificationDots();
