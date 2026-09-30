const http = require('http');
const https = require('https');
const fs = require('fs');

async function test() {
    let out = '';
    const log = (msg) => { out += msg + '\n'; };
    try {
        const baseUrl = 'https://ai-powered-real-estate-sales-lead-m-kappa.vercel.app';
        
        // 1. Health Check
        const healthRes = await fetch(baseUrl + '/api/health');
        log('HEALTH: ' + healthRes.status);
        
        // 2. Create Lead
        const postData = JSON.stringify({ customerName: 'CRUD Test', propertyRequirement: '1BHK', budget: '1M', location: 'NY', timeline: 'ASAP', customerMessage: 'Hi' });
        const createRes = await fetch(baseUrl + '/api/leads', { method: 'POST', body: postData, headers: {'Content-Type':'application/json'} });
        const createData = await createRes.json();
        log('CREATE STATUS: ' + createRes.status);
        
        const id = createData.id || createData._id;
        if(id) {
            log('EXTRACTED ID: ' + id);
            
            // 3. Read Lead
            const readRes = await fetch(baseUrl + '/api/leads/' + id);
            log('READ STATUS: ' + readRes.status);

            // 4. Update Lead
            const upData = JSON.stringify({timeline:'Immediately'});
            const upRes = await fetch(baseUrl + '/api/leads/' + id, {method:'PUT', body: upData, headers:{'Content-Type':'application/json'}});
            log('UPDATE STATUS: ' + upRes.status);
            
            // 5. Read All Leads
            const allRes = await fetch(baseUrl + '/api/leads');
            const allData = await allRes.json();
            log('GET ALL STATUS: ' + allRes.status + ' | Count: ' + allData.length);

            // 6. Delete Lead
            const delRes = await fetch(baseUrl + '/api/leads/' + id, {method:'DELETE'});
            log('DELETE STATUS: ' + delRes.status);
        } else {
            log('CREATE RETURNED NO ID: ' + JSON.stringify(createData));
        }
    } catch (e) {
        log('ERR: ' + e.message);
    }
    fs.writeFileSync('prod-test.txt', out);
}
test();
