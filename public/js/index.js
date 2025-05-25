let isInTerminal = true;
let lastTarget = null;
let mainTitleEnabled = false;

document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("hide-scrollbar");
  const ul = document.getElementById("terminal-output");
  let typedInstance = null;

  function addLine(text, withPrompt, promptText, instant, callback) {
    const li = document.createElement("li");
    li.id = "terminal-li";
    if (withPrompt) {
      li.innerHTML = `┌──(gizzy <i class="fab fa-linux"></i> NG-Server)-[<span style="color: white">${replaceUnderlinedWithLinks(
        promptText
      )}</span>]<br>└─$ `;
    } else {
      li.innerHTML = "";
    }
    const span = document.createElement("span");
    span.classList.add("typed-output");
    li.appendChild(span);
    ul.appendChild(li);
    if (instant) {
      setTimeout(() => {
        span.innerHTML = replaceUnderlinedWithLinks(text);
        callback();
      }, 600);
    } else {
      typedInstance = new Typed(span, {
        strings: [replaceUnderlinedWithLinks(text)],
        typeSpeed: 100,
        startDelay: 500,
        backSpeed: 50,
        backDelay: 500,
        smartBackspace: true,
        showCursor: true,
        cursorChar: "|",
        autoInsertCss: true,
        onComplete: function () {
          li.querySelector(".typed-cursor").style.display = "none";
          callback();
        },
      });
    }
  }

  function replaceUnderlinedWithLinks(text) {
    return text.replace(
      /<u>(.*?)<\/u>/g,
      '<a href="#" class="terminal-link" id="$1">$1</a>'
    );
  }
  ul.addEventListener("click", function (event) {
    if (event.target.classList.contains("terminal-link")) {
      event.preventDefault();
    }
  });

  const commands = [
    {
      text: "--- Exit by tapping screen or hitting shift key ---",
      withPrompt: false,
      instant: true,
    },
    { text: "bun -v", withPrompt: true, promptText: "~", instant: false },
    { text: "1.2.13", withPrompt: false, instant: true },
    { text: "ls", withPrompt: true, promptText: "~", instant: false },
    {
      text: "Desktop Documents Downloads Music Videos",
      withPrompt: false,
      instant: true,
    },
    {
      text: "cd Documents",
      withPrompt: true,
      promptText: "~",
      instant: false,
    },
    {
      text: "ls",
      withPrompt: true,
      promptText: "~/Documents",
      instant: false,
    },
    { text: "Portfolio", withPrompt: false, instant: true },
    {
      text: "cd Portfolio",
      withPrompt: true,
      promptText: "~/Documents",
      instant: false,
    },
    {
      text: "bun install",
      withPrompt: true,
      promptText: "~/Documents/Portfolio",
      instant: false,
    },
    {
      text: "up to date, audited 304 packages in 9s \n 44 packages are looking for funding \n run `npm fund` for details \n found 0 vulnerabilities",
      withPrompt: false,
      instant: true,
    },
    {
      text: "bun run start",
      withPrompt: true,
      promptText: "~/Documents/Portfolio",
      instant: false,
    },
    {
      text: "[Server] Started... Redirecting in 1s",
      withPrompt: false,
      instant: true,
    },
  ];

  function mainTitle() {
    if (mainTitleEnabled === true) return;
    new Typed("#terminal-site-title", {
      strings: ["Gizzy's Portfolio"],
      typeSpeed: 100,
      startDelay: 500,
      backSpeed: 50,
      backDelay: 500,
      smartBackspace: true,
      showCursor: true,
      cursorChar: "|",
      autoInsertCss: true,
      onComplete: function () {
        setTimeout(() => {
          let li = document.getElementById("terminal-site");
          li.querySelector(".typed-cursor").style.display = "none";
        }, 1500);
      },
    });
    mainTitleEnabled = true;
  }

  function highlightLinkByHash() {
    let hash = window.location.hash;
    const links = document.querySelectorAll(".terminal-site-link");
    let found = false;

    if (!hash) {
      hash = "home";
    } else {
      hash = hash.substring(1);
    }

    links.forEach((link, index) => {
      const dataTarget = link.getAttribute("data-target");
      if (dataTarget === hash) {
        currentIndex = index;
        link.classList.add("terminal-site-link-highlight");
        document.getElementById(dataTarget).classList.add("active");
        if (dataTarget === "projects") {
          fetchProjects();
        } else if (dataTarget === "contact") {
          fetchContacts();
        }
        lastTarget = dataTarget;
        found = true;
      } else {
        link.classList.remove("terminal-site-link-highlight");
        document.getElementById(dataTarget).classList.remove("active");
      }
    });

    if (!found) {
      currentIndex = 0;
      links.forEach((link, index) => {
        if (index === 0) {
          link.classList.add("terminal-site-link-highlight");
          document.getElementById("home").classList.add("active");
          lastTarget = "home";
        } else {
          link.classList.remove("terminal-site-link-highlight");
          document
            .getElementById(link.getAttribute("data-target"))
            .classList.remove("active");
        }
      });
    }

    mainTitle();
  }

  function typeLines(
    lines,
    lineIndex,
    withPrompt,
    promptText,
    instant,
    callback
  ) {
    if (lineIndex < lines.length) {
      const line = lines[lineIndex];
      const showPrompt = lineIndex === 0 ? withPrompt : false;
      addLine(line, showPrompt, promptText || "", instant, function () {
        typeLines(
          lines,
          lineIndex + 1,
          withPrompt,
          promptText,
          instant,
          callback
        );
      });
    } else {
      callback();
    }
  }

  function typeCommands(index) {
    if (index < commands.length) {
      const { text, withPrompt, promptText, instant } = commands[index];
      const lines = text.split("\n");
      typeLines(lines, 0, withPrompt, promptText, instant, function () {
        typeCommands(index + 1);
      });
    } else {
      setTimeout(() => {
        if (!document.getElementById("terminal").classList.contains("active"))
          return;
        if (
          document.getElementById("terminal-site").classList.contains("active")
        )
          return;
        document.body.classList.remove("hide-scrollbar");
        document.getElementById("terminal").classList.remove("active");
        document.getElementById("terminal-site").classList.add("active");
        highlightLinkByHash();
        mainTitle();
      });
    }
  }
  typeCommands(0);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Shift") {
      if (typedInstance) {
        typedInstance.stop();
      }
      document.body.classList.remove("hide-scrollbar");
      document.getElementById("terminal").classList.remove("active");
      document.getElementById("terminal-site").classList.add("active");
      highlightLinkByHash?.();
      mainTitle?.();
    }
  });

  document.addEventListener("touchstart", function (event) {
    if (typedInstance) {
      typedInstance.stop();
    }
    if (!document.getElementById("terminal").classList.contains("active"))
      return;
    if (document.getElementById("terminal-site").classList.contains("active"))
      return;
    document.body.classList.remove("hide-scrollbar");
    document.getElementById("terminal").classList.remove("active");
    document.getElementById("terminal-site").classList.add("active");
    highlightLinkByHash();
    mainTitle();
  });

  let startX = 0,
    startY = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0];
      startX = t.screenX;
      startY = t.screenY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0];
      const dx = t.screenX - startX;
      const dy = Math.abs(t.screenY - startY);

      if (dy < 30 && Math.abs(dx) > 50) {
        moveHighlight(dx < 0 ? "next" : "prev");
      }
    },
    { passive: true }
  );

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      moveHighlight("next");
    } else if (event.key === "ArrowLeft") {
      moveHighlight("prev");
    } else if (event.key === "Enter") {
      handleEnter();
    }
  });

  const links = document.querySelectorAll(".terminal-site-link");
  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const dataTarget = link.getAttribute("data-target");
      handleButtonClick(dataTarget);
    });
  });

  function handleButtonClick(dataTarget) {
    const targetElement = document.getElementById(dataTarget);
    if (!targetElement) return;
    if (lastTarget) {
      document.getElementById(lastTarget).classList.remove("active");
      const lastLink = document.querySelector(
        `.terminal-site-link[data-target="${lastTarget}"]`
      );
      if (lastLink) {
        lastLink.classList.remove("terminal-site-link-highlight");
      }
    }
    targetElement.classList.add("active");
    if (dataTarget === "projects") {
      fetchProjects();
    } else if (dataTarget === "contacts") {
      fetchContacts();
    }
    lastTarget = dataTarget;
    const currentLink = document.querySelector(
      `.terminal-site-link[data-target="${dataTarget}"]`
    );
    if (currentLink) {
      currentLink.classList.add("terminal-site-link-highlight");
    }
    window.history.pushState(null, null, `#${dataTarget}`);
  }

  function moveHighlight(direction) {
    const currentLink = document.querySelector(
      ".terminal-site-link.terminal-site-link-highlight"
    );
    if (!currentLink) return;
    let nextIndex;
    const links = document.querySelectorAll(".terminal-site-link");
    const linksArray = Array.from(links);
    if (direction === "next") {
      nextIndex = linksArray.findIndex((link) => link === currentLink) + 1;
      if (nextIndex >= linksArray.length) {
        nextIndex = 0;
      }
    } else if (direction === "prev") {
      nextIndex = linksArray.findIndex((link) => link === currentLink) - 1;
      if (nextIndex < 0) {
        nextIndex = linksArray.length - 1;
      }
    }

    const nextLink = linksArray[nextIndex];
    const dataTarget = nextLink.getAttribute("data-target");
    currentLink.classList.remove("terminal-site-link-highlight");
    nextLink.classList.add("terminal-site-link-highlight");
    if (lastTarget) {
      document.getElementById(lastTarget).classList.remove("active");
    }
    document.getElementById(dataTarget).classList.add("active");
    lastTarget = dataTarget;
    window.history.pushState(null, null, `#${dataTarget}`);
    console.log(dataTarget);
    if (dataTarget === "projects") {
      fetchProjects();
    } else if (dataTarget === "contacts") {
      fetchContacts();
    }
  }
  function handleEnter() {
    const highlightedElement = document.querySelector(
      ".terminal-site-link-highlight"
    );
    if (!highlightedElement) return;
    const dataTarget = highlightedElement.getAttribute("data-target");
    if (lastTarget) {
      document.getElementById(lastTarget).classList.remove("active");
    }
    document.getElementById(dataTarget).classList.add("active");
    lastTarget = dataTarget;
    window.history.pushState(null, null, `#${dataTarget}`);
  }
});

async function fetchProjects() {
  try {
    const gitUrls = [
      "https://api.github.com/users/GizzyUwU/repos?sort=updated&per_page=100",
      "https://git.potatowo.me/api/v1/users/gizzy/repos?limit=100",
      "https://git.gay/api/v1/users/GizzyUwU/repos?limit=100",
    ];

    let projects = [];

    if (!localStorage.getItem("projects")) {
      const combinedProjects = [];

      for (const url of gitUrls) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (Array.isArray(data)) {
            combinedProjects.push(...data);
          } else {
            console.warn(`Unexpected data format from ${url}`);
          }
        } catch (err) {
          console.warn(`Failed to fetch from ${url}`, err);
        }
      }

      const seenNames = new Set();
      projects = combinedProjects.filter((project) => {
        if (!project.name) return false;
        const lowerName = project.name.toLowerCase();
        if (seenNames.has(lowerName)) return false;
        seenNames.add(lowerName);
        return true;
      });

      localStorage.setItem("projects", JSON.stringify(projects));
    } else {
      projects = JSON.parse(localStorage.getItem("projects"));
    }

    const projectsList = document.getElementById("projectsList");
    if (!projectsList) return;

    if (projects.length > 0) {
      projectsList.innerHTML = "";
      projects.forEach((project) => {
        const projectElement = document.createElement("li");
        projectElement.classList.add("project-item");

        const parts = [project.name];
        if (project.description) parts.push(project.description);
        if (project.language) parts.push(`Built in ${project.language}`);

        const combinedContent = parts.join(" - ");
        const finalBodyContent = project.html_url
          ? `<a href="${project.html_url}" target="_blank" rel="noopener noreferrer">${combinedContent}</a>`
          : combinedContent || "No relevant content found.";

        projectElement.innerHTML = `
          <div class="project-box no-image">
            <div class="project-text">
              <p>${finalBodyContent}</p>
            </div>
          </div>
        `;

        projectsList.appendChild(projectElement);
      });
    } else {
      projectsList.innerHTML = `
        <li class="project-item">
          <div class="project-box">No projects found.</div>
        </li>
      `;
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    const projectsList = document.getElementById("projectsList");
    if (projectsList) {
      projectsList.innerHTML = `
        <li class="project-item">
          <div class="project-box">Error fetching projects.</div>
        </li>
      `;
    }
  }
}

async function fetchContacts() {
  const githubUrl = "https://api.github.com/users/GizzyUwU";
  let data;
  const cached = localStorage.getItem("contact");
  if (cached) {
    try {
      data = JSON.parse(cached);
      console.log("Loaded contact info from cache.");
    } catch (e) {
      console.warn("Invalid cache, clearing...");
      localStorage.removeItem("contact");
    }
  }

  if (!data) {
    try {
      const response = await fetch(githubUrl);
      if (!response.ok) throw new Error("GitHub API failed");
      data = await response.json();
      localStorage.setItem("contact", JSON.stringify(data));
    } catch (error) {
      console.error("Fetch failed.");
      document.getElementById("contact-info").innerHTML =
        "Error loading contact information.";
    }
  }

  const contactInfoElement = document.getElementById("contact-info");
  contactInfoElement.innerHTML = `
    <img src="${
      data.avatar_url
    }" alt="Avatar" style="width:48px;border-radius:50%;">
    <p><strong>${data.name || data.login}</strong></p>
    <p><a href="${data.html_url}" target="_blank">${data.html_url}</a></p>
    <p>${data.bio || ""}</p>
    <p>Location: ${data.location || "Unknown"}</p>
    <p>Website: ${
      data.blog
        ? `<a href="${data.blog}" target="_blank">${data.blog}</a>`
        : "None"
    }</p>
    <p>Twitter: ${
      data.twitter_username
        ? `<a href="https://twitter.com/${data.twitter_username}" target="_blank">@${data.twitter_username}</a>`
        : "None"
    }</p>
    <p>Followers: ${data.followers}</p>
    <p>Public Repos: ${data.public_repos}</p>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "G-TXNJC5PSC8");
});
