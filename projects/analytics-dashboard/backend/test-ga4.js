const ga4Client = require('./clients/ga4');

async function test() {
  try {
    console.log('Testing GA4 connection...');
    const propertyId = '361561956'; // Hello Hayley
    
    const result = await ga4Client.getMetrics(propertyId, '7daysAgo', 'today');
    console.log('Success! Data:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
    console.error('Full error:', error.response?.data || error.message);
  }
}

test();
