import { Suspense } from "react";

// Loading component
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// HOC for lazy loading with suspense
export const withLazyLoading = (Component: React.LazyExoticComponent<any>) => {
  return (props: any) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
};
