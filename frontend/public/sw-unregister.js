// Comprehensive service worker cleanup to prevent errors
console.log('🔧 Starting service worker cleanup...');

if ('serviceWorker' in navigator) {
  // Method 1: Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    console.log('🔧 Found', registrations.length, 'service worker registrations');
    
    const unregisterPromises = registrations.map(function(registration) {
      console.log('🔧 Unregistering service worker:', registration.scope);
      return registration.unregister();
    });
    
    return Promise.all(unregisterPromises);
  }).then(function(results) {
    console.log('🔧 All service workers unregistered:', results);
    
    // Method 2: Clear service worker cache
    if ('caches' in window) {
      caches.keys().then(function(cacheNames) {
        console.log('🔧 Found', cacheNames.length, 'caches to clear');
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('🔧 Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(function() {
        console.log('🔧 All caches cleared successfully');
      }).catch(function(error) {
        console.log('🔧 Cache clearing failed:', error);
      });
    }
    
  }).catch(function(error) {
    console.log('🔧 Service worker cleanup failed:', error);
  });
  
  // Method 3: Override service worker registration to prevent new ones
  navigator.serviceWorker.register = function() {
    console.log('🔧 Service worker registration blocked');
    return Promise.resolve();
  };
}

// Method 4: Clear only service worker related storage (preserve user auth)
try {
  // Clear service worker related items only
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('workbox') || key.includes('sw-') || key.includes('cache'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log('🔧 Removed storage key:', key);
  });
  
  sessionStorage.clear(); // Safe to clear session storage
  console.log('🔧 Service worker storage cleared');
} catch (error) {
  console.log('🔧 Storage clearing failed:', error);
}

console.log('🔧 Service worker cleanup completed'); 