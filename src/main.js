import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupRouter } from './router'

async function bootstrap() {
  const app = createApp(App);

  // Configure store
  // setupStore(app);

  // Initialize internal system configuration
  // initAppConfigStore();

  // Register global components
  // registerGlobComp(app);

  // Multilingual configuration
  // await setupI18n(app);

  // Configure routing
  setupRouter(app);

  // router-guard
  // setupRouterGuard(router);

  // Register global directive
  // setupGlobDirectives(app);

  // Configure global error handling
  // setupErrorHandle(app);

  app.mount('#app');
}

bootstrap();
