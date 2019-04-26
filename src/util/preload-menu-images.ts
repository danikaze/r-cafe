import { DayMenu, Dish } from '../def';

const parent = document.getElementById('preload');

function preloadImage(src: string): Promise<void> {
  // in Chrome needs to be appended to the DOM for it to actually load the image
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => parent.removeChild(img) && resolve();
    img.src = src;
    parent.appendChild(img);
  });
}

export async function preloadMenuImages(menu: DayMenu): Promise<void> {
  const promises: Promise<void>[] = [];

  Object.keys(menu).forEach((cafeteria) => {
    Object.keys(menu[cafeteria]).forEach((time) => {
      menu[cafeteria][time].forEach((dish: Dish) => {
        promises.push(preloadImage(dish.image));
      });
    });
  });

  await Promise.all(promises).then(() => {});
}
