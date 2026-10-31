import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import net from 'node:net';
const cwd=fileURLToPath(new URL('../api/',import.meta.url));
let child, base, logs='';
before(async()=>{
 const server=net.createServer(); await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const port=server.address().port; await new Promise(r=>server.close(r)); base='http://127.0.0.1:'+port;
 child=spawn('dotnet',['run','--no-build','--project','Api.csproj','--urls',base],{cwd,env:{...process.env,ASPNETCORE_ENVIRONMENT:'Production'},windowsHide:true});
 child.stdout.on('data',x=>logs+=x); child.stderr.on('data',x=>logs+=x);
 for(let i=0;i<150;i++) {if(child.exitCode!==null)throw Error(logs);try{if((await fetch(base+'/health')).ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error(logs);
});
after(async()=>{ if(child&&child.exitCode===null){const stopped=new Promise(r=>child.once('exit',r));child.kill();await stopped;} });
const send=(url,body,method='POST')=>fetch(base+url,{method,headers:{'content-type':'application/json'},body:JSON.stringify(body)});
test('real HTTP lifecycle and contract',async()=>{
 const health=await fetch(base+'/health'); assert.equal((await health.json()).storage,'volatile-memory');
 assert.equal(health.headers.get('x-content-type-options'),'nosniff');
 const res=await send('/api/missions',{client:' Démo synthétique ',title:' Audit automatisation '});
 assert.equal(res.status,201);const item=await res.json();assert.equal(item.status,'planned');assert.equal(item.client,'Démo synthétique');
 assert.equal(res.headers.get('location'),'/api/missions/'+item.id);
 assert.deepEqual(await (await fetch(base+res.headers.get('location'))).json(),item);
 assert.equal((await send('/api/missions/'+item.id+'/status',{status:'invalid'},'PATCH')).status,409);
 const requests=await Promise.all(Array.from({length:10},()=>send('/api/missions/'+item.id+'/status',{status:'active'},'PATCH')));
 assert.equal(requests.filter(r=>r.status===200).length,1);assert.equal(requests.filter(r=>r.status===409).length,9);
 assert.equal((await send('/api/missions/'+item.id+'/status',{status:'completed'},'PATCH')).status,200);
 assert.equal((await (await fetch(base+'/api/missions')).json()).length,1);
});
test('validation, malformed input and missing resource',async()=>{
 for(const body of [{},{client:' ',title:'Valid'},{client:'Valid',title:'x'.repeat(201)}]){
 const res=await send('/api/missions',body); assert.equal(res.status,400);assert.ok((await res.json()).errors); }
 assert.equal((await fetch(base+'/api/missions',{method:'POST',headers:{'content-type':'application/json'},body:'{bad'})).status,400);
 assert.equal((await fetch(base+'/api/missions',{method:'POST',headers:{'content-type':'text/plain'},body:'anything'})).status,415);
 assert.equal((await fetch(base+'/api/missions/00000000-0000-0000-0000-000000000001')).status,404);
 assert.equal((await send('/api/missions/00000000-0000-0000-0000-000000000001/status',{status:'active'},'PATCH')).status,404);
 assert.equal((await send('/api/missions',null)).status,400);
 assert.equal((await fetch(base+'/api/missions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({padding:'x'.repeat(20000)})})).status,413);
});
test('web assets are served by the real API',async()=>{
 const html=await (await fetch(base+'/')).text();assert.ok(html.includes('AgentOps CRM'));assert.ok(html.includes('id="mission-form"'));
 assert.equal((await fetch(base+'/app.js')).status,200);assert.equal((await fetch(base+'/style.css')).status,200);
});
