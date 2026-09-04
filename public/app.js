const API_BASE = window.SECUREBANK_API_BASE || '';
const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
const $ = selector => document.querySelector(selector);

async function api(path){
  const response = await fetch(`${API_BASE}${path}`);
  if(!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}

function setBusy(message){ $('#transaction-body').innerHTML = `<tr><td colspan="4" class="skeleton">${message}</td></tr>`; }

async function loadDashboard(){
  try{
    const accounts = await api('/api/v1/accounts');
    const total = accounts.reduce((sum,a)=>sum+a.balance,0);
    $('#total-balance').textContent = money(total);
    const checking = accounts.find(a=>a.type==='Checking');
    const savings = accounts.find(a=>a.type==='Savings');
    $('#checking-balance').textContent = money(checking?.balance || 0);
    $('#savings-balance').textContent = money(savings?.balance || 0);
    $('#account-count').textContent = `${accounts.length} accounts`;
    if(checking){
      const transactions = await api(`/api/v1/accounts/${checking.id}/transactions`);
      $('#transaction-body').innerHTML = transactions.map(t=>`<tr><td>${t.date}</td><td>${t.description}</td><td>${t.type}</td><td class="${t.type.toLowerCase()}">${money(t.amount)}</td></tr>`).join('');
    }
    const health = await api('/health');
    $('#service-health').textContent = health.status === 'ok' ? 'Operational' : 'Degraded';
  }catch(error){
    $('#transaction-body').innerHTML = `<tr><td colspan="4" class="error">Unable to load demo data. Start the API with <code>npm start</code>.</td></tr>`;
    $('#service-health').textContent = 'Unavailable';
  }
}

function openDemo(title, description){
  $('#modal-title').textContent = title;
  $('#modal-description').textContent = description;
  $('#demo-modal').hidden = false;
}
function closeDemo(){ $('#demo-modal').hidden = true; }
window.openDemo = openDemo;
window.closeDemo = closeDemo;

document.addEventListener('DOMContentLoaded',()=>{
  $('#transfer-btn').addEventListener('click',()=>openDemo('Transfer money','Portfolio simulation only — no funds are moved.'));
  $('#deposit-btn').addEventListener('click',()=>openDemo('Deposit','Portfolio simulation only — no deposit is submitted.'));
  $('#bill-btn').addEventListener('click',()=>openDemo('Pay a bill','Portfolio simulation only — no payment is submitted.'));
  $('#statement-btn').addEventListener('click',()=>openDemo('Statements','Demo statements would be generated from the transaction service in a production implementation.'));
  $('#demo-modal').addEventListener('click',event=>{ if(event.target.id==='demo-modal') closeDemo(); });
  loadDashboard();
});
