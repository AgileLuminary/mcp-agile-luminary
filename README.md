# Agile Luminary MCP Server

This is a Model Context Protocol (MCP) server that connects AI clients (like Cursor or Claude Desktop) to the Agile Luminary project management system hosted at `https://agileluminary.com`.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for AI applications to connect to external data sources and services. This server acts as a bridge between your AI client and the Agile Luminary REST API, allowing you to retrieve project details, work assignments, and product information directly within your AI conversations.

## Architecture

```
AI Client (Cursor/Claude) → Local MCP Server → Agile Luminary API (https://agileluminary.com)
```

## Features

This MCP server provides three main tools that fetch data from the Agile Luminary API:

### 🎯 **getProductDescription**
- **Purpose**: Retrieves the current product description for your project
- **Use Case**: Get up-to-date product specifications and requirements

### 📋 **getCurrentWork**
- **Purpose**: Fetches work currently assigned to the user
- **Use Case**: See what tasks and user stories are actively assigned to you

### ✅ **getPastWork**
- **Purpose**: Retrieves completed work related to the current user story
- **Use Case**: Review historical context and completed tasks for better decision-making

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- An AI client that supports MCP (Cursor IDE, Claude Desktop, etc.)

### Install Dependencies
```bash
npm install express @modelcontextprotocol/sdk express-mcp-handler
```

### Run the Server
```bash
node server.js
```

The server will start and listen for connections from your AI client via stdio transport.

## Configuration

### For Cursor IDE
Add this to your MCP configuration:
```json
{
  "mcpServers": {
    "agile-luminary": {
      "command": "node",
      "args": ["path/to/your/server.js"]
    }
  }
}
```

### For Claude Desktop
Add this to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "agile-luminary": {
      "command": "node",
      "args": ["path/to/your/server.js"]
    }
  }
}
```

## Usage Examples

Once connected, you can use natural language in your AI client:

- *"What's the current product description?"*
- *"Show me my current work assignments"*
- *"What work has been completed on this user story?"*
- *"Based on my current work and past completed tasks, what should I focus on next?"*

## Benefits

- **Real-time Data**: Always get the latest project information from your deployed system
- **Context-Aware AI**: Your AI assistant has full context of your project status
- **Seamless Integration**: Works directly within your development environment
- **Secure**: Server handles authentication and API communication locally

## API Integration

This server replaces local file reading with REST API calls to your deployed Agile Luminary system. Instead of reading from local files like:
- `/Users/erichartmann/Documents/product-description.txt`
- `/Users/erichartmann/Documents/currentWork.txt`
- `/Users/erichartmann/Documents/pastWork.txt`

It now fetches live data from your cloud-deployed project management system, ensuring you always have the most current information.

## Error Handling

The server includes comprehensive error handling for:
- Network connectivity issues
- API authentication failures
- Malformed responses
- Service unavailability

## Contributing

This MCP server is designed to work specifically with the Agile Luminary project management system. For modifications or enhancements, ensure compatibility with the existing API endpoints.

---

**Note**: Make sure your Agile Luminary account is created and you have your api keys `https://agileluminary.com` before using this MCP server.