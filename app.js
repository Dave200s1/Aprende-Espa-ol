//Carosel Code Bilder
const bilder = [
    "imgs/Pic1.webp","imgs/Pic2.webp","imgs/Pic3.webp","imgs/Pic4.webp"
];

const slider = document.getElementById("slider");

let index = 0;

slider.style.backgroundImage = `url(${bilder[index]})`;

setInterval(() => {

    slider.style.opacity = 0.5;

    setTimeout(()=>{
        index = (index + 1) % bilder.length;
        slider.style.backgroundImage = `url(${bilder[index]})`;
        slider.style.opacity = 1;
    },1000);

    

}, 20000);

//Externe Daten Feedback JSON
const loadTestimonials = async () => {
    try{
        const response = await fetch('data/feedback.json');
        if (!response.ok){
            throw new Error('HTTP-Fehler: '+ response.status);
        }
        
        const testimonials = await response.json(); 

        const container = document.querySelector('.bewertungen');
        container.innerHTML = ''; 

        testimonials.forEach(testimonial => {
        const div = document.createElement('div');
        div.className = 'Kunde';
        //Verstk.
        div.style.opacity = '0';
        div.style.transform = 'translateY(50px)';
        div.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out'; 
        div.innerHTML = `
            <h4>${testimonial.name}</h4>
            <img 
                src="${testimonial.img}" 
                srcset="${testimonial.img_320w} 320w,
                ${testimonial.img_640w} 640w,
                ${testimonial.img_1000w} 1000w"
                                sizes="(max-width: 600px) 120px,
                                    (max-width: 900px) 180px,
                                    280px"
                                loading="lazy"
                                id="${testimonial.id}"
                                alt="${testimonial.name}"
                            >
            <p>${'⭐'.repeat(testimonial.rating)}</p>
            <p>${testimonial.text}</p>
            <p>${testimonial.comment}</p>
        `;
         container.appendChild(div);
         animationOnScroll(div, index * 0.2);
        });

       
        // Speicherung
        localStorage.setItem('testimonialsLoaded', new Date().toISOString());
    }catch(error){
        console.error('Feedback konnte nicht geladen werden:',error);
    }
    
};

const loadXMLData = async () => {
    try {
        const response = await fetch('data/statistic.xml');
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml"); 

        // Prüfe auf Parse-Fehler
        if (xmlDoc.querySelector('parsererror')) {
            throw new Error('XML Parse-Fehler');
        }

        const stats = xmlDoc.getElementsByTagName('stat'); 
        let html = '<div class="stats-container">';
        
        for (let stat of stats) {
            const value = stat.getElementsByTagName('value')[0]?.textContent || 'N/A';
            const label = stat.getElementsByTagName('label')[0]?.textContent || 'N/A';
            html += `
                <div class="stat-item">
                    <h4>${value}</h4>
                    <p>${label}</p>
                </div>
            `;
        }
        html += '</div>';

        const statsSection = document.createElement('section');
        statsSection.className = 'stats';
        statsSection.innerHTML = '<h3>Unsere Zahlen</h3>' + html;
        document.querySelector('.IphonePic').before(statsSection);
    } catch (error) {
        console.error('XML-Fehler:', error);
        
    }
};


document.addEventListener('DOMContentLoaded', () => {
    loadXMLData(); 
    loadTestimonials();
});

const animationOnScroll = (element, delay = 0) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Einblenden wenn sichtbar
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, delay);
                observer.unobserve(element); 
            }
        });
    }, {
        threshold: 0.1, // 10% sichtbar = trigger
        rootMargin: '0px 0px -50px 0px' 
    });
    
    observer.observe(element);
};



//Dark-Mode Funktionalitaet
const darkModeToggle = document.createElement('button');
darkModeToggle.textContent = '🌙';
darkModeToggle.style.cssText = `
  position: fixed; 
  top: 550px; 
  right: 10px; 
  z-index: 1000;
  cursor: pointer;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 32px;
  border: none;
  background-color: #372f68;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  animation: floatPulse 3s ease-in-out infinite; 
`;
document.body.appendChild(darkModeToggle);


const CSS_Style = `
:root {
  --bg-dark: #333;
  --text-color: #ffffff;
  --accent: #34dbb1;
  --shadow-soft: rgba(0,0,0,0.3);
  --shadow-strong: rgba(0,0,0,0.4);
}

@keyframes floatPulse {
  0%, 100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 4px 10px var( --shadow-soft);
  }
  50% {
    transform: translateY(-8px) scale(1.1);
    box-shadow: 0 8px 20px var( --shadow-strong);
  }
}


.dark-mode {
  background-color: var(--bg-dark);
  color: var(--text-color);
}

.dark-mode nav {
    background-color: var(--bg-dark);
}

.dark-mode .nav-links a{
    background-color:  var(--bg-dark);
    color:  var(--text-color);
}

.dark-mode .nav-links a:hover{
    background-color: var(--accent);
    color:  var(--text-color);
    border-radius: 5%;
}

.dark-mode .submenu{
    background-color: var(--bg-dark);
}

.dark-mode .WelcomeScreen p{
  background-color: var(--bg-dark);
  color: var(--text-color);
}

.dark-mode .WelcomeScreen .infobox{
    background-color: var(--bg-dark);
    color: var(--text-color);
}

.dark-mode .Feedback h3{
    color: var(--text-color);
    background-color: var(--bg-dark);
}

.dark-mode .WarumSpanischLernen{
    background-color: var(--bg-dark);
    color: var(--text-color);
}


.dark-mode .SprecheFließen{
    background: linear-gradient(to bottom,var(--bg-dark),var(--accent));
}
.dark-mode .SprecheFließen .InfoLeft{
    color: var(--text-color);
}

`;

const style = document.createElement('style');
style.textContent = CSS_Style;
document.head.appendChild(style);

function updateToggleIcons(){
    if(document.body.classList.contains('dark-mode')){
        darkModeToggle.textContent = '☀️';
    }else{
        darkModeToggle.textContent = '🌙';
    }
}

//toggle Logik
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  updateToggleIcons();
});

// state von localStorage laden
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Responsive Funktionalitaet
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const aboutLink = document.querySelector('.about-link');
const submenuParent = document.querySelector('.has-submenu');


hamburger.addEventListener('click', () =>{
    navLinks.classList.toggle('open');
});


// Dropdown (nur Mobile)
aboutLink.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        e.preventDefault();
        submenuParent.classList.toggle('open');
    }
});