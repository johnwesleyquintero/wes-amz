document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://alerion.vercel.app/' });
});