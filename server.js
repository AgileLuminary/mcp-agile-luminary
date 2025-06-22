// server.js
import express from 'express';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import fs from 'fs'

import { statelessHandler } from 'express-mcp-handler';

async function startStdioServer() {
  const mcps = createMcpServer();
  await mcps.connect(new StdioServerTransport());
}

function createMcpServer() {
  const server = new McpServer({
    name: 'my-mcp-server',
    version: '1.0.0',
  });

  server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    { title: 'Greeting', description: 'Generate a greeting' },
    async (uri, { name }) => ({
      contents: [{ uri: uri.href, text: `Hello, ${name}!` }]
    })
  );

  server.registerTool(
    'getProductDescription',
    {
      title: 'Get Product Description',
      description: 'Retrieve the current product description from external file'
    },
    async () => {
      try {
        const filePath = '/Users/erichartmann/Documents/product-description.txt'; 
        const description = await fs.readFileSync(filePath, { encoding: 'utf8' });
        
        return {
          content: [{ 
            type: 'text', 
            text: description.trim()
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: `Error reading product description: ${error.message}`
          }]
        };
      }
    }
  );

server.registerTool(
    'getCurrentWork',
    {
      title: 'Get Current Work',
      description: 'Retrieve the work assigned to the Cursor user'
    },
    async () => {
      try {
        const filePath = '/Users/erichartmann/Documents/currentWork.txt'; 
        const description = await fs.readFileSync(filePath, { encoding: 'utf8' });
        
        return {
          content: [{ 
            type: 'text', 
            text: description.trim()
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: `Error reading product description: ${error.message}`
          }]
        };
      }
    }
  );

  server.registerTool(
    'getPastWork',
    {
      title: 'Get Past Work',
      description: 'Retrieve the work which has been completed related to this user story'
    },
    async () => {
      try {
        const filePath = '/Users/erichartmann/Documents/pastWork.txt'; 
        const description = await fs.readFileSync(filePath, { encoding: 'utf8' });
        
        return {
          content: [{ 
            type: 'text', 
            text: description.trim()
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: `Error reading product description: ${error.message}`
          }]
        };
      }
    }
  );

  return server;
}


if (process.argv.includes('--stdio')) {
  startStdioServer().catch(console.error);
} else {
  // Otherwise start Express-based HTTP/SSE server
  const app = express();
  app.use(express.json());

  app.post('/mcp', statelessHandler(() => {
    const m = createMcpServer();
    const httpTransport = new StreamableHTTPServerTransport({ url: '/mcp' });
    m.connect(httpTransport).catch(console.error);
    return m;
  }));

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.listen(3000, () => console.log('🚀 MCP HTTP/SSE server listening at http://localhost:3000/mcp'));
}