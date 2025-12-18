// ===== Helpers =====
function currentFile(){
  const f = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  return f;
}

function setActiveNav(){
  const file = currentFile();
  document.querySelectorAll("[data-nav]").forEach(a=>{
    if ((a.getAttribute("href") || "").toLowerCase() === file) a.classList.add("active");
  });
}

function showFeedback(el, type, html){
  if (!el) return;
  el.innerHTML = `<div class="alert ${type}">${html}</div>`;
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", ()=>{
  setActiveNav();

  // Mobile nav toggle (ARIA)
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("primaryNav");
  if (menuBtn && nav){
    menuBtn.addEventListener("click", ()=>{
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Contact form validation + user feedback
  const form = document.getElementById("contactForm");
  if (form){
    const feedback = document.getElementById("formFeedback");

    form.addEventListener("submit", (e)=>{
      e.preventDefault();

      // HTML5 validity first
      if (!form.checkValidity()){
        // Force browser to show built-in messages visually (and keep our own message)
        form.reportValidity();
        showFeedback(feedback, "bad", "Please fix the highlighted fields and try again.");
        return;
      }

      // Extra JS validation (email format + message length safety)
      const email = document.getElementById("email").value.trim();
      const msg = document.getElementById("message").value.trim();

      if (!/^\S+@\S+\.\S+$/.test(email)){
        showFeedback(feedback, "bad", "Please enter a valid email address.");
        return;
      }
      if (msg.length < 10){
        showFeedback(feedback, "bad", "Description must be at least 10 characters.");
        return;
      }

      showFeedback(
        feedback,
        "ok",
        "Success! Your request was submitted (prototype). No real data was stored or sent."
      );

      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Media gallery: thumbnail -> modal large view
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const thumbs = document.querySelectorAll(".thumb");

  function closeModal(){
    if (!modal) return;
    modal.hidden = true;
    modalImg && (modalImg.src = "");
  }

  if (thumbs.length && modal && modalImg){
    thumbs.forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const full = btn.getAttribute("data-full");
        modalImg.src = full;
        modal.hidden = false;
        // Move focus to close button for accessibility
        const closeBtn = modal.querySelector("[data-close='true']");
        closeBtn && closeBtn.focus();
      });
    });

    modal.addEventListener("click", (e)=>{
      const target = e.target;
      if (target && target.getAttribute && target.getAttribute("data-close") === "true"){
        closeModal();
      }
    });

    document.addEventListener("keydown", (e)=>{
      if (e.key === "Escape" && !modal.hidden){
        closeModal();
      }
    });
  }
});
