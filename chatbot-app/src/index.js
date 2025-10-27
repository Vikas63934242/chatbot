import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const   CHAT_BOT_ELEMENT_ID = 'chatbot-app';

class chatBot extends HTMLElement{
  connectedCallback() {
    const root = ReactDOM.createRoot(this);
    root.render(<App />);
  }
}
if (!customElements.get(CHAT_BOT_ELEMENT_ID)) {
  customElements.define(CHAT_BOT_ELEMENT_ID, chatBot);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
