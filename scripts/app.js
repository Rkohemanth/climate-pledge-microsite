let pledges = JSON.parse(localStorage.getItem('pledges') || '[]');
const kpiAchieved = document.getElementById('kpi-achieved');
const kpiStudents = document.getElementById('kpi-students');
const kpiWorking = document.getElementById('kpi-working');
const tableBody = document.querySelector('#pledgeTable tbody');
const form = document.getElementById('pledgeForm');
const certSection = document.getElementById('certificate-section');
document.getElementById('take-pledge-btn').addEventListener('click', () => {
  document.getElementById('pledge-section').scrollIntoView({ behavior: 'smooth' });
});
function updateKPI() {
  kpiAchieved.textContent = pledges.length;
  kpiStudents.textContent = pledges.filter(p => p.profile === 'student').length;
  kpiWorking.textContent = pledges.filter(p => p.profile === 'working').length;
}
function renderPledgeWall() {
  tableBody.innerHTML = '';
  pledges.slice().reverse().forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>${p.date}</td><td>${p.state}</td><td>${p.profile}</td><td>${'⭐'.repeat(p.hearts)}</td>`;
    tableBody.appendChild(tr);
  });
}
function savePledges() {
  localStorage.setItem('pledges', JSON.stringify(pledges));
  updateKPI(); renderPledgeWall();
}
function showCertificate(pledge) {
  certSection.classList.remove('hidden');
  certSection.innerHTML = `
    <div id="certificate-card" class="certificate-card">
      <h2>🌍 Cool Enough to Care!</h2>
      <p><strong>${pledge.name}</strong></p>
      <p>${'❤️'.repeat(pledge.hearts)}</p>
      <p>Thank you for taking action for our planet!</p>
      <div class="cert-buttons">
        <button id="download-cert">⬇️ Download Certificate</button>
        <button id="close-cert">Close</button>
      </div>
    </div>
  `;
  document.getElementById('close-cert').onclick = () => certSection.classList.add('hidden');
   // Download logic
  document.getElementById('download-cert').onclick = async () => {
    const card = document.getElementById('certificate-card');
    const canvas = await html2canvas(card);
    const link = document.createElement('a');
    link.download = `Climate_Pledge_${pledge.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const state = document.getElementById('state').value;
  const profile = document.getElementById('profile').value;
  const commitments = Array.from(document.querySelectorAll('input[name="commitment"]:checked'));
  const hearts = commitments.length > 0 ? commitments.length : 1;
  const newPledge = { id: 'P' + (pledges.length + 1), name, email, mobile, state, profile, hearts, date: new Date().toLocaleDateString() };
  pledges.push(newPledge); savePledges(); showCertificate(newPledge); form.reset();
});
updateKPI(); renderPledgeWall();
