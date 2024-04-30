export const onNavigate = (router: any, url: string) => {
  if (router && router.replace) {
    router.replace(url);
  } else {
    // Handle the case where router is not available
    console.error("Router object or router.replace method is not available.");
  }
};
