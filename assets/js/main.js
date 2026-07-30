/* =========================================================
   PORTFÓLIO PESSOAL — VICTOR ARNEZ
   Arquivo: assets/js/main.js
========================================================= */

(() => {
  "use strict";

  /* =======================================================
     1. CONFIGURAÇÕES GERAIS
  ======================================================= */

  const CONFIG = {
    whatsapp: {
      /*
       * Preencha somente com números.
       *
       * Exemplo fictício:
       * countryCode: "55"
       * areaCode: "15"
       * number: "999999999"
       *
       * O endereço do WhatsApp será montado apenas
       * quando o usuário clicar em um dos botões.
       */

      countryCode: "55",
      areaCode: "15",
      number: "974482291",

      message:
        "Olá, Victor! Acessei seu portfólio e gostaria de conversar sobre um projeto."
    },

    breakpoints: {
      mobileMenu: 980,
      pointerEffects: 900
    },

    loader: {
      minimumDuration: 650,
      maximumDuration: 2800
    }
  };


  /* =======================================================
     2. ELEMENTOS PRINCIPAIS
  ======================================================= */

  const body = document.body;

  const pageLoader = document.querySelector(".page-loader");
  const siteHeader = document.querySelector(".site-header");

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  const mobileNavigationLinks = document.querySelectorAll(
    ".mobile-navigation a"
  );

  const desktopNavigationLinks = document.querySelectorAll(
    ".desktop-navigation a"
  );

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );

  const cursorLight = document.querySelector(".cursor-light");

  const profileCard = document.querySelector(".profile-card");
  const heroVisual = document.querySelector("[data-hero-visual]");

  const whatsappButtons = [
    document.getElementById("header-whatsapp-button"),
    document.getElementById("mobile-whatsapp-button"),
    document.getElementById("social-whatsapp-button"),
    document.getElementById("contact-whatsapp-button")
  ].filter(Boolean);

  const currentYearElement = document.getElementById("current-year");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  const supportsGSAP =
    typeof window.gsap !== "undefined";

  const supportsScrollTrigger =
    typeof window.ScrollTrigger !== "undefined";


  /* =======================================================
     3. FUNÇÕES UTILITÁRIAS
  ======================================================= */

  function onlyNumbers(value) {
    return String(value ?? "").replace(/\D/g, "");
  }


  function isPlaceholderValue(value) {
    const normalizedValue = String(value ?? "").toLowerCase();

    return (
      normalizedValue.length === 0 ||
      normalizedValue.includes("seu_numero") ||
      normalizedValue.includes("numero_aqui")
    );
  }


  function getHeaderHeight() {
    return siteHeader
      ? siteHeader.getBoundingClientRect().height
      : 0;
  }


  function elementExists(element) {
    return element instanceof Element;
  }


  function debounce(callback, delay = 150) {
    let timer;

    return (...args) => {
      window.clearTimeout(timer);

      timer = window.setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }


  function requestFrame(callback) {
    return window.requestAnimationFrame(callback);
  }


  /* =======================================================
     4. ANO AUTOMÁTICO
  ======================================================= */

  function updateCurrentYear() {
    if (!currentYearElement) {
      return;
    }

    currentYearElement.textContent =
      String(new Date().getFullYear());
  }


  /* =======================================================
     5. TELA DE CARREGAMENTO
  ======================================================= */

  const loaderStartTime = performance.now();

  function hidePageLoader() {
    if (!pageLoader || pageLoader.classList.contains("is-hidden")) {
      return;
    }

    const elapsedTime = performance.now() - loaderStartTime;

    const remainingTime = Math.max(
      CONFIG.loader.minimumDuration - elapsedTime,
      0
    );

    window.setTimeout(() => {
      pageLoader.classList.add("is-hidden");

      window.setTimeout(() => {
        pageLoader.remove();
      }, 700);
    }, remainingTime);
  }


  function initializeLoader() {
    if (!pageLoader) {
      return;
    }

    if (document.readyState === "complete") {
      hidePageLoader();
    } else {
      window.addEventListener(
        "load",
        hidePageLoader,
        { once: true }
      );
    }

    /*
     * Segurança para impedir que o carregamento permaneça
     * visível caso algum recurso externo demore ou falhe.
     */

    window.setTimeout(
      hidePageLoader,
      CONFIG.loader.maximumDuration
    );
  }


  /* =======================================================
     6. HEADER DURANTE A ROLAGEM
  ======================================================= */

  function updateHeaderState() {
    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle(
      "is-scrolled",
      window.scrollY > 24
    );
  }


  function initializeHeaderScroll() {
    updateHeaderState();

    window.addEventListener(
      "scroll",
      updateHeaderState,
      { passive: true }
    );
  }


  /* =======================================================
     7. MENU MOBILE
  ======================================================= */

  function setMenuState(open) {
    if (!menuToggle || !mobileMenu) {
      return;
    }

    menuToggle.classList.toggle("is-active", open);
    mobileMenu.classList.toggle("is-open", open);
    body.classList.toggle("menu-open", open);

    menuToggle.setAttribute(
      "aria-expanded",
      String(open)
    );

    menuToggle.setAttribute(
      "aria-label",
      open ? "Fechar menu" : "Abrir menu"
    );

    mobileMenu.setAttribute(
      "aria-hidden",
      String(!open)
    );
  }


  function openMobileMenu() {
    setMenuState(true);
  }


  function closeMobileMenu() {
    setMenuState(false);
  }


  function toggleMobileMenu() {
    if (!mobileMenu) {
      return;
    }

    const menuIsOpen =
      mobileMenu.classList.contains("is-open");

    setMenuState(!menuIsOpen);
  }


  function initializeMobileMenu() {
    if (!menuToggle || !mobileMenu) {
      return;
    }

    menuToggle.addEventListener(
      "click",
      toggleMobileMenu
    );

    mobileNavigationLinks.forEach((link) => {
      link.addEventListener(
        "click",
        closeMobileMenu
      );
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    window.addEventListener(
      "resize",
      debounce(() => {
        if (
          window.innerWidth >
          CONFIG.breakpoints.mobileMenu
        ) {
          closeMobileMenu();
        }
      }, 120)
    );
  }


  /* =======================================================
     8. ROLAGEM SUAVE DOS LINKS INTERNOS
  ======================================================= */

  function scrollToSection(targetElement) {
    if (!targetElement) {
      return;
    }

    const targetPosition =
      targetElement.getBoundingClientRect().top +
      window.scrollY -
      getHeaderHeight() -
      18;

    window.scrollTo({
      top: Math.max(targetPosition, 0),
      behavior: prefersReducedMotion.matches
        ? "auto"
        : "smooth"
    });
  }


  function initializeSmoothNavigation() {
    internalLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetSelector =
          link.getAttribute("href");

        if (
          !targetSelector ||
          targetSelector === "#"
        ) {
          return;
        }

        let targetElement;

        try {
          targetElement =
            document.querySelector(targetSelector);
        } catch (error) {
          console.warn(
            "Destino de navegação inválido:",
            targetSelector
          );

          return;
        }

        if (!targetElement) {
          return;
        }

        event.preventDefault();

        closeMobileMenu();
        scrollToSection(targetElement);

        if (
          window.history &&
          window.history.replaceState
        ) {
          window.history.replaceState(
            null,
            "",
            targetSelector
          );
        }
      });
    });
  }


  /* =======================================================
     9. LINK ATIVO NO MENU
  ======================================================= */

  function initializeActiveNavigation() {
    const sectionIds = [
      "inicio",
      "sobre",
      "atuacao",
      "projetos",
      "conectar"
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (
      sections.length === 0 ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const allNavigationLinks = [
      ...desktopNavigationLinks,
      ...mobileNavigationLinks
    ];

    function activateNavigationLink(sectionId) {
      allNavigationLinks.forEach((link) => {
        const linkTarget =
          link.getAttribute("href");

        link.classList.toggle(
          "is-active",
          linkTarget === `#${sectionId}`
        );
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio -
              first.intersectionRatio
          );

        if (visibleEntries.length === 0) {
          return;
        }

        activateNavigationLink(
          visibleEntries[0].target.id
        );
      },
      {
        root: null,
        rootMargin: "-28% 0px -56% 0px",
        threshold: [
          0.05,
          0.15,
          0.3,
          0.5,
          0.75
        ]
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }


  /* =======================================================
     10. WHATSAPP
  ======================================================= */

  function createWhatsAppUrl() {
    const countryCode = onlyNumbers(
      CONFIG.whatsapp.countryCode
    );

    const areaCode = onlyNumbers(
      CONFIG.whatsapp.areaCode
    );

    const phoneNumber = onlyNumbers(
      CONFIG.whatsapp.number
    );

    if (
      !countryCode ||
      !areaCode ||
      !phoneNumber ||
      isPlaceholderValue(CONFIG.whatsapp.number)
    ) {
      console.warn(
        "Preencha o número do WhatsApp em assets/js/main.js."
      );

      return null;
    }

    const completeNumber =
      `${countryCode}${areaCode}${phoneNumber}`;

    const encodedMessage = encodeURIComponent(
      CONFIG.whatsapp.message
    );

    return (
      `https://wa.me/${completeNumber}` +
      `?text=${encodedMessage}`
    );
  }


  function openWhatsApp() {
    const whatsappUrl = createWhatsAppUrl();

    if (!whatsappUrl) {
      return;
    }

    /*
     * O endereço é criado apenas neste momento.
     * Por isso, o número não aparece no HTML nem ao
     * passar o mouse sobre os botões.
     */

    const newWindow = window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (newWindow) {
      newWindow.opener = null;
    }
  }


  function initializeWhatsAppButtons() {
    whatsappButtons.forEach((button) => {
      button.addEventListener(
        "click",
        openWhatsApp
      );
    });
  }


  /* =======================================================
     11. LUZ QUE ACOMPANHA O CURSOR
  ======================================================= */

  function initializeCursorLight() {
    if (
      !cursorLight ||
      !hasFinePointer.matches ||
      window.innerWidth <
        CONFIG.breakpoints.pointerEffects ||
      prefersReducedMotion.matches
    ) {
      return;
    }

    body.classList.add("has-pointer");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let currentX = mouseX;
    let currentY = mouseY;

    let animationFrameId = null;

    function renderCursor() {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      cursorLight.style.transform =
        `translate3d(${currentX - 170}px, ` +
        `${currentY - 170}px, 0)`;

      animationFrameId =
        requestFrame(renderCursor);
    }

    document.addEventListener(
      "pointermove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseleave",
      () => {
        cursorLight.style.opacity = "0";
      }
    );

    document.addEventListener(
      "mouseenter",
      () => {
        cursorLight.style.opacity = "";
      }
    );

    renderCursor();

    window.addEventListener(
      "beforeunload",
      () => {
        if (animationFrameId !== null) {
          window.cancelAnimationFrame(
            animationFrameId
          );
        }
      },
      { once: true }
    );
  }


  /* =======================================================
     12. LUZ INTERATIVA NOS CARDS DE ATUAÇÃO
  ======================================================= */

  function initializeServiceCardLight() {
    if (
      !hasFinePointer.matches ||
      prefersReducedMotion.matches
    ) {
      return;
    }

    const serviceCards = document.querySelectorAll(
      "[data-service-card]"
    );

    serviceCards.forEach((card) => {
      card.addEventListener(
        "pointermove",
        (event) => {
          const cardRect =
            card.getBoundingClientRect();

          const mouseX =
            event.clientX - cardRect.left;

          const mouseY =
            event.clientY - cardRect.top;

          card.style.setProperty(
            "--mouse-x",
            `${mouseX}px`
          );

          card.style.setProperty(
            "--mouse-y",
            `${mouseY}px`
          );
        }
      );
    });
  }


  /* =======================================================
     13. INCLINAÇÃO SUAVE DO CARD DE PERFIL
  ======================================================= */

  function initializeProfileCardTilt() {
    if (
      !profileCard ||
      !heroVisual ||
      !hasFinePointer.matches ||
      window.innerWidth <
        CONFIG.breakpoints.pointerEffects ||
      prefersReducedMotion.matches
    ) {
      return;
    }

    const maximumRotation = 4.5;

    heroVisual.addEventListener(
      "pointermove",
      (event) => {
        const visualRect =
          heroVisual.getBoundingClientRect();

        const relativeX =
          (event.clientX - visualRect.left) /
          visualRect.width;

        const relativeY =
          (event.clientY - visualRect.top) /
          visualRect.height;

        const rotationY =
          (relativeX - 0.5) *
          maximumRotation *
          2;

        const rotationX =
          (0.5 - relativeY) *
          maximumRotation *
          2;

        if (supportsGSAP) {
          window.gsap.to(profileCard, {
            rotationX,
            rotationY,
            transformPerspective: 1100,
            transformOrigin: "center",
            duration: 0.55,
            ease: "power3.out",
            overwrite: "auto"
          });
        } else {
          profileCard.style.transform =
            `perspective(1100px) ` +
            `rotateX(${rotationX}deg) ` +
            `rotateY(${rotationY}deg)`;
        }
      }
    );

    heroVisual.addEventListener(
      "pointerleave",
      () => {
        if (supportsGSAP) {
          window.gsap.to(profileCard, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.75,
            ease: "power3.out",
            overwrite: "auto"
          });
        } else {
          profileCard.style.transform = "";
        }
      }
    );
  }


  /* =======================================================
     14. COMPORTAMENTO DAS IMAGENS
  ======================================================= */

  function initializeImageFallbacks() {
    const images = document.querySelectorAll("img");

    images.forEach((image) => {
      image.addEventListener(
        "error",
        () => {
          image.classList.add("image-load-error");

          console.warn(
            `Não foi possível carregar a imagem: ${image.src}`
          );
        },
        { once: true }
      );
    });
  }


  /* =======================================================
     15. ANIMAÇÃO PRINCIPAL DO HERO
  ======================================================= */

  function animateHero() {
    if (
      !supportsGSAP ||
      prefersReducedMotion.matches
    ) {
      return;
    }

    const gsap = window.gsap;

    const heroWords = document.querySelectorAll(
      ".hero__title-word"
    );

    const heroItems = document.querySelectorAll(
      "[data-hero-item]"
    );

    const profileVisual = document.querySelector(
      "[data-hero-visual]"
    );

    const timeline = gsap.timeline({
      defaults: {
        ease: "power4.out"
      }
    });

    timeline
      .from(heroWords, {
        yPercent: 115,
        opacity: 0,
        duration: 1.15,
        stagger: 0.075
      })
      .from(
        heroItems,
        {
          y: 25,
          opacity: 0,
          duration: 0.8,
          stagger: 0.11
        },
        "-=0.72"
      );

    if (profileVisual) {
      timeline.from(
        profileVisual,
        {
          x: 45,
          y: 24,
          scale: 0.94,
          opacity: 0,
          duration: 1.1
        },
        "-=1.02"
      );
    }
  }


  /* =======================================================
     16. ELEMENTOS FLUTUANTES
  ======================================================= */

  function animateFloatingElements() {
    if (
      !supportsGSAP ||
      prefersReducedMotion.matches
    ) {
      return;
    }

    const gsap = window.gsap;

    const developmentCard =
      document.querySelector(
        ".floating-card--development"
      );

    const strategyCard =
      document.querySelector(
        ".floating-card--strategy"
      );

    if (developmentCard) {
      gsap.to(developmentCard, {
        y: -12,
        rotation: -1.2,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    }

    if (strategyCard) {
      gsap.to(strategyCard, {
        y: 13,
        rotation: 1.2,
        duration: 3.8,
        delay: 0.35,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    }
  }


  /* =======================================================
     17. ANIMAÇÕES COM SCROLLTRIGGER
  ======================================================= */

  function initializeScrollAnimations() {
    if (
      !supportsGSAP ||
      !supportsScrollTrigger ||
      prefersReducedMotion.matches
    ) {
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    gsap.registerPlugin(ScrollTrigger);

    /*
     * Cabeçalhos de seção
     */

    gsap.utils
      .toArray(".section-heading")
      .forEach((heading) => {
        const headingChildren =
          heading.children;

        gsap.from(headingChildren, {
          scrollTrigger: {
            trigger: heading,
            start: "top 84%",
            once: true
          },
          y: 35,
          opacity: 0,
          duration: 0.9,
          stagger: 0.11,
          ease: "power3.out"
        });
      });

    /*
     * Blocos genéricos com data-reveal
     */

    gsap.utils
      .toArray("[data-reveal]")
      .forEach((element) => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          },
          y: 38,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out"
        });
      });

    /*
     * Cards das áreas de atuação
     */

    const serviceCards = gsap.utils.toArray(
      "[data-service-card]"
    );

    if (serviceCards.length > 0) {
      gsap.from(serviceCards, {
        scrollTrigger: {
          trigger: ".services__grid",
          start: "top 82%",
          once: true
        },
        y: 55,
        opacity: 0,
        duration: 0.95,
        stagger: 0.12,
        ease: "power3.out"
      });
    }

    /*
     * Cards dos projetos
     */

    const projectCards = gsap.utils.toArray(
      "[data-project-card]"
    );

    projectCards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true
        },
        y: 55,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    });

    /*
     * Etapas do processo
     */

    const processSteps = gsap.utils.toArray(
      "[data-process-step]"
    );

    if (processSteps.length > 0) {
      gsap.from(processSteps, {
        scrollTrigger: {
          trigger: ".process__list",
          start: "top 85%",
          once: true
        },
        x: -32,
        opacity: 0,
        duration: 0.82,
        stagger: 0.1,
        ease: "power3.out"
      });
    }

    /*
     * Cards das redes sociais
     */

    const socialCards = gsap.utils.toArray(
      "[data-social-card]"
    );

    if (socialCards.length > 0) {
      gsap.from(socialCards, {
        scrollTrigger: {
          trigger: ".connections__grid",
          start: "top 85%",
          once: true
        },
        y: 36,
        opacity: 0,
        duration: 0.82,
        stagger: 0.09,
        ease: "power3.out"
      });
    }

    /*
     * Caixa final de contato
     */

    const contactBox =
      document.querySelector(".contact__box");

    if (contactBox) {
      gsap.from(contactBox, {
        scrollTrigger: {
          trigger: contactBox,
          start: "top 86%",
          once: true
        },
        y: 55,
        scale: 0.975,
        opacity: 0,
        duration: 1.05,
        ease: "power3.out"
      });
    }

    /*
     * Parallax leve na imagem de fundo do hero
     */

    const heroBackground =
      document.querySelector(
        ".hero__background-image"
      );

    if (heroBackground) {
      gsap.to(heroBackground, {
        yPercent: 10,
        ease: "none",

        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8
        }
      });
    }

    /*
     * Movimento suave do card de perfil durante a rolagem
     */

    if (heroVisual) {
      gsap.to(heroVisual, {
        y: 48,
        ease: "none",

        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });
    }

    ScrollTrigger.refresh();
  }


  /* =======================================================
     18. ANIMAÇÕES SEM GSAP
  ======================================================= */

  function initializeFallbackReveals() {
    if (
      supportsGSAP ||
      prefersReducedMotion.matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const revealElements =
      document.querySelectorAll(
        [
          "[data-reveal]",
          "[data-service-card]",
          "[data-project-card]",
          "[data-process-step]",
          "[data-social-card]"
        ].join(",")
      );

    revealElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform =
        "translateY(28px)";
      element.style.transition =
        "opacity 700ms ease, transform 700ms ease";
    });

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.style.opacity = "1";
            entry.target.style.transform =
              "translateY(0)";

            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12
        }
      );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }


  /* =======================================================
     19. ATUALIZAÇÃO APÓS REDIMENSIONAMENTO
  ======================================================= */

  function initializeResizeUpdates() {
    window.addEventListener(
      "resize",
      debounce(() => {
        if (
          supportsScrollTrigger &&
          typeof window.ScrollTrigger
            .refresh === "function"
        ) {
          window.ScrollTrigger.refresh();
        }
      }, 220)
    );
  }


  /* =======================================================
     20. TRATAMENTO DA PREFERÊNCIA DE MOVIMENTO
  ======================================================= */

  function initializeMotionPreferenceWatcher() {
    const reloadOnPreferenceChange = () => {
      window.location.reload();
    };

    if (
      typeof prefersReducedMotion
        .addEventListener === "function"
    ) {
      prefersReducedMotion.addEventListener(
        "change",
        reloadOnPreferenceChange
      );
    }
  }


  /* =======================================================
     21. INICIALIZAÇÃO
  ======================================================= */

  function initializeApplication() {
    updateCurrentYear();

    initializeLoader();
    initializeHeaderScroll();

    initializeMobileMenu();
    initializeSmoothNavigation();
    initializeActiveNavigation();

    initializeWhatsAppButtons();

    initializeCursorLight();
    initializeServiceCardLight();
    initializeProfileCardTilt();

    initializeImageFallbacks();

    animateHero();
    animateFloatingElements();
    initializeScrollAnimations();
    initializeFallbackReveals();

    initializeResizeUpdates();
    initializeMotionPreferenceWatcher();
  }


  /* =======================================================
     22. EXECUÇÃO
  ======================================================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeApplication,
      { once: true }
    );
  } else {
    initializeApplication();
  }
})();