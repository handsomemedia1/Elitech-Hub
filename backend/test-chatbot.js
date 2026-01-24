// Quick test script for chatbot API
async function testChatbot() {
    try {
        const response = await fetch('http://localhost:3001/api/chatbot/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hello!' })
        });

        const data = await response.json();
        console.log('\n✅ CHATBOT RESPONSE:');
        console.log('Provider:', data.provider);
        console.log('Latency:', data.latency + 'ms');
        console.log('\nResponse:\n' + data.response);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testChatbot();
