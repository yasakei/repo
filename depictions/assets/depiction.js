/**
 * yasakei Depiction Framework
 * Dynamically renders tweak depictions from JSON data
 * Compatible with iOS 9+ (ES5)
 */

function Depiction(containerId) {
  this.container = document.getElementById(containerId);
  this.data = null;
}

Depiction.prototype.load = function(jsonUrl) {
  var self = this;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', jsonUrl, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          self.data = JSON.parse(xhr.responseText);
          self.render();
        } catch (e) {
          self.renderError('Failed to parse data');
        }
      } else {
        self.renderError('Failed to load data');
      }
    }
  };
  xhr.send();
};

Depiction.prototype.render = function() {
  var d = this.data;
  
  var html = this.renderHeader() +
    '<div class="container">' +
    this.renderDescription() +
    this.renderScreenshots() +
    this.renderInfo() +
    this.renderCompatibility() +
    this.renderChangelog() +
    this.renderButtons() +
    '</div>' +
    this.renderFooter();
  
  this.container.innerHTML = html;
};

Depiction.prototype.renderHeader = function() {
  var d = this.data;
  var iconHtml = d.icon ? '<img src="' + d.icon + '" alt="' + d.name + '" class="icon">' : '';
  
  return '<div class="header">' +
    iconHtml +
    '<h1>' + this.escapeHtml(d.name) + '</h1>' +
    '<span class="version">v' + this.escapeHtml(d.version) + '</span>' +
    '</div>';
};

Depiction.prototype.renderDescription = function() {
  var d = this.data;
  var desc = d.description || 'No description available.';
  
  return '<div class="card">' +
    '<div class="card-title">' +
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' +
    '</svg>' +
    'About' +
    '</div>' +
    '<div class="description">' + this.escapeHtml(desc) + '</div>' +
    '</div>';
};

Depiction.prototype.renderScreenshots = function() {
  var d = this.data;
  if (!d.screenshots || d.screenshots.length === 0) return '';
  
  var screenshotsHtml = '';
  for (var i = 0; i < d.screenshots.length; i++) {
    screenshotsHtml += '<img src="' + d.screenshots[i] + '" alt="Screenshot" class="screenshot">';
  }
  
  return '<div class="card">' +
    '<div class="card-title">' +
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>' +
    '</svg>' +
    'Screenshots' +
    '</div>' +
    '<div class="screenshots">' + screenshotsHtml + '</div>' +
    '</div>';
};

Depiction.prototype.renderInfo = function() {
  var d = this.data;
  var infoItems = [];
  
  if (d.author) infoItems.push({ label: 'Developer', value: d.author });
  if (d.maintainer) infoItems.push({ label: 'Maintainer', value: d.maintainer });
  if (d.version) infoItems.push({ label: 'Version', value: d.version });
  if (d.size) infoItems.push({ label: 'Size', value: d.size });
  if (d.category) infoItems.push({ label: 'Category', value: d.category });
  
  if (infoItems.length === 0) return '';
  
  var itemsHtml = '';
  for (var i = 0; i < infoItems.length; i++) {
    var item = infoItems[i];
    itemsHtml += '<div class="info-item">' +
      '<span class="info-label">' + this.escapeHtml(item.label) + '</span>' +
      '<span class="info-value">' + this.escapeHtml(item.value) + '</span>' +
      '</div>';
  }
  
  return '<div class="card">' +
    '<div class="card-title">' +
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>' +
    '</svg>' +
    'Information' +
    '</div>' +
    '<div class="info-grid">' + itemsHtml + '</div>' +
    '</div>';
};

Depiction.prototype.renderCompatibility = function() {
  var d = this.data;
  if (!d.compatibility || d.compatibility.length === 0) return '';
  
  var badges = '';
  for (var i = 0; i < d.compatibility.length; i++) {
    var item = d.compatibility[i];
    var type = item.working ? 'success' : (item.partial ? 'warning' : 'info');
    var status = item.status || (item.working ? '✓' : '✗');
    badges += '<span class="badge badge-' + type + '">' + this.escapeHtml(item.ios) + ' ' + status + '</span>';
  }
  
  return '<div class="card">' +
    '<div class="card-title">' +
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' +
    '</svg>' +
    'Compatibility' +
    '</div>' +
    '<div class="compatibility">' + badges + '</div>' +
    '</div>';
};

Depiction.prototype.renderChangelog = function() {
  var d = this.data;
  if (!d.changelog || d.changelog.length === 0) return '';
  
  var changelogHtml = '';
  for (var i = 0; i < d.changelog.length; i++) {
    var entry = d.changelog[i];
    var changesHtml = '';
    for (var j = 0; j < entry.changes.length; j++) {
      changesHtml += '<li>' + this.escapeHtml(entry.changes[j]) + '</li>';
    }
    
    changelogHtml += '<div class="changelog-item">' +
      '<div class="changelog-version">Version ' + this.escapeHtml(entry.version) + '</div>' +
      '<div class="changelog-date">' + this.escapeHtml(entry.date) + '</div>' +
      '<div class="changelog-changes"><ul>' + changesHtml + '</ul></div>' +
      '</div>';
  }
  
  return '<div class="card">' +
    '<div class="card-title">' +
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>' +
    '</svg>' +
    'What\'s New' +
    '</div>' +
    changelogHtml +
    '</div>';
};

Depiction.prototype.renderButtons = function() {
  var d = this.data;
  var buttons = [];
  
  if (d.source) {
    buttons.push('<a href="' + this.escapeHtml(d.source) + '" class="btn btn-secondary">View Source</a>');
  }
  if (d.donate) {
    buttons.push('<a href="' + this.escapeHtml(d.donate) + '" class="btn btn-secondary">Support</a>');
  }
  if (d.discord) {
    buttons.push('<a href="' + this.escapeHtml(d.discord) + '" class="btn btn-secondary">Discord</a>');
  }
  
  if (buttons.length === 0) return '';
  
  return '<div class="buttons">' + buttons.join('') + '</div>';
};

Depiction.prototype.renderFooter = function() {
  var d = this.data;
  var author = d.author || d.maintainer || 'yasakei';
  var year = new Date().getFullYear();
  var html = '<div class="footer">' +
    '<p>&copy; ' + year + ' ' + this.escapeHtml(author) + '</p>';
  
  if (d.homepage) {
    html += '<p><a href="' + this.escapeHtml(d.homepage) + '">' + this.escapeHtml(d.homepage) + '</a></p>';
  }
  
  html += '</div>';
  return html;
};

Depiction.prototype.renderError = function(message) {
  this.container.innerHTML = '<div class="error">' +
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' +
    '</svg>' +
    '<p>Failed to load depiction</p>' +
    '<p style="font-size: 12px; margin-top: 8px;">' + this.escapeHtml(message) + '</p>' +
    '</div>';
};

Depiction.prototype.escapeHtml = function(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Auto-initialize on DOM ready
(function() {
  var init = function() {
    var container = document.getElementById('depiction');
    
    if (container) {
      var depiction = new Depiction('depiction');
      
      // Try embedded data first, then fallback to fetch
      var embeddedData = container.getAttribute('data-embedded');
      if (embeddedData) {
        try {
          depiction.data = JSON.parse(embeddedData);
          depiction.render();
        } catch (e) {
          depiction.renderError('Invalid embedded data');
        }
      } else {
        var jsonUrl = container.getAttribute('data-json');
        if (jsonUrl) {
          depiction.load(jsonUrl);
        }
      }
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
