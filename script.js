(function () {
  var menuToggle = document.getElementById("menuToggle");
  var siteNav = document.getElementById("siteNav");
  var yearNode = document.getElementById("year");
  var form = document.getElementById("appointmentForm");
  var formMessage = document.getElementById("formMessage");
  var carousel = document.getElementById("heroCarousel");

  var revealTargets = document.querySelectorAll(
    ".section-heading, .service-card, .lens-options article, .learn-card, .conditions-panel, .urgent-note, .journey-steps li, .about-art, .about-copy, .optical-photo, .optical-copy, .appointment-form, .faq-list details, .contact-card"
  );
  if (revealTargets.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealTargets.forEach(function (target) {
      target.classList.add("scroll-reveal");
      revealObserver.observe(target);
    });
  }

  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  if (carousel) {
    var carouselRegion = carousel.closest(".hero-visual");
    var slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    var dots = Array.from(document.querySelectorAll("[data-carousel-slide]"));
    var caption = document.getElementById("carouselCaption");
    var count = document.getElementById("carouselCount");
    var activeSlide = 0;

    function showSlide(index) {
      activeSlide = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        var isActive = slideIndex === activeSlide;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });
      dots.forEach(function (dot, dotIndex) {
        var isActive = dotIndex === activeSlide;
        dot.classList.toggle("is-active", isActive);
        if (isActive) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      if (caption) caption.textContent = slides[activeSlide].dataset.caption;
      if (count) count.textContent = String(activeSlide + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    }

    carouselRegion.querySelector("[data-carousel-prev]").addEventListener("click", function () {
      showSlide(activeSlide - 1);
    });
    carouselRegion.querySelector("[data-carousel-next]").addEventListener("click", function () {
      showSlide(activeSlide + 1);
    });
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.dataset.carouselSlide));
      });
    });
    carouselRegion.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") showSlide(activeSlide - 1);
      if (event.key === "ArrowRight") showSlide(activeSlide + 1);
    });
    showSlide(0);
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      siteNav.classList.toggle("open", !isOpen);
    });

    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        siteNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        siteNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  if (form && formMessage) {
    var dateInput = form.querySelector('input[name="date"]');
    if (dateInput) dateInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var message = [
        "Hello, I would like to request an appointment.",
        "Name: " + data.get("name"),
        "Phone: " + data.get("phone"),
        "Preferred date: " + data.get("date"),
        "Preferred time: " + data.get("time"),
        "Reason: " + data.get("visitReason"),
        data.get("reason") ? "Additional information: " + data.get("reason") : ""
      ].filter(Boolean).join("\n");

      formMessage.textContent = "Opening WhatsApp with your request. Please review it and press Send to contact the clinic.";
      window.open("https://wa.me/919010805621?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    });
  }
})();
