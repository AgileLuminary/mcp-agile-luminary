
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
const host = 'https://app.agileluminary.com'

async function startStdioServer() {
  const mcps = createMcpServer();
  await mcps.connect(new StdioServerTransport());
}

function createMcpServer() {
  const server = new McpServer({
    name: 'my-mcp-server',
    version: '1.0.0',
  });


server.registerTool(
  'getRelatedDocuments',
  {
    title: 'Get Related Documents',
    description: 'Retrieve related documents based on a search string',
    inputSchema: {
      searchString: z.string().min(1),
    }
     
  },
  async (args) => {
    try {
      const { searchString } = args;
      
      const apiKey = process.env.LUMINARY_API_KEY;
      if (!apiKey) {
        console.error('No API key present');
      }
     
      const headers = {};
      if (apiKey) {
        headers['Authorization'] = apiKey;
      }
      
      // Send POST request with chatText in body
      const response = await fetch(`${host}/bend/mcp/documents/search`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatText: searchString })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.text();
      console.log('got server data', data)
      return {
        content: [{ 
          type: 'text', 
          text: data
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: 'text', 
          text: `Error searching documents: ${error.message}`
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
        const apiKey = process.env.LUMINARY_API_KEY;
        console.error('LUMINARY_API_KEY in getCurrentWork:', apiKey);
        
        const headers = {};
        if (apiKey) {
          headers['Authorization'] = apiKey;
        }
        
        const response = await fetch(`${host}/bend/mcp/userstories/current`, {
          headers
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.text();
        
        return {
          content: [{ 
            type: 'text', 
            text: data
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: `Error fetching current work: ${error.message}`
          }]
        };
      }
    }
  );

  server.registerTool(
    'getPastWork',
    {
      title: 'Get Past Work',
      description: 'Retrieve the work which has been completed related to this user story',
        inputSchema: {
          searchString: z.string().min(1),
        }
    },
    async (args) => {
      try {
      const { searchString } = args;
      
      const apiKey = process.env.LUMINARY_API_KEY;
      if (!apiKey) {
        console.error('No API key present');
      }
     
      const headers = {};
      if (apiKey) {
        headers['Authorization'] = apiKey;
      }
      
      // Send POST request with chatText in body
      const response = await fetch(`${host}/bend/mcp/userstories/search`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatText: searchString })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.text();
      return {
        content: [{ 
          type: 'text', 
          text: data
        }]
      };
        
      
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: `Error getting past work: ${error.message}`
          }]
        };
      }
    }
  );

  return server;
}

startStdioServer().catch(console.error);