document.querySelector(".top-selection").addEventListener("click", e => {
	if(e.target.tagName !== "BUTTON") return;
  if(!e.target.classList.contains("selected")) e.target.parentElement.querySelector(".selected")?.classList.remove("selected");
  e.target.classList.add("selected");
}, {passive: true})