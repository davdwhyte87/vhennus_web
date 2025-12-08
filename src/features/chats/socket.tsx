

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../auth/useAuthStore";

// Define types for the events you will use
interface ServerToClientEvents {
  receive_message: (data: { message: string; senderId: string }) => void;
}

interface ClientToServerEvents {
  send_message: (data: { message: string }) => void;
}

export interface CreateChatReq {
  pair_id?: string;
  receiver: string;
  message?: string;
  image?: string;
}

export interface Chat {
  id: string;
  pair_id: string;
  sender: string;
  receiver: string;
  message: string;
  image?: string;
  created_at: string;
  updated_at: string;
}


// Create a typed socket object
//export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`wss://testbend.vhennus.com/api/v1/auth/chat/ws`);

// export const socket = io(`wss://testbend.vhennus.com/chat/ws?token=${localStorage.getItem('tokenAuth')}`);

// socket.on('connect', () => {
//   console.log('Connected with headers!');
// });


// const ws = new WebSocket(`wss://testbend.vhennus.com/chat/ws?token=${localStorage.getItem('tokenAuth')}`);

// ws.onopen = () => {
//   // recommended: send an auth message instead of relying on query string
//   ws.send(JSON.stringify({ type: 'authenticate', token: localStorage.getItem('tokenAuth') }));
// };

// ws.onmessage = (evt) => {
//   const msg = JSON.parse(evt.data);
//   console.log('msg', msg);
// };

// ws.onclose = (e) => console.log('closed', e.code, e.reason);
// ws.onerror = (err) => console.error('ws error', err);


// let socket = null


// try{
//     socket = new WebSocket(`wss://testbend.vhennus.com/chat/ws?token=${localStorage.getItem('tokenAuth')}`);
// }catch(err){
//     console.error("Failed to create WebSocket connection:", err);
// }

// if (socket) {

//     socket.onopen = () => {
//             console.log('WebSocket connected');
//     };
//     socket.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         console.log('Received message:', message);
//         // Handle incoming messages
//     };
//     socket.onclose = () => {
//         console.log('WebSocket disconnected');
//     };
//     socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//     };

//     function sendDataToServer(data:CreateChatReq) {
//         if (socket.readyState === WebSocket.OPEN) {
//             socket.send(JSON.stringify(data));
//         } else {
//             console.warn("Socket is not open. Data not sent.", data);
//         }
//     }
// }


interface WsContextType {
    isConnected: boolean;
    messages:Chat[]
    sendMessage: (data: CreateChatReq) => void;
}

export const WsContext = createContext<WsContextType | undefined>(undefined);

export const useWs = () => {
    const context = useContext(WsContext);
    if (!context) {
        throw new Error('useWs must be used within a WsProvider');
    }
    return context;
};  
   

export const WSChatProvider:React.FC<{ children: React.ReactNode }> = ({children})=>{
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Chat[]>([]);
    const [client, setClient] = useState<ChatClient | null>(null);


    useEffect(()=>{
        const handleMessage = (msg: Chat) => {

            setMessages(prev => [...prev, msg]);
        };

        const handleStatusChange = (status: boolean) => {
            setIsConnected(status);
        };

        const newClient = new ChatClient(handleMessage, handleStatusChange);
        setClient(newClient);

        return () => {
            newClient.disconnect();
        };

        
    },[])

    const sendMessage = useCallback((data: CreateChatReq) => {
        client?.sendDataToServer(data);
    }, [client]);

    const contextValue: WsContextType = {
        isConnected,
        messages,
        sendMessage,
    };

    return (
        <WsContext.Provider value={contextValue}>
            {children}
        </WsContext.Provider>  
    )
 
}




// Define the callbacks that the React component will pass to the client
type MessageHandler = (message: Chat) => void;
type StatusHandler = (isConnected: boolean) => void;

class ChatClient {
    private socket: WebSocket | null = null;
    private messageHandler: MessageHandler;
    private statusHandler: StatusHandler;

    // Reconnection fields
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 15;
    private initialReconnectDelayMs: number = 1000; // 1 second
    private maxReconnectDelayMs: number = 30000; // 30 seconds
    private reconnectTimeout: number | undefined;
    private reconnecting: boolean = false;
    private shouldReconnect: boolean = true; // Flag to stop reconnection on manual disconnect

    constructor(
        messageHandler: MessageHandler,
        statusHandler: StatusHandler
    ) {
        this.messageHandler = messageHandler;
        this.statusHandler = statusHandler;
        this.connect();
    }

    private getToken(): string | null {
        // Fetches the token from localStorage
        return useAuthStore.getState().token
    }

    private connect(): void {
        if (this.reconnecting || !this.shouldReconnect) return;
        
        const token = this.getToken();
        if (!token) {
            console.error("Authentication token not found. Cannot connect.");
            this.statusHandler(false);
            return;
        }
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error("Max reconnection attempts reached. Giving up.");
            this.statusHandler(false);
            return;
        }

        const wsUrl = `wss://testbend.vhennus.com/chat/ws?token=${token}`;
        
        try {
            this.reconnecting = true;
            this.socket = new WebSocket(wsUrl);
            this.setupListeners();
        } catch (err) {
            console.error("Failed to create WebSocket connection object:", err);
            this.scheduleReconnect();
        }
    }

    private setupListeners(): void {
        if (!this.socket) return;

        this.socket.onopen = () => {
            console.log('✅ WebSocket connected successfully.');
            this.reconnectAttempts = 0; // Reset attempts on successful connect
            this.reconnecting = false;
            this.statusHandler(true); // Notify React context of successful connection
        };
        
        this.socket.onmessage = (event: MessageEvent) => {
            try {
                const message: Chat = JSON.parse(event.data);
                console.log('new message', message)
                this.messageHandler(message); // Pass message to React context handler
            } catch (error) {
                console.error("Failed to parse incoming message:", error);
            }
        };

        this.socket.onclose = (event: CloseEvent) => {
            console.log(`⚠️ WebSocket disconnected. Code: ${event.code}. Reason: ${event.reason}`);
            this.statusHandler(false); // Notify React context of disconnection
            this.reconnecting = false;
            
            // Reconnect unless disconnect() was called or max attempts reached
            if (this.shouldReconnect) {
                this.scheduleReconnect();
            }
        };

        this.socket.onerror = (error: Event) => {
            console.error('❌ WebSocket error:', error);
            // The onerror handler usually leads to onclose, which handles reconnection.
        };
    }

    // Exponential Backoff with Jitter for Reconnection
    private scheduleReconnect(): void {
        const delay = this.getReconnectDelay();
        
        console.log(`Attempting to reconnect in ${delay / 1000}s... (Attempt ${this.reconnectAttempts + 1})`);
        
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay) as unknown as number; // Type assertion for NodeJS environments
    }

    private getReconnectDelay(): number {
        // Implement exponential backoff: Delay = Min(InitialDelay * 2^Attempts, MaxDelay) + Jitter
        const power = Math.pow(2, this.reconnectAttempts);
        let delay = this.initialReconnectDelayMs * power;
        
        // Add random jitter (up to 500ms) to prevent "thundering herd"
        const jitter = Math.random() * 500;
        delay = Math.min(delay + jitter, this.maxReconnectDelayMs);

        return Math.floor(delay);
    }

    /**
     * Public method to send data to the server.
     */
    public sendDataToServer(data: CreateChatReq): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn("Socket is not OPEN (State: " + (this.socket?.readyState || 'N/A') + "). Data not sent.", data);
            // Optionally: Queue messages to send once reconnected
        }
    }

    /**
     * Public method to manually close the connection and stop reconnection attempts.
     * CRITICAL for React component cleanup (componentWillUnmount/useEffect cleanup).
     */
    public disconnect(): void {
        this.shouldReconnect = false;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = undefined;
        }
        if (this.socket) {
            // Use a standard close code (1000: Normal Closure)
            this.socket.close(1000, "Client unmounted/manual disconnect");
            this.socket = null; 
        }
        this.statusHandler(false);
    }
}

export default ChatClient;

       
  
