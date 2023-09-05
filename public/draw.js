const initDraw = (canvas) => {
  // Set canvas width and height
  canvas.width = window.screen.width;
  canvas.height = window.screen.height;

  let ctx = canvas.getContext("2d");

  let startX = 0;
  let startY = 0;

  let prevStartX = 0;
  let prevStartY = 0;

  let prevWidth = 0;
  let prevHeight = 0;

  let isDrawing = false;

  const handleStartDraw = (event) => {
    startX = event.clientX;
    startY = event.clientY;

    isDrawing = true;
  };

  const handleDrawing = (event) => {
    if(!isDrawing) return;

    // Calculate rectangle width/height
    const width = event.clientX - startX;
    const height = event.clientY - startY;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw new rectangle from start position to current mouse position
    ctx.strokeStyle = "white";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(startX, startY, width, height);
    ctx.fillRect(startX, startY, width, height);

    prevStartX = startX;
    prevStartY = startY;

    prevWidth = width;
    prevHeight = height;
  }

  const handleStopDraw = (event) => {
    isDrawing = false;
  };

  // Start position to begin drawing capture rectangle
  canvas.onmousedown = (event) => {
    handleStartDraw(event);
  };

  // Update capture rectangle dimensions on mouse move
  canvas.onmousemove = (event) => {
    handleDrawing(event);
  };

  // Stop position to stop drawing capture rectangle
  canvas.onmouseup = (event) => {
    handleStopDraw(event);
  };

  // TODO: Maybe remove/adjust later
  canvas.onmouseleave = (event) => {
    handleStopDraw(event);
  };
}