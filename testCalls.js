import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";


async function testHttpMode() {
  const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3000/mcp")
  );
  const client = new Client({ name: "example-client", version: "1.0.0" });
  await client.connect(transport);


  // Example: read your "greeting" resource
  const greetingResult = await client.readResource({
    uri: "greeting://Tester",
    params: { name: "Tester" }
  });
  console.log("Greeting result:", greetingResult.contents);
}

testHttpMode().catch(console.error);




async function testStdioMode() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['server.js', '--stdio'],
  });

  const client = new Client({ name: 'test-client', version: '1.0.0' });
  await client.connect(transport);

  // List resources your server supports
  const resources = await client.listResources();
  console.log('Resources:', resources);

  // Read a greeting resource
  const greeting = await client.readResource({ uri: 'greeting://World' });
  console.log('Greeting:', greeting);

  // // Call the add tool
  // const sum = await client.callTool({ name: 'add', arguments: { a: 2, b: 3 } });
  // console.log('Sum:', sum);
}

testStdioMode().catch(console.error);