export default function simulateClick(x: number, y: number) {
  var event = new MouseEvent("click", {
    clientX: x,
    clientY: y,
    button: 0, // 0: left button, 1: middle button, 2: right button
    buttons: 1, // 1: left button pressed
  });

  console.log("Dispatched");
  document.dispatchEvent(event);
}
