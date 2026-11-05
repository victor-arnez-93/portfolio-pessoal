/* ARNZ LABS — tema, idiomas e movimentos discretos, sem dependências. */
(() => {
  'use strict';
  const root = document.documentElement;
  const theme = document.getElementById('theme-toggle');
  const languageToggle = document.querySelector('.language-toggle');
  const languageMenu = document.getElementById('language-menu');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Modo privado. */ } }
  };
  const pt = {
    skip: 'Ir para o conteúdo', about: 'Sobre', work: 'O que faço', contact: 'Contato',
    independent: 'DESENVOLVEDOR INDEPENDENTE', hello: 'Olá, eu sou', name: 'Victor Arnez.',
    lead: 'Transformo ideias em experiências digitais <strong>funcionais e bem construídas.</strong>',
    bio: 'Estudante de Gestão da Tecnologia da Informação na <strong>Fatec Tatuí</strong> · SP · Brasil.<br>Desenvolvimento web, sistemas e aplicativos com atenção à interface e à experiência de uso.',
    cta: 'Conheça meu trabalho', skills: 'WEB <span>/</span> SISTEMAS <span>/</span> APPS',
    portraitCaption: 'Desenvolvimento & tecnologia', practice: 'NA PRÁTICA', create: 'O que eu crio',
    specialty: 'Interfaces que fazem sentido para cada necessidade.',
    creation: 'Crio dashboards personalizados para organizar processos, acompanhar indicadores e apoiar decisões. Desenvolvo também landing pages, sites institucionais, sistemas web e aplicativos — com foco em front-end e experiência de uso.',
    projects: 'Alguns dos meus projetos:',
    fluux: 'Dashboard para organizar demandas, acompanhar atividades e visualizar indicadores.',
    visus: 'Premium Media Player para Android TV, Google TV, smartphones e tablets Android.',
    pdv: 'Sistema web de ponto de venda, com caixa, comandas e visão do negócio.',
    disc: 'Dashboard específico para organizar e visualizar informações de perfis DISC.',
    connect: 'VAMOS NOS CONECTAR', ideas: 'Projetos, tecnologia e boas ideias.', by: 'Por Victor Arnez · Brasil', top: 'Voltar ao topo ↑',
    nav: 'Navegação principal', language: 'Selecionar idioma', theme: 'Tema escuro', social: 'Redes sociais',
    portrait: 'Victor Arnez de braços cruzados', description: 'Victor Arnez — desenvolvedor independente. Sites, sistemas web e aplicativos, com foco em interfaces práticas e experiências digitais.'
  };
  const translations = {
    'pt-BR': pt,
    en: {
      skip: 'Skip to content', about: 'About', work: 'What I do', contact: 'Contact',
      independent: 'INDEPENDENT DEVELOPER', hello: 'Hi, I am', name: 'Victor Arnez.',
      lead: 'I turn ideas into <strong>functional, thoughtfully built</strong> digital experiences.',
      bio: 'Information Technology Management student at <strong>Fatec Tatuí</strong> · São Paulo · Brazil.<br>Web development, systems and apps with attention to interfaces and user experience.',
      cta: 'Explore my work', skills: 'WEB <span>/</span> SYSTEMS <span>/</span> APPS',
      portraitCaption: 'Development & technology', practice: 'IN PRACTICE', create: 'What I create',
      specialty: 'Interfaces designed around specific needs.',
      creation: 'I build custom dashboards to organize processes, track indicators and support decisions. I also develop landing pages, business websites, web systems and apps — with a focus on front-end and user experience.',
      projects: 'A few of my projects:',
      fluux: 'A dashboard to organize requests, track activities and visualize key indicators.',
      visus: 'Premium Media Player for Android TV, Google TV, Android smartphones and tablets.',
      pdv: 'A web-based point of sale system with checkout, tabs and business insights.',
      disc: 'A dedicated dashboard to organize and visualize DISC profile information.',
      connect: 'LET’S CONNECT', ideas: 'Projects, technology and good ideas.', by: 'By Victor Arnez · Brazil', top: 'Back to top ↑',
      nav: 'Main navigation', language: 'Select language', theme: 'Dark theme', social: 'Social networks',
      portrait: 'Victor Arnez with his arms crossed', description: 'Victor Arnez — independent developer. Websites, web systems and apps focused on practical interfaces and digital experiences.'
    },
    es: {
      skip: 'Ir al contenido', about: 'Sobre mí', work: 'Qué hago', contact: 'Contacto',
      independent: 'DESARROLLADOR INDEPENDIENTE', hello: 'Hola, soy', name: 'Victor Arnez.',
      lead: 'Transformo ideas en experiencias digitales <strong>funcionales y bien construidas.</strong>',
      bio: 'Estudiante de Gestión de Tecnología de la Información en <strong>Fatec Tatuí</strong> · São Paulo · Brasil.<br>Desarrollo web, sistemas y aplicaciones con atención a la interfaz y a la experiencia de uso.',
      cta: 'Conoce mi trabajo', skills: 'WEB <span>/</span> SISTEMAS <span>/</span> APPS',
      portraitCaption: 'Desarrollo y tecnología', practice: 'EN LA PRÁCTICA', create: 'Lo que creo',
      specialty: 'Interfaces pensadas para cada necesidad.',
      creation: 'Creo dashboards personalizados para organizar procesos, seguir indicadores y apoyar decisiones. También desarrollo landing pages, sitios corporativos, sistemas web y aplicaciones, con foco en front-end y experiencia de uso.',
      projects: 'Algunos de mis proyectos:',
      fluux: 'Dashboard para organizar solicitudes, seguir actividades y visualizar indicadores.',
      visus: 'Premium Media Player para Android TV, Google TV, smartphones y tablets Android.',
      pdv: 'Sistema web de punto de venta con caja, cuentas de consumo y visión del negocio.',
      disc: 'Dashboard específico para organizar y visualizar información de perfiles DISC.',
      connect: 'CONECTEMOS', ideas: 'Proyectos, tecnología y buenas ideas.', by: 'Por Victor Arnez · Brasil', top: 'Volver arriba ↑',
      nav: 'Navegación principal', language: 'Seleccionar idioma', theme: 'Tema oscuro', social: 'Redes sociales',
      portrait: 'Victor Arnez con los brazos cruzados', description: 'Victor Arnez — desarrollador independiente. Sitios, sistemas web y aplicaciones con foco en interfaces prácticas y experiencias digitales.'
    }
  };
  let typingTimer;
  function typeGreeting(text) {
    const el = document.querySelector('[data-i18n="hello"]');
    clearTimeout(typingTimer);
    if (motion.matches) { el.textContent = text; return; }
    // Preserve the final line width and full accessible text while typing.
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');
    const placeholder = document.createElement('span');
    placeholder.className = 'typing-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = text;
    el.append(placeholder, visible);
    let index = 0;
    const step = () => {
      visible.textContent = text.slice(0, ++index);
      if (index < text.length) typingTimer = setTimeout(step, 65);
    };
    step();
  }
  function setLanguage(code, animate = true) {
    const selected = translations[code] ? code : 'pt-BR';
    const strings = translations[selected];
    root.lang = selected;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.innerHTML = strings[el.dataset.i18n];
    });
    document.querySelectorAll('[data-aria]').forEach(el => el.setAttribute('aria-label', strings[el.dataset.aria]));
    document.querySelectorAll('[data-alt]').forEach(el => el.alt = strings[el.dataset.alt]);
    document.querySelector('meta[name="description"]').content = strings.description;
    document.querySelector('meta[property="og:description"]').content = strings.description;
    document.querySelector('meta[property="og:locale"]').content = { 'pt-BR': 'pt_BR', en: 'en_US', es: 'es_ES' }[selected];
    const short = selected === 'pt-BR' ? 'pt' : selected;
    document.getElementById('current-flag').src = `assets/img/flag-${short}.webp`;
    document.getElementById('current-language').textContent = short.toUpperCase();
    languageMenu.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === selected));
    });
    if (animate) typeGreeting(strings.hello);
    storage.set('arnz-labs-language', selected);
  }
  function setTheme(next) {
    root.dataset.theme = next;
    theme.checked = next === 'dark';
    document.querySelector('meta[name="theme-color"]').content = next === 'dark' ? '#0c0b09' : '#f6f5f2';
    storage.set('arnz-labs-theme', next);
  }
  function closeMenu(returnFocus = false) {
    languageMenu.hidden = true;
    languageToggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) languageToggle.focus();
  }
  theme.addEventListener('change', () => setTheme(theme.checked ? 'dark' : 'light'));
  languageToggle.addEventListener('click', () => {
    const opening = languageMenu.hidden;
    languageMenu.hidden = !opening;
    languageToggle.setAttribute('aria-expanded', String(opening));
    if (opening) languageMenu.querySelector('[aria-pressed="true"]').focus();
  });
  languageMenu.addEventListener('click', event => {
    const button = event.target.closest('[data-language]');
    if (!button) return;
    setLanguage(button.dataset.language);
    closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.language-picker')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !languageMenu.hidden) closeMenu(true);
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  setTheme(storage.get('arnz-labs-theme') === 'light' ? 'light' : 'dark');
  setLanguage(storage.get('arnz-labs-language') || 'pt-BR');
  if ('IntersectionObserver' in window && !motion.matches) {
    root.classList.add('js');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
})();
