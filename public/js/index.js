let isInTerminal = true;
let lastTarget = null;
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
      document.getElementById(dataTarget).style.display = "block";
      lastTarget = dataTarget;
      found = true;
    } else {
      link.classList.remove("terminal-site-link-highlight");
      document.getElementById(dataTarget).style.display = "none";
    }
  });

  if (!found) {
    currentIndex = 0;
    links.forEach((link, index) => {
      if (index === 0) {
        link.classList.add("terminal-site-link-highlight");
        document.getElementById("home").style.display = "block";
        lastTarget = "home";
      } else {
        link.classList.remove("terminal-site-link-highlight");
        document.getElementById(
          link.getAttribute("data-target")
        ).style.display = "none";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const ul = document.getElementById("terminal-output");
  let typedInstance = null;

  function addLine(text, withPrompt, promptText, instant, callback) {
    const li = document.createElement("li");
    li.id = "terminal-li";
    if (withPrompt) {
      li.innerHTML = `┌──(gizzy <i class="fa-brands fa-debian"></i> NG-Server)-[<span style="color: white">${replaceUnderlinedWithLinks(
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
      console.log("Navigating to:", event.target.id);
    }
  });

  const commands = [
    {
      text: "cat terminal-animation.txt",
      withPrompt: true,
      promptText: "~",
      instant: false,
    },
    {
      text: "To exit the animation hit the Shift Key.",
      withPrompt: false,
      instant: true,
    },
    { text: "node -v", withPrompt: true, promptText: "~", instant: false },
    { text: "v20.14.0", withPrompt: false, instant: true },
    { text: "ls", withPrompt: true, promptText: "~", instant: false },
    {
      text: "Desktop Documents Downloads Music Videos",
      withPrompt: false,
      instant: true,
    },
    {
      text: "cd <u>Documents</u>",
      withPrompt: true,
      promptText: "~",
      instant: false,
    },
    {
      text: "ls",
      withPrompt: true,
      promptText: "~/<u>Documents</u>",
      instant: false,
    },
    { text: "Fusion Website", withPrompt: false, instant: true },
    {
      text: "cd <u>Website</u>",
      withPrompt: true,
      promptText: "~/<u>Documents</u>",
      instant: false,
    },
    {
      text: "npm i",
      withPrompt: true,
      promptText: "~/<u>Documents</u>/<u>Website</u>",
      instant: false,
    },
    {
      text: "up to date, audited 304 packages in 9s \n 44 packages are looking for funding \n run `npm fund` for details \n found 0 vulnerabilities",
      withPrompt: false,
      instant: true,
    },
    {
      text: "npm start",
      withPrompt: true,
      promptText: "~/<u>Documents</u>/<u>Website</u>",
      instant: false,
    },
    {
      text: "[Client] Loading up page... Goodbye!",
      withPrompt: false,
      instant: true,
    },
  ];

  function highlightCurrentSection() {
    document
      .getElementById(sections[currentSectionIndex])
      .classList.add("active");
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
      highlightLinkByHash();
      setTimeout(() => {
        if (!document.getElementById("terminal").style.display === "none")
          return;
        if (document.getElementById("terminal-site").style.display === "block")
          return;
        document.getElementById("terminal").style.display = "none";
        document.getElementById("terminal-site").style.display = "block";
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
            let li = document.getElementById("terminal-site");
            li.querySelector(".typed-cursor").style.display = "none";
          },
        });
        highlightCurrentSection();
      }, 2000);
    }
  }
  typeCommands(0);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Shift") {
      if (typedInstance) {
        typedInstance.stop();
      }
      if (!document.getElementById("terminal").style.display === "none") return;
      if (document.getElementById("terminal-site").style.display === "block")
        return;
      document.getElementById("terminal").style.display = "none";
      document.getElementById("terminal-site").style.display = "block";
      highlightLinkByHash();
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
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      moveHighlight("next");
    } else if (event.key === "ArrowLeft") {
      moveHighlight("prev");
    } else if (event.key === "Enter") {
      handleEnter();
    }
    const links = document.querySelectorAll(".terminal-site-link");
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            console.log(link.getAttribute('data-target'))
            const dataTarget = link.getAttribute('data-target');
            handleButtonClick(dataTarget);
        });
    });
  });

  function handleButtonClick(dataTarget) {
    const targetElement = document.getElementById(dataTarget);
    if (!targetElement) return;
    if (lastTarget) {
        document.getElementById(lastTarget).style.display = "none";
        const lastLink = document.querySelector(`.terminal-site-link[data-target="${lastTarget}"]`);
        if (lastLink) {
            lastLink.classList.remove('terminal-site-link-highlight');
        }
    }
    targetElement.style.display = "block";
    lastTarget = dataTarget;
    const currentLink = document.querySelector(`.terminal-site-link[data-target="${dataTarget}"]`);
    if (currentLink) {
        currentLink.classList.add('terminal-site-link-highlight');
    }
    window.history.pushState(null, null, `#${dataTarget}`);
}

function moveHighlight(direction) {
    const currentLink = document.querySelector('.terminal-site-link.terminal-site-link-highlight');
    if (!currentLink) return;
    let nextIndex;
    const links = document.querySelectorAll('.terminal-site-link');
    const linksArray = Array.from(links);
    if (direction === 'next') {
        nextIndex = linksArray.findIndex(link => link === currentLink) + 1;
        if (nextIndex >= linksArray.length) {
            nextIndex = 0;
        }
    } else if (direction === 'prev') {
        nextIndex = linksArray.findIndex(link => link === currentLink) - 1;
        if (nextIndex < 0) {
            nextIndex = linksArray.length - 1;
        }
    }

    const nextLink = linksArray[nextIndex];
    const dataTarget = nextLink.getAttribute('data-target');
    currentLink.classList.remove('terminal-site-link-highlight');
    nextLink.classList.add('terminal-site-link-highlight');
    if (lastTarget) {
        document.getElementById(lastTarget).style.display = "none";
    }
    document.getElementById(dataTarget).style.display = "block";
    lastTarget = dataTarget;
    window.history.pushState(null, null, `#${dataTarget}`);
}
  function handleEnter() {
    const highlightedElement = document.querySelector('.terminal-site-link-highlight');
    if (!highlightedElement) return;
    const dataTarget = highlightedElement.getAttribute('data-target');
    if (lastTarget) {
        document.getElementById(lastTarget).style.display = "none";
    }
    document.getElementById(dataTarget).style.display = "block";
    lastTarget = dataTarget;
    window.history.pushState(null, null, `#${dataTarget}`);
}
});
