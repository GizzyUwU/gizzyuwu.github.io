function hamburber() {
    var x = document.getElementById("nav-links");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}
document.addEventListener('DOMContentLoaded', async function () {
    const options = {
        strings: ['Hey, I\'m Gizzy'],
        typeSpeed: 50,
        showCursor: false,
        onComplete: function () {
            typedDev()
        }
    };
    const typed = new Typed('#typedName', options);

    const projects = await axios.get(`https://api.github.com/repos/GizzyUwU/gizzyuwu.github.io/contents/projects?ref=main`);
    const projectFiles = projects.data.filter(item => item.type === 'file' || item.type === 'dir');
    projectFiles.forEach(async file => {
        const url = file.download_url;
        let raw = await axios.get(url)
        try {
            const projectsContainer = document.getElementById('projects');
            const offerDiv = document.createElement('div');
            offerDiv.classList.add('offers');
            const h2 = document.createElement('h2');
            const img = document.createElement('img');
            img.src = raw.data.imageUrl;
            img.style.height = '64px';
            img.style.width = '64px';
            h2.appendChild(img);
            offerDiv.appendChild(h2);
            const p = document.createElement('p');
            p.textContent = raw.data.name;
            offerDiv.appendChild(p);
            if (raw.data.url) {
                const button = document.createElement('button');
                button.textContent = 'Open';
                button.onclick = () => window.location.href = raw.data.url;
                offerDiv.appendChild(button);
            }
            projectsContainer.appendChild(offerDiv);
        } catch (error) {
            console.error('Error fetching or displaying project:', error);
        }
    });

    const socials = await axios.get(`https://api.github.com/repos/GizzyUwU/gizzyuwu.github.io/contents/socials?ref=main`);
    const socialFiles = socials.data.filter(item => item.type === 'file' || item.type === 'dir');
    socialFiles.forEach(async file => {
        const url = file.download_url;
        let raw = await axios.get(url)
        try {
            const socialsContainer = document.getElementById('socials');
            const offerDiv = document.createElement('div');
            offerDiv.classList.add('offers');
            const h2 = document.createElement('h2');
            if (raw.data.imageType === 'img') {
                const img = document.createElement('img');
                img.src = raw.data.imageUrl;
                if(raw.data.imageStyle) {
                    for (let prop in raw.data.imageStyle) {
                        img.style[prop] = raw.data.imageStyle[prop];
                    }
                } else {
                    img.style.height = '60px';
                    img.style.width = '64px';
                }
                h2.appendChild(img);
                offerDiv.appendChild(h2);
            } else if (raw.data.imageType === 'icon') {
                const icon = document.createElement('i');
                if (Array.isArray(raw.data.iconClasses)) {
                    raw.data.iconClasses.forEach(className => {
                        icon.classList.add(className);
                    });
                } else {
                    icon.classList.add(raw.data.iconClasses);
                }
                h2.appendChild(icon);
                offerDiv.appendChild(h2);
            }
            const p = document.createElement('p');
            p.textContent = raw.data.name;
            offerDiv.appendChild(p);
            if (raw.data.url) {
                const button = document.createElement('button');
                button.textContent = 'Open';
                button.onclick = () => window.location.href = raw.data.url;
                offerDiv.appendChild(button);
            }
            socialsContainer.appendChild(offerDiv);
        } catch (error) {
            console.error('Error fetching or displaying social card:', error);
        }
    });
})

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('p');
    if (paramId && $('#' + paramId).length) {
        $('#' + paramId).addClass('active');
    } else {
        $('#home').addClass('active');
    }

    $('a.nav-link').on('click', function (event) {
        event.preventDefault(); // Prevent default anchor behavior
        const hash = $(this).attr('href').split('=')[1];
        if ($('#' + hash).length) {
            $('.slide').removeClass('active');
            $('#' + hash).addClass('active');
            window.history.pushState(null, null, '?p=' + hash); // Update URL without reloading the page
        } else return;
    });
});

function typedDev() {
    const options = {
        strings: ['A Full-Stack Developer'],
        typeSpeed: 50,
        showCursor: false,
        onComplete: function () {
            showElements()
        }
    };
    const typed = new Typed('#typedDev', options);
}

function showElements() {
    document.getElementById('aboutMe').style.display = "block"
}