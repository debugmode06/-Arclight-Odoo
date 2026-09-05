import { RouterProvider } from 'react-router-dom';
import { Providers } from './providers';
import { router } from './router';

/**
 * Application Root
 * Owner: Member 1
 *
 * This is the top-level component. It should only contain:
 * - Global providers
 * - Router
 * - Top-level error boundaries (to be added by Member 1)
 *
 * Do NOT add module-specific logic here.
 */
function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
