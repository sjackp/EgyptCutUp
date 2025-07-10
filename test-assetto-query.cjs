const dgram = require('dgram');

// Assetto Corsa server query test
async function testAssettoCorsaQuery() {
  const socket = dgram.createSocket('udp4');
  const serverIP = '2.58.113.84';
  const serverPort = 9614;
  
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error('Query timeout'));
    }, 5000);

    socket.once('message', (msg) => {
      clearTimeout(timeout);
      console.log('Received response:', msg);
      console.log('Response length:', msg.length);
      console.log('Response as hex:', msg.toString('hex'));
      
      try {
        // Try to parse as string first
        const responseStr = msg.toString('utf8');
        console.log('Response as string:', responseStr);
        
        // Try to parse as Assetto Corsa response
        let offset = 0;
        
        // Read magic number (4 bytes)
        const magic = msg.readUInt32LE(offset);
        console.log('Magic number:', magic.toString(16));
        offset += 4;
        
        if (magic === 0x00000001) {
          console.log('Valid Assetto Corsa response detected');
          
          // Try to read strings
          try {
            const nameLength = msg.indexOf(0, offset) - offset;
            const name = msg.toString('utf8', offset, offset + nameLength);
            console.log('Server name:', name);
            offset += nameLength + 1;
            
            const trackLength = msg.indexOf(0, offset) - offset;
            const track = msg.toString('utf8', offset, offset + trackLength);
            console.log('Track:', track);
            offset += trackLength + 1;
            
            const sessionLength = msg.indexOf(0, offset) - offset;
            const session = msg.toString('utf8', offset, offset + sessionLength);
            console.log('Session:', session);
            offset += sessionLength + 1;
            
            if (offset + 2 <= msg.length) {
              const players = msg.readUInt8(offset);
              const maxPlayers = msg.readUInt8(offset + 1);
              console.log('Players:', players, '/', maxPlayers);
            }
          } catch (parseError) {
            console.log('Error parsing strings:', parseError.message);
          }
        } else {
          console.log('Not a valid Assetto Corsa response');
        }
      } catch (error) {
        console.log('Error parsing response:', error.message);
      }
      
      socket.close();
      resolve();
    });

    socket.once('error', (error) => {
      clearTimeout(timeout);
      console.error('Socket error:', error);
      socket.close();
      reject(error);
    });

    // Create query packet - try different formats
    console.log('Sending query to', serverIP + ':' + serverPort);
    
    // Format 1: Simple 8-byte packet
    const packet1 = Buffer.alloc(8);
    packet1.writeUInt32LE(0x00000001, 0); // Magic number
    packet1.writeUInt32LE(0x00000000, 4); // Padding
    
    console.log('Sending packet 1:', packet1.toString('hex'));
    socket.send(packet1, serverPort, serverIP, (error) => {
      if (error) {
        clearTimeout(timeout);
        console.error('Send error:', error);
        socket.close();
        reject(error);
      }
    });
  });
}

// Test different query formats
async function testMultipleFormats() {
  console.log('=== Testing Assetto Corsa Server Query ===\n');
  
  try {
    await testAssettoCorsaQuery();
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testMultipleFormats(); 