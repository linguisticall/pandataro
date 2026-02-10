script.js
body {
  margin: 0;
  background: #000;
  color: #fff;
  font-family: "Segoe UI", sans-serif;
  overflow: hidden;
}

#globe {
  position: fixed;
  inset: 0;
}

#ui {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  display: flex;
  gap: 6px;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 12px;
}

#ui input {
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
}

#ui button {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #4ff;
  font-weight: bold;
}

#modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

#modalContent {
  background: #111;
  padding: 24px;
  max-width: 420px;
  border-radius: 14px;
  line-height: 1.7;
}

#close {
  margin-top: 16px;
  text-align: right;
  cursor: pointer;
  color: #4ff;
}
