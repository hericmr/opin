/**
 * Utilitários comuns para o site Lindiflix
 * Consolida funcionalidades duplicadas dos scripts existentes
 */

// Dados consolidados das aldeias (evita duplicação entre script.js e script2.js)
const aldeiaData = {
    'aldeia1': {
        image: 'fotos/paula.webp',
        title: 'Professora Paula Aparecida Baptista',
        description: 'Aldeia Tangará'
    },
    'aldeia2': {
        image: 'fotos/renato.webp',
        title: 'Professor Renato da Silva Mariano',
        description: 'Aldeia Pindo-ty'
    },
    'aldeia3': {
        image: 'fotos/andreia.webp',
        title: 'Professora Andreia Ribeiro dos Santos',
        description: 'Terra Indígena Djaiko Aty'
    },
    'aldeia4': {
        image: 'fotos/jonathan.webp',
        title: 'Professor Jonathan Marcolino',
        description: 'Aldeia Tereguá'
    },
    'aldeia5': {
        image: 'fotos/kerexu.webp',
        title: 'Professora Kerexu Mirim da Silva',
        description: 'Aldeia Krukutu'
    },
    'aldeia6': {
        image: 'fotos/rodrigo.webp',
        title: 'Professor Rodrigo Vera Mirim da Silva',
        description: 'Aldeia Takuari-ty'
    },
    'aldeia7': {
        image: 'fotos/mariza.webp',
        title: 'Professora Mariza da Silva',
        description: 'Aldeia Pegua-oty'
    },
    'aldeia8': {
        image: 'fotos/abilio.webp',
        title: 'Professor Abílio Fernandes',
        description: 'Aldeia Uru\'ity'
    },
    'aldeia9': {
        image: 'fotos/adao.webp',
        title: 'Professor Adão Alves',
        description: 'Aldeia Kopenoti (Avaí/SP)'
    },
    'aldeia10': {
        image: 'fotos/iara.webp',
        title: 'Professora Iara Mendonça Bolgarim',
        description: 'Terra Indígena Jaraguá'
    },
    'aldeia11': {
        image: 'fotos/edson.webp',
        title: 'Professor Edson Rodrigues',
        description: 'Terra indígena Amba Porã'
    },
    'aldeia13': {
        image: 'fotos/claudinei.webp',
        title: 'Professor Claudinei Fermino da Silva',
        description: 'Aldeia Nimuendaju'
    },
    'aldeia14': {
        image: 'fotos/cledinilson.webp',
        title: 'Professor Cledinilson Alves Marcolino',
        description: 'Aldeia Nimuendaju'
    },
    'aldeia15': {
        image: 'fotos/ingrid.webp',
        title: 'Professora Ingrid Ara I Santos da Silva',
        description: 'Aldeia Boa Vista'
    },
    'aldeia16': {
        image: 'fotos/kamila.webp',
        title: 'Professora Kamila Ariellen Dina dos Santos',
        description: 'Aldeia Nhamandu Mirim'
    },
    'aldeia17': {
        image: 'fotos/leonardo.webp',
        title: 'Professor Leonardo Edileno Wera Tupã Macena',
        description: 'Aldeia Rio Silveira'
    },
    'aldeia18': {
        image: 'fotos/lidiane.webp',
        title: 'Professora Lidiane Damaceno Cotui Afonso',
        description: 'Aldeia Vanuire'
    },
    'aldeia19': {
        image: 'fotos/marcelo.webp',
        title: 'Professor Marcelo Papa Benite',
        description: 'Tekoa Mirim'
    },
    'aldeia20': {
        image: 'fotos/marcio.webp',
        title: 'Professor Marcio da Silva',
        description: 'Aldeia Itapuã'
    },
    'aldeia21': {
        image: 'fotos/mariana.webp',
        title: 'Professora Mariana Benite',
        description: 'Aldeia Renascer'
    },
    'aldeia22': {
        image: 'fotos/roberto.webp',
        title: 'Professor Roberto Martin da Silva',
        description: 'Aldeia Aguapeu'
    },
    'aldeia23': {
        image: 'fotos/marilene.webp',
        title: 'Professora Marilene Mendonça Bolgarim',
        description: 'Terra Indígena Jaraguá'
    },
    'aldeia24': {
        image: 'fotos/reinaldo.webp',
        title: 'Professor Reinaldo karai tukumbbo Peralta',
        description: 'Tekoa Tupã reko'
    },
    'aldeia25': {
        image: 'fotos/rosangela.webp',
        title: 'Professora Rosângela Barbosa',
        description: 'Tekoa Arandu'
    },
    'aldeia26': {
        image: 'fotos/rosimeire.webp',
        title: 'Professora Rosimeire Iaiaiti Indubrasil',
        description: 'Aldeia Indigena Icatu'
    },
    'aldeia27': {
        image: 'fotos/severino.webp',
        title: 'Professor Severino Cabral Ramires',
        description: 'Madenuá Porã'
    },
    'aldeia28': {
        image: 'fotos/joao.webp',
        title: 'Professor João Batista Ortega',
        description: 'Aldeia Ka\'aguy hovy'
    }
};

// Links dos vídeos consolidados
const videoLinks = {
    'aldeia1': 'https://www.youtube.com/embed/aVnLAbow-kY?si=6xU4QtVG5mru6ZHO',
    'aldeia2': 'https://www.youtube.com/embed/rBXZkhe6Qmo',
    'aldeia3': 'https://www.youtube.com/embed/dq6lps46jQw',
    'aldeia4': 'https://www.youtube.com/embed/rqp1SwCDnfc',
    'aldeia5': 'https://www.youtube.com/embed/yYBeDUKZjk4',
    'aldeia6': 'https://www.youtube.com/embed/5j3YEdeMraw',
    'aldeia7': 'https://www.youtube.com/embed/IsIJVA4ppOg',
    'aldeia8': 'https://www.youtube.com/embed/_6PuOnVIhEU',
    'aldeia9': 'https://www.youtube.com/embed/3e8N8uGyIvE',
    'aldeia10': 'https://www.youtube.com/embed/yum4n1kHsGE',
    'aldeia11': 'https://www.youtube.com/embed/AXcJ2C_ofHo',
    'aldeia13': 'https://www.youtube.com/embed/1Ld2I2t01U8',
    'aldeia14': 'https://www.youtube.com/embed/VVTfkbrvxZs',
    'aldeia15': 'https://www.youtube.com/embed/7Xt-wM3po2w',
    'aldeia16': 'https://www.youtube.com/embed/wzXQT6O-N8c',
    'aldeia17': 'https://www.youtube.com/embed/-BREiQHALvE',
    'aldeia18': 'https://www.youtube.com/embed/fSLgQd3QuRg',
    'aldeia19': 'https://www.youtube.com/embed/yOn8nVP6qpI',
    'aldeia20': 'https://www.youtube.com/embed/ufv3fKPHk60',
    'aldeia21': 'https://www.youtube.com/embed/mRfa7KPkoMU',
    'aldeia22': 'https://www.youtube.com/embed/-tLEHM4TRhw',
    'aldeia23': 'https://www.youtube.com/embed/yum4n1kHsGE',
    'aldeia24': 'https://www.youtube.com/embed/jjl3-7MpHZg',
    'aldeia25': 'https://www.youtube.com/embed/jm-RxazV9w4',
    'aldeia26': 'https://www.youtube.com/embed/ClCXAq2uy6c',
    'aldeia27': 'https://www.youtube.com/embed/5IrPkutF9z4',
    'aldeia28': 'https://www.youtube.com/embed/A79kDuycPs4'
};

// Função para detectar suporte a WebP
function supportsWebP() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = function () {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// Função para obter a extensão de imagem correta
async function getImageExtension() {
    const webPSupported = await supportsWebP();
    return webPSupported ? 'webp' : 'jpeg';
}

// Função para criar srcset responsivo
function createSrcSet(baseName, extension) {
    const sizes = [400, 600, 800, 1200];
    return sizes.map(size => `fotos/webp/${baseName}-${size}w.${extension} ${size}w`).join(', ');
}

// Função para criar imagem responsiva com fallback
async function createResponsiveImage(baseName, alt, className = '') {
    const extension = await getImageExtension();
    const srcset = createSrcSet(baseName, extension);
    const fallbackSrc = `fotos/${baseName}.${extension === 'webp' ? 'jpeg' : extension}`;
    
    return `
        <picture>
            <source srcset="${srcset}" type="image/webp">
            <img src="${fallbackSrc}" 
                 alt="${alt}" 
                 class="${className}"
                 loading="lazy"
                 width="300" 
                 height="300">
        </picture>
    `;
}

// Função para mostrar popup de informações
function showInfo(aldeiaId) {
    const popup = document.getElementById('info-popup');
    const content = document.getElementById('info-content');
    
    if (!popup || !content) return;
    
    content.innerHTML = '';
    const data = aldeiaData[aldeiaId];
    
    if (!data) return;
    
    if (Array.isArray(data)) {
        data.forEach(professor => {
            const professorInfo = `
                <img src="${professor.image}" class="info-image" alt="${professor.title}" loading="lazy" />
                <div class="info-text">
                    <p><strong>${professor.title}</strong></p>
                    <p>${professor.description}</p>
                </div>
            `;
            content.innerHTML += professorInfo;
        });
    } else {
        const professorInfo = `
            <img src="${data.image}" class="info-image" alt="${data.title}" loading="lazy" />
            <div class="info-text">
                <p><strong>${data.title}</strong></p>
                <p>${data.description}</p>
            </div>
        `;
        content.innerHTML = professorInfo;
    }
    
    popup.style.display = 'block';
}

// Função para fechar popup
function hideInfo() {
    const popup = document.getElementById('info-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Função para navegação por teclado
function setupKeyboardNavigation() {
    // Fechar popup com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideInfo();
            const welcomePopup = document.getElementById('oi-popup');
            if (welcomePopup) {
                welcomePopup.style.display = 'none';
            }
        }
    });

    // Navegação por tab nos vídeos
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Vídeo ${index + 1} - Clique para assistir`);
        
        item.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const iframe = item.querySelector('iframe');
                if (iframe && iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                }
            }
        });
    });
}

// Função para redirecionar para vídeo
function redirectToVideoPage(aldeiaId) {
    const videoLink = videoLinks[aldeiaId];
    if (!videoLink) return;
    
    const newPageContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vídeo da Aldeia - LINDI</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body, html { height: 100%; display: flex; justify-content: center; align-items: center; background-color: black; }
                iframe { width: 100vw; height: 100vh; border: none; }
            </style>
        </head>
        <body>
            <iframe src="${videoLink}" 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen>
            </iframe>
        </body>
        </html>
    `;
    
    const newWindow = window.open();
    newWindow.document.write(newPageContent);
    newWindow.document.close();
}

// Função para redirecionar para página HTML
function redirectToHTML(aldeiaId) {
    window.location.href = aldeiaId + ".html";
}

// Função para lazy loading de vídeos
function lazyLoadVideos() {
    const videos = document.querySelectorAll('.lazy-video');
    
    if (!videos.length) return;
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.src = video.dataset.src;
                observer.unobserve(video);
            }
        });
    });
    
    videos.forEach(video => observer.observe(video));
}

// Função para buscar dados dos professores
async function buscarProfessores() {
    try {
        const response = await fetch('professores.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        inserirVideos(data);
    } catch (error) {
        console.error('Erro ao carregar os dados dos professores:', error);
        const noDataElement = document.getElementById('noData');
        if (noDataElement) {
            noDataElement.textContent = 'Erro ao carregar os dados dos professores.';
            noDataElement.style.display = 'block';
        }
    }
}

// Exportar funções para uso global
window.LindiflixUtils = {
    aldeiaData,
    videoLinks,
    showInfo,
    hideInfo,
    redirectToVideoPage,
    redirectToHTML,
    lazyLoadVideos,
    buscarProfessores,
    createResponsiveImage,
    supportsWebP,
    setupKeyboardNavigation
};
