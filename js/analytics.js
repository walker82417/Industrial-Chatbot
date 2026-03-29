// Vercel Web Analytics
// This file initializes Vercel Analytics for the application

(function() {
    // Initialize analytics queue if it doesn't exist
    if (window.va) return;
    
    window.va = function a() {
        var params = Array.prototype.slice.call(arguments);
        (window.vaq = window.vaq || []).push(params);
    };

    // Inject the Vercel Analytics script
    var script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    document.head.appendChild(script);
})();
