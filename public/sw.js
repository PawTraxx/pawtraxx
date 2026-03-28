// PawTraks Service Worker - Background Push Notifications
var CACHE_NAME = 'pawtraks-v1';

// Notification schedules stored in SW scope
var scheduledTimers = [];

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

// Listen for messages from the app
self.addEventListener('message', function(e) {
  if (!e.data) return;

  if (e.data.type === 'SCHEDULE_NOTIFICATIONS') {
    // Clear old timers
    scheduledTimers.forEach(function(t) { clearTimeout(t); });
    scheduledTimers = [];

    var dogs = e.data.dogs || [];
    var now = Date.now();

    dogs.forEach(function(dog) {
      var name = dog.name;
      var age = parseFloat(dog.age) || 1;

      // Calculate cooldowns based on age
      var feedCooldownMs, outsideCooldownMs;
      if (age < 0.083) {
        feedCooldownMs = 0.5 * 3600000;
        outsideCooldownMs = 0.5 * 3600000;
      } else if (age < 0.5) {
        feedCooldownMs = 1.5 * 3600000;
        outsideCooldownMs = 0.5 * 3600000;
      } else if (age < 1) {
        feedCooldownMs = 2 * 3600000;
        outsideCooldownMs = 1 * 3600000;
      } else if (age < 3) {
        feedCooldownMs = 3 * 3600000;
        outsideCooldownMs = 1.5 * 3600000;
      } else if (age < 8) {
        feedCooldownMs = 4 * 3600000;
        outsideCooldownMs = 2 * 3600000;
      } else {
        feedCooldownMs = 5 * 3600000;
        outsideCooldownMs = 3 * 3600000;
      }

      // --- Food reminder ---
      var lastFed = dog.lastFed ? new Date(dog.lastFed).getTime() : 0;
      var nextFeedTime = lastFed + feedCooldownMs;
      // Add a small buffer so we don't notify exactly at cooldown end
      var feedDelay = Math.max(nextFeedTime - now + 2 * 60000, 5000);

      var feedTimer = setTimeout(function() {
        self.registration.showNotification('🍽️ Time to feed ' + name + '!', {
          body: name + " is due for their next meal. Tap to log it in PawTraks.",
          icon: '/logo192.png',
          badge: '/logo192.png',
          tag: 'feed-' + dog.id,
          renotify: true,
          requireInteraction: false,
          data: { url: '/', dogId: dog.id }
        });
      }, feedDelay);
      scheduledTimers.push(feedTimer);

      // --- Water reminder (same cooldown as food) ---
      var lastWater = dog.lastWater ? new Date(dog.lastWater).getTime() : 0;
      var nextWaterTime = lastWater + feedCooldownMs;
      var waterDelay = Math.max(nextWaterTime - now + 3 * 60000, 8000);

      var waterTimer = setTimeout(function() {
        self.registration.showNotification('💧 ' + name + ' needs water!', {
          body: "Make sure " + name + "'s water bowl is fresh. Tap to log it in PawTraks.",
          icon: '/logo192.png',
          badge: '/logo192.png',
          tag: 'water-' + dog.id,
          renotify: true,
          requireInteraction: false,
          data: { url: '/', dogId: dog.id }
        });
      }, waterDelay);
      scheduledTimers.push(waterTimer);

      // --- Outside reminder ---
      var lastOutside = dog.lastOutside ? new Date(dog.lastOutside).getTime() : 0;
      var nextOutsideTime = lastOutside + outsideCooldownMs;
      var outsideDelay = Math.max(nextOutsideTime - now + 2 * 60000, 10000);

      var outsideTimer = setTimeout(function() {
        self.registration.showNotification('🌳 ' + name + ' needs to go outside!', {
          body: name + " is due for an outdoor break. Tap to log it in PawTraks.",
          icon: '/logo192.png',
          badge: '/logo192.png',
          tag: 'outside-' + dog.id,
          renotify: true,
          requireInteraction: false,
          data: { url: '/', dogId: dog.id }
        });
      }, outsideDelay);
      scheduledTimers.push(outsideTimer);

      // --- Daily wellness reminder (8 AM) ---
      var tomorrow8am = new Date();
      tomorrow8am.setHours(8, 0, 0, 0);
      if (tomorrow8am.getTime() <= now) {
        tomorrow8am.setDate(tomorrow8am.getDate() + 1);
      }
      var wellnessDelay = tomorrow8am.getTime() - now;

      var wellnessMessages = [
        "Don't forget to log " + name + "'s meals and walks today! 🐾",
        "Good morning! Time to take care of " + name + " 🐕",
        name + " is counting on you today! Open PawTraks to get started.",
        "Rise and shine! " + name + " needs their morning routine logged. 🌅",
      ];
      var msg = wellnessMessages[Math.floor(Math.random() * wellnessMessages.length)];

      var wellnessTimer = setTimeout(function() {
        self.registration.showNotification('🌟 PawTraks Daily Reminder', {
          body: msg,
          icon: '/logo192.png',
          badge: '/logo192.png',
          tag: 'wellness-' + dog.id,
          renotify: true,
          data: { url: '/', dogId: dog.id }
        });
      }, wellnessDelay);
      scheduledTimers.push(wellnessTimer);
    });
  }

  // Vet appointment reminders
  if (e.data.type === 'SCHEDULE_VET_REMINDER') {
    var appt = e.data.appt;
    var dogName = e.data.dogName;
    var msUntil = e.data.msUntil;
    if (msUntil > 0) {
      var vetTimer = setTimeout(function() {
        self.registration.showNotification('🩺 Vet appointment reminder!', {
          body: dogName + " has an appointment " + appt.reason + (appt.vet ? " with " + appt.vet : "") + ". Tap to view details.",
          icon: '/logo192.png',
          badge: '/logo192.png',
          tag: 'vet-' + appt.id,
          renotify: true,
          requireInteraction: true,
          data: { url: '/' }
        });
      }, msUntil);
      scheduledTimers.push(vetTimer);
    }
  }
});

// Handle notification click — open/focus the app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
      for (var i = 0; i < clients.length; i++) {
        var client = clients[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
