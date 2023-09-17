export const getPixelColor = (event, canvas, ctx) => {
  const bounding = canvas.getBoundingClientRect();

  // x and y needs fixing
  const x = event.clientX - bounding.left;
  const y = event.clientY - bounding.top;
  const pixel = ctx.getImageData(x, y, 1, 1);
  const data = pixel.data;

  return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
}