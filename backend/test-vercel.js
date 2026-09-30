const https = require('https');

function makeRequest(path, postData) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'ai-powered-real-estate-sales-lead-m-kappa.vercel.app',
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function poll() {
    process.stdout.write('Waiting for Vercel deployment (tracking gemini-3.8-flash upgrade)...');

    for (let i = 0; i < 20; i++) {
        try {
            const followUpReq = await makeRequest(
                '/api/leads/6abc928c6c136fd2974cee07/follow-up',
                JSON.stringify({})
            );

            // Wait for Vercel to invalidate the old 404 cache explicitly!
            if (followUpReq.status === 200 || !followUpReq.body.includes('gemini-2.5-flash')) {
                console.log('\n\n--- ACTUAL RUNTIME VERIFICATION TARGETED ---');
                console.log('FOLLOW-UP HTTP STATUS:', followUpReq.status);
                console.log('FOLLOW-UP BODY:', followUpReq.body);

                const chatReq = await makeRequest(
                    '/api/leads/6abc928c6c136fd2974cee07/chat',
                    JSON.stringify({ message: 'What should I emphasize about this property?' })
                );

                console.log('\nCHAT HTTP STATUS:', chatReq.status);
                console.log('CHAT BODY:', chatReq.body);
                return;
            }
        } catch (e) { }

        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    console.log('\nTimed out.');
}
poll();
