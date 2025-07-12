// Unregister any existing service workers to prevent errors
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Service worker unregistered:', registration);
    }
  }).catch(function(error) {
    console.log('Service worker unregistration failed:', error);
  });
} 