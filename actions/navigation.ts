export const onNavigate = (router: any, url: string) => {
  if (router && router.push) {
    router.push(url);
  } else {
    // Handle the case where router is not available
    console.error("Router object or router.push method is not available.");
  }
};