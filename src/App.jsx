/* @ Lazy Loading */

import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import BlogPage, { loader as postsLoader } from './pages/Blog';
import HomePage from './pages/Home';
// import PostPage, { loader as postLoader } from './pages/Post';
import RootLayout from './pages/Root';

// @ lazy loading BlogPage component
// this BlogPage fn returns a promise
// import actually yields a promise and that's actually not a valid
// react component fn.
// To resolve this, React gives us a special fn which we have to wrap around
// this fn
// lazy fn
// lazy is executed and takes this fn with the dynamic import as an argument!
// And now BlogPage can indeed be used as a component.
// So now where we're using it as a Component, this code will now work again.
// At least almost. It will still take some time to load the code for this
// Component because that code has to be downloaded after all and therefore
// we must wrap this with another component provided by React,
// the Suspense Component.
// Suspense is also used with React Router when we use defer in our loader.
// Suspense is basically a component provided by React that can be used by other
// things, other Components to wait for context to be loaded before actually
// rendering the content.
// Here Suspense is used to wrap it around lazy loaded Component so that we
// can show a fallback which is specified with the help of fallback prop
// on Suspense until that Component code is there.
// With that we're now loading this blog page component only when it's needed.
// And we show a fallback until the code is there.
// And we're also loading that loader code only when its needed and then we
// execute it right away so that we overall still load the data as required.
const BlogPage = lazy(() => import('./pages/Blog'));
// Load PostPage Component and its loader lazily
const PostPage = lazy(() => import('./pages/Post'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'posts',
        children: [
          // @ lady loading loader fn
          // calling import gives us a Promise because this is asynchronous
          // process
          // now this import fn here will only be executed once the loader
          // here for the blog page is executed.
          {
            index: true,
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <BlogPage />
              </Suspense>
            ),
            loader: () =>
              import('./pages/Blog').then((module) => module.loader()),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <PostPage />
              </Suspense>
            ),
            // we get this meta object from React Router which contains params key and more
            loader: (meta) =>
              import('./pages/Post').then((module) => module.loader(meta)),
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
