// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="titlepage.html">Bhikkhu Manual</a></li><li class="chapter-item expanded affix "><a href="first-lines.html">List of First Lines</a></li><li class="chapter-item expanded "><a href="essential-chants.html"><strong aria-hidden="true">1.</strong> Essential Chants</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chants/morning-chanting.html"><strong aria-hidden="true">1.1.</strong> Morning Chanting</a></li><li class="chapter-item expanded "><a href="chants/evening-chanting.html"><strong aria-hidden="true">1.2.</strong> Evening Chanting</a></li><li class="chapter-item expanded "><a href="chants/reflections.html"><strong aria-hidden="true">1.3.</strong> Reflections</a></li><li class="chapter-item expanded "><a href="chants/parittas.html"><strong aria-hidden="true">1.4.</strong> Paritta Chants</a></li><li class="chapter-item expanded "><a href="chants/anumodana.html"><strong aria-hidden="true">1.5.</strong> Anumodanā</a></li><li class="chapter-item expanded "><a href="chants/funeral-chants.html"><strong aria-hidden="true">1.6.</strong> Funeral Chants</a></li><li class="chapter-item expanded "><a href="chants/suttas.html"><strong aria-hidden="true">1.7.</strong> Suttas</a></li><li class="chapter-item expanded "><a href="chants/patimokkha-chants.html"><strong aria-hidden="true">1.8.</strong> Pāṭimokkha Chants</a></li><li class="chapter-item expanded "><a href="chants/sri-lanka.html"><strong aria-hidden="true">1.9.</strong> Chants Used in Sri Lanka</a></li></ol></li><li class="chapter-item expanded "><a href="vinaya-notes.html"><strong aria-hidden="true">2.</strong> Vinaya Notes</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="vinaya/guidelines.html"><strong aria-hidden="true">2.1.</strong> Guidelines</a></li><li class="chapter-item expanded "><a href="vinaya/requisites.html"><strong aria-hidden="true">2.2.</strong> Requisites</a></li><li class="chapter-item expanded "><a href="vinaya/offences.html"><strong aria-hidden="true">2.3.</strong> Offences</a></li><li class="chapter-item expanded "><a href="vinaya/uposatha.html"><strong aria-hidden="true">2.4.</strong> Uposatha</a></li><li class="chapter-item expanded "><a href="vinaya/rains-and-kathina.html"><strong aria-hidden="true">2.5.</strong> Rains and Kathina</a></li><li class="chapter-item expanded "><a href="vinaya/other-procedures.html"><strong aria-hidden="true">2.6.</strong> Other Procedures</a></li><li class="chapter-item expanded "><a href="vinaya/useful-notes.html"><strong aria-hidden="true">2.7.</strong> Useful Notes</a></li></ol></li><li class="chapter-item expanded "><a href="appendix.html"><strong aria-hidden="true">3.</strong> Appendix</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="pali-phonetics-and-pronunciation.html"><strong aria-hidden="true">3.1.</strong> Pāli Phonetics and Pronunciation</a></li><li class="chapter-item expanded "><a href="quotations.html"><strong aria-hidden="true">3.2.</strong> Quotations</a></li><li class="chapter-item expanded "><a href="namo-tassa.html"><strong aria-hidden="true">3.3.</strong> Namo Tassa</a></li></ol></li><li class="chapter-item expanded "><a href="print-guide.html"><strong aria-hidden="true">4.</strong> Print Guide</a></li><li class="chapter-item expanded "><a href="copyright.html"><strong aria-hidden="true">5.</strong> Copyright</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
