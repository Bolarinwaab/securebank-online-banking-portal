const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createBank, DEMO_OTP } = require('./src/banking');

const bank = createBank();
const sessions = new Map();
const CUSTOMER = { id: 'CUST-10001', name: 'Amina Okafor', email: 'amina.demo@example.invalid', phone: '+2348000000000', bvnStatus: 'VERIFIED', mfaEnabled: true };
const DEMO_USER = 'amina.demo';
const DEMO_PASSWORD = process.env.SECUREBANK_DEMO_PASSWORD || 'PORTFOLIO_ONLY';

function json(res, status, body) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY' }); res.end(JSON.stringify(body)); }
function readBody(req) { return new Promise((resolve, reject) => { let raw=''; req.on('data', c => { raw += c; if(raw.length > 20000) reject(new Error('Payload too large')); }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Invalid JSON')); } }); }); }
function auth(req) { const h = req.headers.authorization || ''; const token = h.startsWith('Bearer ') ? h.slice(7) : ''; return sessions.get(token); }
function safeError(res, error) { return json(res, 400, { error: error.message }); }

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (url.pathname === '/health') return json(res, 200, { status:'ok', service:'securebank-banking-sandbox', mode:'synthetic', timestamp:new Date().toISOString() });
  if (url.pathname === '/api/v1/auth/login' && req.method === 'POST') {
    try { const body=await readBody(req); if(body.username !== DEMO_USER || body.password !== DEMO_PASSWORD) return json(res,401,{error:'Invalid demo credentials'}); const token=crypto.randomBytes(32).toString('hex'); sessions.set(token,{customerId:CUSTOMER.id,createdAt:Date.now()}); return json(res,200,{token,customer:CUSTOMER,requiresMfa:true,otpHint:'Use the synthetic OTP documented in the demo README.'}); } catch(e) { return safeError(res,e); }
  }
  const session = auth(req);
  if (url.pathname.startsWith('/api/v1/') && !session && !['/api/v1/auth/login'].includes(url.pathname)) return json(res,401,{error:'Authentication required'});
  if (url.pathname === '/api/v1/auth/logout' && req.method === 'POST') { const token=(req.headers.authorization||'').slice(7); sessions.delete(token); return json(res,200,{message:'Signed out'}); }
  if (url.pathname === '/api/v1/profile' && req.method === 'GET') return json(res,200,CUSTOMER);
  if (url.pathname === '/api/v1/accounts' && req.method === 'GET') return json(res,200,bank.accounts);
  const balance=url.pathname.match(/^\/api\/v1\/accounts\/([^/]+)\/balance$/); if(balance && req.method==='GET'){ const a=bank.getAccount(balance[1]); return a?json(res,200,{accountId:a.id,balance:a.availableBalance,ledgerBalance:a.ledgerBalance,currency:a.currency}):json(res,404,{error:'Account not found'}); }
  if (url.pathname === '/api/v1/transactions' && req.method === 'GET') return json(res,200,bank.getTransactions(url.searchParams.get('accountId')));
  if (url.pathname === '/api/v1/beneficiaries' && req.method === 'GET') return json(res,200,bank.beneficiaries);
  if (url.pathname === '/api/v1/notifications' && req.method === 'GET') return json(res,200,[{id:'NTF-001',title:'Security notice',message:'This is a synthetic banking sandbox.',read:false,date:new Date().toISOString()},{id:'NTF-002',title:'Authorization',message:'Use only the synthetic test code documented for this sandbox.',read:false,date:new Date().toISOString()}]);
  if (url.pathname === '/api/v1/limits' && req.method === 'GET') return json(res,200,{currency:'NGN',dailyTransferLimit:bank.dailyLimit,usedToday:0,remaining:bank.dailyLimit});
  if (url.pathname === '/api/v1/transfers' && req.method === 'POST') { try { const b=await readBody(req); const result=bank.transfer(b); return json(res,200,{...result,message:result.status==='REVERSED'?'Transfer failed and funds were reversed.':'Transfer completed successfully.'}); } catch(e){ return safeError(res,e); } }
  if (url.pathname === '/api/v1/transfer/name-enquiry' && req.method === 'POST') { try { const b=await readBody(req); if(!/^\d{10}$/.test(String(b.accountNumber||''))) return json(res,400,{error:'Account number must be 10 digits'}); return json(res,200,{bankCode:b.bankCode||'058',accountNumber:b.accountNumber,accountName:b.accountNumber==='1234567890'?'Ada Example':'Synthetic Beneficiary',verified:true}); } catch(e){return safeError(res,e);} }
  if (url.pathname === '/api/v1/bill-payments' && req.method === 'POST') { try { const b=await readBody(req); const amount=Number(b.amount); const a=bank.getAccount(b.fromAccountId); if(!a) throw new Error('Source account not found'); if(!Number.isFinite(amount)||amount<=0) throw new Error('Amount must be greater than zero'); if(amount>a.availableBalance) throw new Error('Insufficient funds'); a.availableBalance-=amount; a.ledgerBalance=a.availableBalance; return json(res,200,{status:'COMPLETED',reference:'BILL'+Date.now(),amount,service:b.service||'Utility',message:'Bill payment completed in sandbox.'}); } catch(e){return safeError(res,e);} }
  if (url.pathname === '/api/v1/admin/audit' && req.method === 'GET') return json(res,200,bank.getAudit());
  if (url.pathname === '/api/v1/admin/summary' && req.method === 'GET') return json(res,200,{customers:1,accounts:bank.accounts.length,transactions:bank.getTransactionsAll().length,auditEvents:bank.getAudit().length,environment:'SANDBOX'});
  if (url.pathname === '/' || url.pathname === '/index.html') { const html=fs.readFileSync(path.join(__dirname,'public','index.html')); res.writeHead(200,{'content-type':'text/html; charset=utf-8'}); return res.end(html); }
  return json(res,404,{error:'Route not found'});
});

if (require.main === module) server.listen(process.env.PORT||8080,()=>console.log('SecureBank banking sandbox running'));
module.exports={server,bank,sessions,DEMO_OTP};
