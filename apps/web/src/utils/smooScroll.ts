export const smoothScroll = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  href?: string,
): void => {
  e.preventDefault();

  const target = e.currentTarget.getAttribute("href");

  if (target !== null) {
    const newTarget = href ?? target.replace("/", "");

    const element = document.querySelector(newTarget);
    const offset = 90;

    if (element !== null) {
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }
};
