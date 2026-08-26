import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global CSS reset to ensure navbar & footer touch screen corners with 0 margin
const globalStyles = document.createElement('style');
globalStyles.innerHTML = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100% !important;
    overflow-x: hidden;
    background-color: #fffef5;
  }
  #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh !important;
    display: flex;
    flex-direction: column;
  }
`;
// Set browser tab title and favicon to ClaimVertex
document.title = 'ClaimVertex';
let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
if (!faviconLink) {
	faviconLink = document.createElement('link');
	faviconLink.rel = 'icon';
	document.head.appendChild(faviconLink);
}
faviconLink.href = '/logo.png';

let rootElement = document.getElementById('root');
if (!rootElement) {
	rootElement = document.createElement('div');
	rootElement.id = 'root';
	document.body.appendChild(rootElement);
}

const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(React.StrictMode, null, React.createElement(App)));

export * from './AppDescriptor';
