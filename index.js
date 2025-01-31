let abortController = new AbortController();

const render = () => {
  abortController.abort();
  abortController = new AbortController();

  const button = document.createElement("button");
  button.classList.add("run");
  button.classList.add("indicator");
  button.innerText = "Block ScreenLock";

  button.addEventListener("click", async () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 1;
    const volume = context.createGain();
    volume.connect(context.destination);
    volume.gain.value = 0.01;
    oscillator.connect(volume);
    oscillator.start();

    const wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", render);
    button.remove();

    const unlockButton = document.createElement("button");
    unlockButton.classList.add("run");
    unlockButton.classList.add("indicator");
    unlockButton.innerText = "Unblock ScreenLock";

    unlockButton.addEventListener("click", render)
    document.body.append(unlockButton);

    abortController.signal.addEventListener("abort", () => {
      unlockButton.remove();
      context.close();
      wakeLock.removeEventListener("release", render);
    });
  });

  document.body.append(button);
  abortController.signal.addEventListener("abort", () => button.remove());
};
render();
