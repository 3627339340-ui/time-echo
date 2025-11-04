document.addEventListener("DOMContentLoaded", () => {
  const envelope = document.getElementById("envelope");
  const flap = document.getElementById("flap");
  const sendBtn = document.getElementById("send");
  const inputEl = document.getElementById("input");
  const outputEl = document.getElementById("output");
  const closeBtn = document.getElementById("closeBtn");
  const speakBtn = document.getElementById("speakBtn");

  // 点击信封展开
  flap.addEventListener("click", () => {
    envelope.classList.add("opened");
  });

  // 点击发送按钮
  sendBtn.addEventListener("click", async () => {
    const input = inputEl.value.trim();
    if (!input) return alert("请先写点什么吧～");

    outputEl.style.display = "block";
    outputEl.textContent = "未来正在回信中...💭";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
      });

      const data = await res.json();
      if (data.reply) {
        outputEl.textContent = data.reply;
        closeBtn.style.display = "inline-block";
        speakBtn.style.display = "inline-block";
      } else {
        outputEl.textContent = "未来暂时没法回信，请稍后再试。";
      }
    } catch (err) {
      outputEl.textContent = "连接未来出错，请稍后再试。";
    }
  });

  // 收起信纸
  closeBtn.addEventListener("click", () => {
    envelope.classList.remove("opened");
    closeBtn.style.display = "none";
    speakBtn.style.display = "none";
    outputEl.style.display = "none";
  });

  // 语音播放
  speakBtn.addEventListener("click", () => {
    const text = outputEl.textContent;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes("Microsoft Huihui") || v.lang === "zh-CN");
    speechSynthesis.speak(utterance);
  });
});
