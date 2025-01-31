const logToPage = (text) => {
  const pre = document.createElement("pre");
  pre.innerText = text;
  document.body.append(pre);
};

const takeLock = async () => {
  try {
    const wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      logToPage("Error: Wake Lock was released");
    });
  } catch (err) {
    logToPage("Error: Failed to take Wake Lock");
  }
};

const isPopup = !window.menubar.visible;
if (isPopup) {
  const button = document.createElement("button");
  button.classList.add("run");
  button.classList.add("indicator");
  button.innerText = "Prevent Screen Lock";
  button.addEventListener("click", async () => {
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = 1;
      const volume = context.createGain();
      volume.connect(context.destination);
      volume.gain.value = 0.1;
      oscillator.connect(volume);
      oscillator.start();
    } catch (error) {
      console.error(error);
    }
    takeLock();
    button.remove();
    const message = document.createElement("div");
    message.classList.add("indicator");
    message.innerText = "Locking screen";
    document.body.append(message);
  });

  document.body.append(button);
} else {
  const button = document.createElement("button");
  button.classList.add("run");
  button.classList.add("indicator");
  button.innerText = "Open In popup";
  button.addEventListener("click", async () => {
    window.open(window.location, "_blank", "width=800,height=600");
    button.remove();
    const message = document.createElement("div");
    message.classList.add("indicator");
    message.innerText = "You can close this tab";
    document.body.append(message);
  });
  document.body.append(button);
}
