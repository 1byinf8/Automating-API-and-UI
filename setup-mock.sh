#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Mock Testing Environment${NC}\n"

# Create mockServer.ts
echo -e "${GREEN}Creating mockServer.ts...${NC}"
cat > mockServer.ts << 'EOF'
import { createServer, IncomingMessage, ServerResponse } from 'http';
import * as url from 'url';

interface MockData {
  users: Array<{ id: string; username: string; password: string; token: string }>;
  learningInstances: Array<any>;
  taskBots: Array<any>;
  forms: Array<any>;
}

class MockServer {
  private data: MockData = {
    users: [
      {
        id: '1',
        username: 'testuser',
        password: 'testpass',
        token: 'mock-jwt-token-12345',
      },
    ],
    learningInstances: [],
    taskBots: [],
    forms: [],
  };

  private server: any;
  private port: number = 3000;

  start(port: number = 3000): void {
    this.port = port;
    this.server = createServer(this.handleRequest.bind(this));
    
    this.server.listen(this.port, () => {
      console.log(`🚀 Mock server running at http://localhost:${this.port}`);
      console.log(`📝 Default credentials: testuser / testpass`);
    });
  }

  stop(): void {
    if (this.server) {
      this.server.close();
      console.log('Mock server stopped');
    }
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    const method = req.method || 'GET';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    console.log(`${method} ${pathname}`);

    if (pathname === '/api/login' && method === 'POST') {
      this.handleLogin(req, res);
    } else if (pathname === '/api/learningInstance' && method === 'POST') {
      this.handleCreateLearningInstance(req, res);
    } else if (pathname === '/api/learningInstance' && method === 'GET') {
      this.handleGetLearningInstances(req, res);
    } else if (pathname?.startsWith('/api/learningInstance/') && method === 'GET') {
      this.handleGetLearningInstanceById(req, res, pathname);
    } else if (pathname?.startsWith('/api/learningInstance/') && method === 'PUT') {
      this.handleUpdateLearningInstance(req, res, pathname);
    } else if (pathname?.startsWith('/api/learningInstance/') && method === 'DELETE') {
      this.handleDeleteLearningInstance(req, res, pathname);
    } else {
      this.sendResponse(res, 404, { error: 'Not found' });
    }
  }

  private handleLogin(req: IncomingMessage, res: ServerResponse): void {
    this.getBody(req, body => {
      const { username, password } = JSON.parse(body);
      const user = this.data.users.find(
        u => u.username === username && u.password === password
      );

      if (user) {
        this.sendResponse(res, 200, {
          token: user.token,
          userId: user.id,
          username: user.username,
        });
      } else {
        this.sendResponse(res, 401, { error: 'Invalid credentials' });
      }
    });
  }

  private handleCreateLearningInstance(req: IncomingMessage, res: ServerResponse): void {
    if (!this.isAuthenticated(req)) {
      this.sendResponse(res, 401, { error: 'Unauthorized' });
      return;
    }

    this.getBody(req, body => {
      const data = JSON.parse(body);
      
      if (!data.name) {
        this.sendResponse(res, 400, { error: 'Name is required' });
        return;
      }

      const instance = {
        id: `instance-${Date.now()}`,
        name: data.name,
        description: data.description || '',
        type: data.type || 'automation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.data.learningInstances.push(instance);
      this.sendResponse(res, 201, instance);
    });
  }

  private handleGetLearningInstances(req: IncomingMessage, res: ServerResponse): void {
    if (!this.isAuthenticated(req)) {
      this.sendResponse(res, 401, { error: 'Unauthorized' });
      return;
    }

    const parsedUrl = url.parse(req.url || '', true);
    const page = parseInt(parsedUrl.query.page as string) || 1;
    const limit = parseInt(parsedUrl.query.limit as string) || 10;

    this.sendResponse(res, 200, {
      data: this.data.learningInstances,
      total: this.data.learningInstances.length,
      page,
      limit,
    });
  }

  private handleGetLearningInstanceById(
    req: IncomingMessage,
    res: ServerResponse,
    pathname: string
  ): void {
    if (!this.isAuthenticated(req)) {
      this.sendResponse(res, 401, { error: 'Unauthorized' });
      return;
    }

    const id = pathname.split('/').pop();
    const instance = this.data.learningInstances.find(i => i.id === id);

    if (instance) {
      this.sendResponse(res, 200, instance);
    } else {
      this.sendResponse(res, 404, { error: 'Learning instance not found' });
    }
  }

  private handleUpdateLearningInstance(
    req: IncomingMessage,
    res: ServerResponse,
    pathname: string
  ): void {
    if (!this.isAuthenticated(req)) {
      this.sendResponse(res, 401, { error: 'Unauthorized' });
      return;
    }

    const id = pathname.split('/').pop();
    const index = this.data.learningInstances.findIndex(i => i.id === id);

    if (index === -1) {
      this.sendResponse(res, 404, { error: 'Learning instance not found' });
      return;
    }

    this.getBody(req, body => {
      const data = JSON.parse(body);
      this.data.learningInstances[index] = {
        ...this.data.learningInstances[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      this.sendResponse(res, 200, this.data.learningInstances[index]);
    });
  }

  private handleDeleteLearningInstance(
    req: IncomingMessage,
    res: ServerResponse,
    pathname: string
  ): void {
    if (!this.isAuthenticated(req)) {
      this.sendResponse(res, 401, { error: 'Unauthorized' });
      return;
    }

    const id = pathname.split('/').pop();
    const index = this.data.learningInstances.findIndex(i => i.id === id);

    if (index === -1) {
      this.sendResponse(res, 404, { error: 'Learning instance not found' });
      return;
    }

    this.data.learningInstances.splice(index, 1);
    this.sendResponse(res, 204, null);
  }

  private isAuthenticated(req: IncomingMessage): boolean {
    const authHeader = req.headers.authorization;
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    return this.data.users.some(u => u.token === token);
  }

  private getBody(req: IncomingMessage, callback: (body: string) => void): void {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      callback(body);
    });
  }

  private sendResponse(res: ServerResponse, status: number, data: any): void {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }
}

if (require.main === module) {
  const server = new MockServer();
  server.start(3000);

  process.on('SIGINT', () => {
    server.stop();
    process.exit(0);
  });
}

export { MockServer };
EOF

# Create mockUI.html
echo -e "${GREEN}Creating mockUI.html...${NC}"
cat > mockUI.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AA Community Mock - Test Application</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            width: 90%;
            max-width: 1200px;
        }
        .login-form {
            max-width: 400px;
            margin: 0 auto;
            padding: 40px;
        }
        .login-form h2 {
            text-align: center;
            margin-bottom: 30px;
            color: #1a1a2e;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
        }
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        .submit-btn {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
        }
        .submit-btn:hover { background: #5568d3; }
        .error-message {
            background: #fee;
            color: #c33;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: none;
        }
        .dashboard { display: none; }
        .header {
            background: #1a1a2e;
            color: white;
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logout-btn {
            background: #ff4757;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
        }
        .content { padding: 30px; }
        .create-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            margin: 10px 10px 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="loginPage" class="login-form">
            <h2>🤖 AA Community Mock</h2>
            <div class="error-message" id="loginError"></div>
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" value="testuser" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" value="testpass" required>
                </div>
                <button type="submit" class="submit-btn">Sign In</button>
            </form>
            <p style="text-align: center; margin-top: 20px; color: #666;">
                Default: testuser / testpass
            </p>
        </div>

        <div id="dashboardPage" class="dashboard">
            <div class="header">
                <h1>Automation Dashboard</h1>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
            <div class="content">
                <h3>Automation</h3>
                <button class="create-btn">Create Task Bot</button>
                <button class="create-btn">Create Form</button>
                <div id="itemList"></div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'testuser' && password === 'testpass') {
                document.getElementById('loginPage').style.display = 'none';
                document.getElementById('dashboardPage').style.display = 'block';
            } else {
                document.getElementById('loginError').textContent = 'Invalid credentials';
                document.getElementById('loginError').style.display = 'block';
            }
        });

        function logout() {
            document.getElementById('loginPage').style.display = 'block';
            document.getElementById('dashboardPage').style.display = 'none';
        }
    </script>
</body>
</html>
HTMLEOF

# Update package.json with mock scripts
echo -e "${GREEN}Updating package.json...${NC}"
if [ -f "package.json" ]; then
    # Add ts-node if not present
    npm install --save-dev ts-node @types/node
    
    # Add mock scripts (you'll need to manually add these to scripts section)
    echo -e "${YELLOW}Add these scripts to your package.json:${NC}"
    echo '"mock:api": "ts-node mockServer.ts",'
    echo '"mock:ui": "npx http-server . -p 8080",'
    echo '"test:mock": "playwright test --config=playwright.mock.config.ts"'
fi

# Create .env for mock
echo -e "${GREEN}Creating .env.mock...${NC}"
cat > .env.mock << 'EOF'
# Mock Testing Configuration
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000
TEST_USERNAME=testuser
TEST_PASSWORD=testpass
HEADLESS=false
CI=false
EOF

# Create mock Playwright config
echo -e "${GREEN}Creating playwright.mock.config.ts...${NC}"
cat > playwright.mock.config.ts << 'EOF'
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
  },
  webServer: {
    command: 'npm run mock:api',
    port: 3000,
    reuseExistingServer: true,
  },
});
EOF

echo -e "\n${GREEN}✅ Setup complete!${NC}\n"
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. Copy .env.mock to .env: ${YELLOW}cp .env.mock .env${NC}"
echo -e "2. Start mock API: ${YELLOW}npx ts-node mockServer.ts${NC}"
echo -e "3. Or open mockUI.html in browser"
echo -e "4. Run tests: ${YELLOW}npm test${NC}\n"
echo -e "${GREEN}🎉 Happy Testing!${NC}"
EOF

chmod +x setup-mock.sh
echo "✅ Setup script created successfully!"