// Mock scrollIntoView for JSDOM (Radix Select fix)
window.HTMLElement.prototype.scrollIntoView = function() {};
